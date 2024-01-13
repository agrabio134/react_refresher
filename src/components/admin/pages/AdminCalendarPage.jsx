import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Modal, Button, Descriptions, Image } from "antd";

import "./styles/AdminCalendarPage.css";
import Swal from "sweetalert2";

// Modal.setAppElement("#root"); // Assuming "#root" is the ID of your root element

const localizer = momentLocalizer(moment);

const AdminCalendarPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalTransitioning, setIsModalTransitioning] = useState(false);
  const [modalScale, setModalScale] = useState(0);

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
        "https://happypawsolongapo.com/api/get_appointments_admin"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const textData = await response.text();

      // Surround the parsing logic in a try-catch block
      try {
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
    // setShowAppointmentForm(true);
  };


  // Map your data to include start and end fields
  const mappedAppointments = appointments.map((appointment) => {
    const status = appointment.status.toLowerCase(); // Ensure it's lowercase for case-insensitive comparison
    const startDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    return {
      ...appointment,
      title: `${appointment.fname}'s appointment for ${appointment.name}`, // Display user and pet names in the title
      start: startDateTime,
      end: endDateTime,
    };
  });

  const eventStyleGetter = (event) => {
    const status = event.status.toLowerCase(); // Ensure it's lowercase for case-insensitive comparison
    let className = "";

    if (status === "accepted") {
      className = "accepted";
    } else if (status === "denied") {
      className = "denied";
    } else if (status === "done") {
      className = "done";
    } else if (status === "canceled") {
      className = "canceled";
    } else if (status === "pending cancellation") {
      className = "pending-cancellation";
     
    } else {
      className = "not-accepted";
    }

    return {
      className,
    };
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalTransitioning(true);
    setModalScale(0.5); // Adjust the scaling factor for the zoom-out effect
    setTimeout(() => {
      setSelectedEvent(null);
      setIsModalOpen(false);
      setIsModalTransitioning(false);
      setModalScale(1); // Reset the scale after the modal is closed
    }, 300); // Adjust the timeout based on your transition duration
  };

  const handleAccept = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, accept it!",
      showDenyButton: true,
      denyButtonColor: "#d33",
      denyButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Accepted!", "Appointment has been accepted.", "success");
        handleConfirmAccept(e);
        window.location.reload();
      }
    });
  };

  const handleConfirmAccept = async (e) => {
    e.preventDefault();

    const id = selectedEvent.t1_id;
    try {
      const response = await fetch(
        `https://happypawsolongapo.com/api/accept_appointment_admin/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      } else {
        console.log("Success", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleDecline = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, decline it!",
      showDenyButton: true,
      denyButtonColor: "#d33",
      denyButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Declined!", "Appointment has been set declined.", "success");
        handleConfirmDecline();
        window.location.reload();
      }
    });
  };

  const handleConfirmDecline = async () => {
    const id = selectedEvent.t1_id;
    try {
      const response = await fetch(
        `https://happypawsolongapo.com/api/decline_appointment_admin/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      } else {
        console.log("Success", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleDone = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, done it!",
      showDenyButton: true,
      denyButtonColor: "#d33",
      denyButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Done!", "Appointment has been set done.", "success");
        handleConfirmDone();
        window.location.reload();
      }
    });
  };


  const handleConfirmDone = async () => {
    const id = selectedEvent.t1_id;
    try {
      const response = await fetch(
        `https://happypawsolongapo.com/api/done_appointment_admin/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      } else {
        console.log("Success", response);
      }
      window.location.reload();
      Swal.fire("Done!", "Appointment has been set done.", "success");
      handleConfirmDone();


    } catch (error) {
      console.error("Error fetching data:", error.message);

    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, done it!",
      showDenyButton: true,
      denyButtonColor: "#d33",
      denyButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Done!", "Appointment has been set done.", "success");
        handleConfirmCancel();
        window.location.reload();
      }
    });
  };  

  const handleConfirmCancel = async () => {
    const id = selectedEvent.t1_id;
    try {
      const response = await fetch(
        `https://happypawsolongapo.com/api/cancel_appointment_force/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      } else {
        console.log("Success", response);
      }
      window.location.reload();
      Swal.fire("Done!", "Appointment has been set done.", "success");
      handleConfirmDone();
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const formatTimeWithOneHourIncrement = (time) => {
    const currentTime = new Date(`2000-01-01 ${time}`);
    currentTime.setHours(currentTime.getHours() + 1); // Adding 1 hour
    return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        <div className="legend-item">
          <span className="done" /> Done
        </div>
        <div className="legend-item">
          <span className="denied" /> Denied
        </div>
        <div className="legend-item">
          <span className="canceled" /> Cancelled
        </div>
        <div className="legend-item">
          <span className="pending-cancellation" />Pending Cancellation
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

      <Modal
        visible={isModalOpen}
        onCancel={closeModal}
        title="Appointment Details"
        footer={null}
        destroyOnClose
      >
        {selectedEvent && (
          <div>
            <h2>{selectedEvent.title}</h2>
            <p>{selectedEvent.start.toLocaleString()}</p>
            <Image
              src={`${selectedEvent.image}`}
              alt="pet"
              width={100}
              height={100}
              style={{ marginBottom: 10 }}
            />
            <Descriptions column={1}>
              <Descriptions.Item label="Full Name: ">
                {selectedEvent.fname} {selectedEvent.lname}
              </Descriptions.Item>
              <Descriptions.Item label="Email: ">
                {selectedEvent.email}
              </Descriptions.Item>
              <Descriptions.Item label="Contact Number: ">
                {selectedEvent.contact_no}
              </Descriptions.Item>

              <Descriptions.Item label="Pet Name: ">
                {selectedEvent.name}
              </Descriptions.Item>

              <Descriptions.Item label="Date: ">
                {selectedEvent.date}
              </Descriptions.Item>
              <Descriptions.Item label="Time: ">
               {selectedEvent.time && (
                <div>
                 {formatTime(selectedEvent.time)} - {formatTimeWithOneHourIncrement(selectedEvent.time)}
                </div>
                  )}
              </Descriptions.Item>

              <Descriptions.Item label="Reason for Appointment: s">
                {selectedEvent.reason}
              </Descriptions.Item>
              {/* add if else */}

              {/* if reason for cancellation is NOT NULL, show this */}

              {selectedEvent.cancellation_reason && (
                <Descriptions.Item label="Reason for Cancellation: ">
                  {selectedEvent.cancellation_reason}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedEvent.status === "pending" && (
              <div>
                <Button
                  onClick={handleAccept}
                  style={{ marginTop: 10, marginRight: 10 }}
                >
                  Accept
                </Button>
                <Button onClick={handleDecline} style={{ marginTop: 10 }}>
                  Decline
                </Button>
              </div>
            )}


            {selectedEvent.status === "accepted" && (
              <div>
                <Button
                  onClick={handleDone}
                  style={{ marginTop: 10, marginRight: 10 }}
                >
                  Done
                </Button>
              </div>
            )}

            {selectedEvent.status === "pending cancellation" && (
              <div>
                <Button
                  onClick={handleCancel}
                  style={{ marginTop: 10, marginRight: 10 }}
                >
                  Confirm Cancellation
                </Button>
              </div>
            )}



          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminCalendarPage;
