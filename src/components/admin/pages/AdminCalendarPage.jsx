import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "./styles/AdminCalendarPage.css";

const localizer = momentLocalizer(moment);

const AdminCalendarPage = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchData(); // Fetch initial data
  }, []);

  useEffect(() => {
    // This useEffect will run whenever appointments state changes
    // console.log(appointments);
  }, [appointments]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost/api/get_appointments_admin"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const textData = await response.text();
      // console.log(textData);

      // Surround the parsing logic in a try-catch block
      try {
        // Split the string by "}{", append "{" to the beginning of each segment,
        // and append "}" to the end of each segment, then parse each segment
        const jsonObjects = textData
          .split("}{")
          .map((json, index, array) =>
            index === 0
              ? json + "}"
              : index === array.length - 1
              ? "{" + json
              : "{" + json + "}"
          );

        const appointments = jsonObjects.flatMap((json) => {
          try {
            const parsedResult = JSON.parse(json);
            return parsedResult.payload || [];
          } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            return [];
          }
        });

        setAppointments(appointments);
      } catch (splitError) {
        console.error("Error splitting JSON:", splitError);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleDateClick = (date) => {
    // Handle date click as needed
    setShowAppointmentForm(true);
  };

// Map your data to include start and end fields
const mappedAppointments = appointments.map((appointment) => {
  const status = appointment.status.toLowerCase(); // Ensure it's lowercase for case-insensitive comparison

  return {
    ...appointment,
    title: `${appointment.fname}'s appointment for ${appointment.name}`, // Display user and pet names in the title
    start: new Date(`${appointment.date} ${appointment.time}`),
    end: new Date(`${appointment.date} ${appointment.time}`),
  };
});

const eventStyleGetter = (event, start, end, isSelected) => {
  const status = event.status.toLowerCase(); // Ensure it's lowercase for case-insensitive comparison
  const className = status === "accepted" ? "accepted" : "not-accepted";

  return {
    className,
  };
};

const handleEventClick = (event) => {
  // Handle event click as needed
  alert(`Clicked event: ${event.title}`);
};

  return (
    <div className="admin-calendar-page">
      <h1>Admin Calendar Page</h1>
      <div className="legend">
        <div className="legend-item">
          <span className="not-accepted" /> Pending
        </div>
        <div className="legend-item">
          <span className="accepted" /> Accepted
        </div>
      </div>
      <Calendar
        key={JSON.stringify(appointments)} // Add key prop based on appointments
        localizer={localizer}
        events={mappedAppointments}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={(slotInfo) => handleDateClick(slotInfo.start)}
        onSelectEvent={handleEventClick} // Handle event click

        selectable
        popup
        views={["month", "week", "day"]}
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter} // Use this to apply dynamic class names
      />

    </div>
  );
};

export default AdminCalendarPage;
