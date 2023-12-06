import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";
import "./Styles/AppointmentForm.css";
import {
  calculateAgeInMonths,
  calculateAgeInDays,
} from "../utils/petAgeCalculation";

// import AppointmentLog from "./AppointmentLog";

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
  const [selectedType, setSelectedType] = useState("Grooming");
  const [selectedReason, setSelectedReason] = useState("");

  useEffect(() => {
    fetchTimeSlots(selectedDate);
    checkPendingAppointment(selectedDate);
  }, [selectedDate]);

  const handleTypeChange = (value) => {
    setSelectedType(value);

    if (value !== "Others") {
      setSelectedReason("");
    }
  };

  const handleReasonChange = (value) => {
    setSelectedReason(value);
  };

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
      const bookedTimeSlotsData = await bookedResponse.text();
      const bookedTimeSlotsStartIndex = bookedTimeSlotsData.indexOf("[");
      const bookedTimeSlotsEndIndex = bookedTimeSlotsData.lastIndexOf("]");
      const bookedTimeSlotsJSON = bookedTimeSlotsData.substring(
        bookedTimeSlotsStartIndex, // 1
        bookedTimeSlotsEndIndex + 1 // 2
      );
      const bookedTimeSlotsDataArray = bookedTimeSlotsJSON.split("}{");
      const bookedTimeSlotsDataArrayWithBrackets = bookedTimeSlotsDataArray.map(
        (obj, index, array) => {
          return index < array.length - 1 ? `${obj}}` : obj;
        }
      );
      const bookedTimeSlotsArray = bookedTimeSlotsDataArrayWithBrackets.map(
        (bookedTimeSlot) => {
          const parsedBookedTimeSlot = JSON.parse(bookedTimeSlot);
          // console.log("parsedBookedTimeSlot:", parsedBookedTimeSlot);
          return parsedBookedTimeSlot.time;
        }
      );

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
    // Adjust the date to your desired timezone
    const adjustedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    setSelectedDate(adjustedDate);
    fetchTimeSlots(adjustedDate);
    checkPendingAppointment(adjustedDate);
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

    try {
      const petId = selectedPets[0];
      const date = selectedDate.toISOString().split("T")[0];

      // console.log("petId:", petId);
      const response = await fetch(
        `http://localhost/api/check_existing_appointment/${petId}/${date}`,
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

        // console.log("jsonObject:", jsonObject);
        // if payload is empty, no appointment exists

        try {
          const data = JSON.parse(jsonObject);
          // console.log("data:", data);

          const pet = pets.find((pet) => pet.id === petId);

          if (data.payload.length > 0) {
            Swal.fire({
              icon: "error",
              title: "Error",
              html: `<strong>${pet.name}</strong> already has an appointment. You can only have one appointment per pet at a time.`,
            });
            return;
          } else {
            return;
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
        reason: selectedType === "Others" ? selectedReason : selectedType,
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

      window.location.reload();
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
            formatShortWeekday={(locale, date) => {
              const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              const index = date.getDay();
              return days[index];
            }}
            formatDay={(locale, date) => {
              const options = { day: "numeric" };
              return new Intl.DateTimeFormat(locale, options).format(date);
            }}
            onClickDay={(value, event) => {
              // Check if the click event originated from inside the calendar
              const isInsideCalendar =
                event.target.closest(".react-calendar") !== null;

              // Only update the selected date if the click is inside the calendar
              if (isInsideCalendar) {
                handleDateChange(value);
              }
            }}
            calendarType="US" // Set calendarType to "US" for Sunday as the first day of the week
          />

          <label>Select Time Slot:</label>
          <select
            value={selectedTimeSlot}
            onChange={(e) => handleTimeSlotChange(e.target.value)}
            disabled={isSubmitting}
          >
            {timeSlots.map((time) => (
              <option
                className="value-container"
                key={time}
                value={time}
                disabled={bookedTimeSlots.includes(time) || isSubmitting}
                style={{
                  color: bookedTimeSlots.includes(time) ? "gray" : "white",
                  pointerEvents:
                    bookedTimeSlots.includes(time) || isSubmitting
                      ? "none !important"
                      : "auto",
                }}
              >
                {formatTimeSlotLabel(time)}
              </option>
            ))}
          </select>

          <label>Reason of Appointment:</label>

          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="Grooming">Grooming</option>
            <option value="Vaccination">Vaccination</option>
            <option value="Checkup">Checkup</option>
            <option value="Others">Others</option>
          </select>

          {selectedType === "Others" && (
            <div className="others-container">
              <label>Others:</label>
              <input
                type="text"
                placeholder="Enter Reason"
                value={selectedReason}
                onChange={(e) => handleReasonChange(e.target.value)}
                disabled={isSubmitting}
                className="others-input"
                maxLength={15}
              />
              <p>Max Character: {selectedReason.length}/15</p>
            </div>
          )}
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
                  <div key={pet.id}>
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
                        <img src={`${pet.image}`} alt={pet.image} />
                        <p className="pet-name">
                          Pet name: <b>{pet.name}</b>
                        </p>
                        <p className="pet-breed">
                          Type: <b>{pet.type}</b>
                        </p>
                        <p className="pet-breed">
                          Breed: <b>{pet.breed}</b>
                        </p>
                        <p className="pet-age">
                          Age:{" "}
                          <b>
                            {calculateAgeInMonths(pet.birthdate) >= 12 ? (
                              <>
                                {Math.floor(
                                  calculateAgeInMonths(pet.birthdate) / 12
                                )}{" "}
                                {Math.floor(
                                  calculateAgeInMonths(pet.birthdate) / 12
                                ) === 1
                                  ? "year"
                                  : "years"}
                                {calculateAgeInMonths(pet.birthdate) % 12 >
                                  0 && (
                                  <>
                                    {" and "}
                                    {calculateAgeInMonths(pet.birthdate) %
                                      12}{" "}
                                    {calculateAgeInMonths(pet.birthdate) %
                                      12 ===
                                    1
                                      ? "month"
                                      : "months"}
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                {calculateAgeInMonths(pet.birthdate) < 1 ? (
                                  <>
                                    {calculateAgeInDays(pet.birthdate)}{" "}
                                    {calculateAgeInDays(pet.birthdate) === 1
                                      ? "day"
                                      : "days"}
                                  </>
                                ) : (
                                  <>
                                    {calculateAgeInMonths(pet.birthdate)}{" "}
                                    {calculateAgeInMonths(pet.birthdate) < 2
                                      ? "month"
                                      : "months"}
                                  </>
                                )}
                              </>
                            )}
                          </b>
                        </p>
                        <p className="pet-sex">
                          Sex: <b>{pet.sex}</b>
                        </p>
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
                    <i className="fa-solid fa-plus"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            className="apoint-submit-button"
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
