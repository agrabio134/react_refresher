import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";

const AppointmentForm = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPendingAppointment, setHasPendingAppointment] = useState(false);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");

  useEffect(() => {
    fetchTimeSlots(selectedDate);
    checkPendingAppointment(selectedDate);
  }, [selectedDate]);

  const fetchTimeSlots = async (date) => {
    try {
      const formattedDate = date.toISOString().split("T")[0];

      const response = await fetch(
        `http://localhost/api/get_available_time_slots/${formattedDate}`
      );
      const rawResponse = await response.text();
      const timeSlotsStartIndex = rawResponse.indexOf("[");
      const timeSlotsEndIndex = rawResponse.lastIndexOf("]");
      const timeSlotsJSON = rawResponse.substring(
        timeSlotsStartIndex,
        timeSlotsEndIndex + 1
      );
      const parsedTimeSlots = JSON.parse(timeSlotsJSON);

      const bookedResponse = await fetch(
        `http://localhost/api/get_booked_time_slots/${formattedDate}`
      );
      const bookedTimeSlotsData = await bookedResponse.json();
      const bookedTimeSlotsArray = Array.isArray(bookedTimeSlotsData)
        ? bookedTimeSlotsData
        : [];

      setTimeSlots(parsedTimeSlots);
      setBookedTimeSlots(bookedTimeSlotsArray);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  const checkPendingAppointment = async (date) => {
    try {
      const formattedDate = date.toISOString().split("T")[0];
      const response = await fetch(
        `http://localhost/api/check_pending_appointment/${formattedDate}`
      );
      const data = await response.json();
      setHasPendingAppointment(data.hasPendingAppointment);
    } catch (error) {
      console.error("Error checking pending appointment:", error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchTimeSlots(date);
    checkPendingAppointment(date);
  };

  const handleTimeSlotChange = (time) => {
    setSelectedTimeSlot(time);
  };

  const handleAppointmentSubmit = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "You must be logged in to make an appointment.",
        confirmButtonText: "Okay",
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to login page
          window.location.href = "/auth/login";
        }
      });
      return;
    }

    let userId;

    try {
      const response = await fetch(
        `http://localhost/api/get_user_id/${authToken}`,
        {
          method: "GET",
        }
      );

      const responseData = await response.text();
      const jsonObjects = responseData.split("}{").map((obj, index, array) => {
        return index < array.length - 1 ? `${obj}}` : obj;
      });

      for (let i = 0; i < jsonObjects.length; i++) {
        const jsonObject = jsonObjects[i];

        try {
          const data = JSON.parse(jsonObject);

          if (
            data.status &&
            data.status.remarks === "success" &&
            data.payload &&
            typeof data.payload[0] !== "undefined" &&
            typeof data.payload[0].id !== "undefined"
          ) {
            userId = data.payload[0].id;
            break;
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }

      if (!userId) {
        console.error(
          "Error fetching user ID: No valid user ID found in the response"
        );
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch user ID. No valid user ID found in the response.",
        });
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch user ID. Please try again.",
      });
    }

    setIsSubmitting(true);

    try {
      if (hasPendingAppointment) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "You already have a pending appointment. You can only have one appointment at a time.",
        });
        return;
      }

      if (bookedTimeSlots.includes(selectedTimeSlot)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "The selected time slot is already booked. Please choose another time.",
        });
        return;
      }

      await fetch("http://localhost/api/create_appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          date: selectedDate.toISOString().split("T")[0],
          time: selectedTimeSlot,
          user_Id: userId,
          pet_Id: selectedPet,
        }),
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Appointment created successfully.",
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create appointment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      fetchTimeSlots(selectedDate);
      checkPendingAppointment(selectedDate);
    }
  };

  const formatTimeSlotLabel = (time) => {
    const [hours, minutes, seconds] = time.split(":");
    const formattedHours = parseInt(hours, 10) % 12 || 12;
    const period = parseInt(hours, 10) < 12 ? "AM" : "PM";
    return `${formattedHours}:${minutes} ${period}`;
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handlePetChange = (petId) => {
    setSelectedPet(petId);
  };

  const fetchPets = async () => {
    try {
      const response = await fetch(`http://localhost/api/get_user_pets/${userId}`);
      const result = await response.text();

      const jsonObjects = result.split("}{");

      jsonObjects.forEach((json, index) => {
        let parsedJson;

        if (index === 0) {
          json = json + "}";
        } else if (index === jsonObjects.length - 1) {
          json = "{" + json;
        }

        try {
          parsedJson = JSON.parse(json);
          if (parsedJson.payload && parsedJson.payload.length > 0) {
            setPets(parsedJson.payload);
          }
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          console.log("Raw response:", json);
          throw new Error("Failed to parse JSON response");
        }
      });
    } catch (error) {
      // console.error("Error fetching pets:", error);
    }
  };

  return (
    <div className="appointment-form-container">
      <div className="form-group">
        <label>Select Date:</label>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          className="static-calendar"
          minDate={new Date()}
        />
      </div>

      <div className="form-group">
        <label>Select Time Slot:</label>
        <select
          value={selectedTimeSlot}
          onChange={(e) => handleTimeSlotChange(e.target.value)}
          disabled={isSubmitting}
        >
          {timeSlots.map((time) => (
            <option
              key={time}
              value={time}
              disabled={bookedTimeSlots.includes(time) || isSubmitting}
            >
              {formatTimeSlotLabel(time)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Select Pet:</label>
        <select
          value={selectedPet}
          onChange={(e) => handlePetChange(e.target.value)}
          disabled={isSubmitting}
        >
          <option value="" disabled>
            Select a pet
          </option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name} - {pet.type}
            </option>
          ))}
        </select>
      </div>

      <button
        className="submit-button"
        onClick={handleAppointmentSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Appointment'}
      </button>

      {hasPendingAppointment && <p>You have a pending appointment.</p>}
    </div>
  );
};

export default AppointmentForm;
