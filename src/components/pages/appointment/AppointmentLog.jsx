import React, { useState, useEffect } from "react";
import AppointmentLogItem from "./AppointmentLogItem";
import "./Styles/AppointmentLog.css";
import Swal from "sweetalert2";

const AppointmentLog = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let authToken =
    sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

  if (authToken === null) {
    return null;
  } else {
    let payload = authToken.split(".")[1];

    payload = window.atob(payload);
    payload = JSON.parse(payload);
    let userId = payload.user_id;

    useEffect(() => {
      const fetchAppointments = async () => {
        try {
          const response = await fetch(
            `http://localhost/api/get_appointments/${userId}`
          );

          if (response.status === 404) {
            console.log("No Data Found");
            setAppointments([]); // Set appointments to an empty array
            setLoading(false);
            return;
          }

          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
          }

          const textData = await response.text();

          const jsonObjects = textData.split("}{").map((json, index, array) => {
            return index === 0
              ? json + "}"
              : index === array.length - 1
              ? "{" + json
              : "{" + json + "}";
          });

          const appointments = jsonObjects.flatMap((json) => {
            try {
              const parsedResult = JSON.parse(json);

              if (
                parsedResult.status &&
                parsedResult.status.remarks === "success"
              ) {
                return parsedResult.payload;
              } else {
                // console.error("Error fetching appointments:", parsedResult.error);
                return [];
              }
            } catch (jsonError) {
              console.error("Error parsing JSON:", jsonError);
              return [];
            }
          });

          // Sort appointments in descending order based on created_at timestamp
          const sortedAppointments = appointments.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          setAppointments(sortedAppointments.filter(Boolean));
          setLoading(false);
        } catch (error) {
          // Suppress any errors
          setLoading(false);
        }
      };

      fetchAppointments();
    }, [userId]);
  }

  return (
    <div className="appointment-log-container">
      <h2>Appointment Log</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : appointments.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <table className="appointment-log-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Time</th>
              <th>Pet Name</th>
              <th>Pet Image</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <AppointmentLogItem
                key={appointment.id}
                appointment={appointment}
                index={index + 0} // Adjust index to start from 1
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentLog;
