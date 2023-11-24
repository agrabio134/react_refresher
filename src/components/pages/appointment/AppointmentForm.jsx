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
    setIsSubmitting(true);

    try {
      // Check if the user is logged in (has authToken)
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        const userId = getUserIdFromToken(authToken);
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

        await createAppointment(authToken, userId);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Appointment created successfully.",
        });
      } else {
        // Code for handling appointments when the user is not logged in
        // Adjust this part based on your requirements for non-authenticated users
        await createNonAuthenticatedAppointment(selectedDate, selectedTimeSlot, selectedPet);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Appointment created successfully for non-authenticated user.",
        });
      }
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

  // PET

  useEffect(() => {
    fetchPets();
  }, []); // Fetch pets when the component mounts

  const handlePetChange = (petId) => {
    setSelectedPet(petId);
  };

  const authToken = localStorage.getItem("authToken");
  const decodedToken = jwt_decode(authToken);

  const userId = decodedToken ? decodedToken.user_id : null;

  // console.log(userId);

  // get user id

  const fetchPets = async () => {
    try {
      const response = await fetch(`http://localhost/api/get_user_pets/${userId}`);
      const result = await response.text(); // Get the raw response as text

      // Split the response into separate JSON objects
      const jsonObjects = result.split("}{");

      // Handle each JSON object separately
      jsonObjects.forEach((json, index) => {
        let parsedJson;

        // Add '{' and '}' back to the first and last objects
        if (index === 0) {
          json = json + "}";
        } else if (index === jsonObjects.length - 1) {
          json = "{" + json;
        }

        try {
          parsedJson = JSON.parse(json);
          if (parsedJson.payload && parsedJson.payload.length > 0) {
            setPets(parsedJson.payload);
            // console.log("Pets successfully fetched:", parsedJson);
          }
        } catch (jsonError) {
          // Handle the case where parsing as JSON failed
          console.error("Error parsing JSON:", jsonError);
          console.log("Raw response:", json);
          throw new Error("Failed to parse JSON response");
        }
      });
    } catch (error) {
      console.error("Error fetching pets:", error);
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
