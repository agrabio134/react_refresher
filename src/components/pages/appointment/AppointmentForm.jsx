import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";
import "./Styles/AppointmentForm.css";

const AppointmentForm = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("07:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPendingAppointment, setHasPendingAppointment] = useState(false);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [pets, setPets] = useState([]);
  // const [selectedPet, setSelectedPet] = useState("");
  const [selectedPets, setSelectedPets] = useState([]);

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

  const handlePetChange = (petId) => {
    setSelectedPets((prevSelectedPets) =>
      prevSelectedPets.includes(petId)
        ? prevSelectedPets.filter((id) => id !== petId)
        : [...prevSelectedPets, petId]
    );
    // Check if the petId is already in the selectedPets array
    const petIndex = selectedPets.indexOf(petId);

    if (petIndex === -1) {
      // If not, add it to the array
      setSelectedPets([...selectedPets, petId]);
    } else {
      // If it is, remove it from the array
      const updatedPets = [...selectedPets];
      updatedPets.splice(petIndex, 1);
      setSelectedPets(updatedPets);
    }
  };

  const handleAppointmentSubmit = async () => {
    let authToken = sessionStorage.getItem("authToken");

    if (!authToken) {
      authToken = localStorage.getItem("authToken");

      if (!authToken) {
        // Show alert and redirect to login if not logged in
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "You must be logged in to make an appointment.",
          confirmButtonText: "Okay",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/auth/login";
          }
        });
        return;
      }
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

      if (selectedPets.length === 0) {
        // Handle the case where no pets are selected
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please select at least one pet.",
        });
        return;
      }

      // Create an array of appointment objects for each selected pet
      const appointments = selectedPets.map((petId) => ({
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTimeSlot,
        user_Id: userId,
        pet_Id: petId,
      }));

      // Make a request for each appointment
      const appointmentResults = await Promise.all(
        appointments.map(async (appointment) => {
          const response = await fetch(
            "http://localhost/api/create_appointments",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify(appointment),
            }
          );

          // console.log("Response:", appointment);

          return await response.json();
        })
      );

      // Check the results and display appropriate messages

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Your appointment has been booked.",
      });
    } catch (error) {
      console.error("Error creating appointments:", error);
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
  }, []); // Fetch pets when the component mounts

  const fetchPets = async () => {
    let authToken =
      sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

    const decodedToken = jwt_decode(authToken);

    const userId = decodedToken ? decodedToken.user_id : null;
    try {
      const response = await fetch(
        `http://localhost/api/get_user_pets/${userId}`
      );
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
      <div className="form-sub-container">
        <div className="form-group">
          <label>Select Date:</label>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="static-calendar"
            minDate={new Date()}
          />

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
      </div>

      <div className="form-sub-container">
        <div className="form-input-container">
          <div className="pet-card">
            <div className="pet-card-header">
              <label>Select Pet:</label>
            </div>
            <div className="pet-card-body">
              <div className="pet-card-container">
                {pets.map((pet) => (
                  <div>
                    <label
                      key={pet.id}
                      id="pet-item"
                      htmlFor={`pet-${pet.id}`}
                      className={`pet-checkbox ${
                        selectedPets.includes(pet.id) ? "checked" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`pet-${pet.id}`}
                        value={pet.id}
                        checked={selectedPets.includes(pet.id)}
                        onChange={() => handlePetChange(pet.id)}
                        disabled={isSubmitting}
                      />
                      <div className="pet-details">
                        <img src="https://via.placeholder.com/150" alt="pet" />
                        <p className="pet-name">Pet name: {pet.name}</p>
                        <p className="pet-breed">Breed: {pet.breed}</p>
                        <p className="pet-age">Age: {pet.age}</p>
                      </div>
                    </label>
                  </div>
                ))}

                <div
                  className="pet-card-Item add-pet-card"
                  onClick={() => {
                    window.location.href = "/profile";
                  }}
                >
                  <div className="add-pet-button">
                    <span>Add Pet</span>
                    <span>+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            className="submit-button"
            onClick={handleAppointmentSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Appointment"}
          </button>

          {hasPendingAppointment && <p>You have a pending appointment.</p>}
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
