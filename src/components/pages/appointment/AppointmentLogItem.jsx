import "./Styles/AppointmentLogItems.css"; // Import your CSS file for styling
import Swal from "sweetalert2";
const formatTime = (time) => {
  const [hour, minute] = time.split(":").map(Number);

  // Check if it's 13 or more to convert to PM format
  const period = hour >= 13 ? "pm" : "am";

  // Adjust the hour for PM format
  const formattedHour = hour > 12 ? hour - 12 : hour;

  return `${formattedHour}:${minute === 0 ? "00" : minute}${period}`;
};

const getDayOfWeek = (date) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayIndex = new Date(date).getDay();
  return daysOfWeek[dayIndex];
};

const AppointmentLogItem = ({ appointment, index }) => {
  const statusClass = appointment.status.toLowerCase();


  // console.log(appointment.tb1_id);
  const handleAction = async () => {
    // Display a confirmation alert
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      const id =  appointment.tb1_id;

  

      try {
        const response = await fetch(
          `https://happypawsolongapo.com/api/cancel_appointment/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            // No need to include the body for a cancellation if your backend doesn't expect it
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        console.log("Success", response);
        Swal.fire("Cancelled!", "Your appointment has been cancelled.", "success");
        window.location.reload();

      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "Your appointment is safe :)", "error");
    }
  };


  return (
    <tr className={`appointment-log-item ${statusClass}`}>
      <td className="id-column">{index + 1}</td>
      <td className="date-column">
        {getDayOfWeek(appointment.date)},{" "}
        {new Date(appointment.date).toLocaleDateString()}
      </td>
      <td className="time-column">{formatTime(appointment.time)}</td>
      <td className="name-column">{appointment.name}</td>
      <td className="image-column">
        <img
          src={`${appointment.image}`}
          alt={appointment.name}
          className="pet-image"
        />
      </td>
      <td className="service-column">{appointment.reason}</td>
      <td className={`status-column ${statusClass}`}>{appointment.status}</td>
      <td className="action-column">
        {/* Add your action button or link here */}
        <button className="action-button" onClick={handleAction}>
        <i className="fa-solid fa-xmark"></i>
        </button>
      </td>
    </tr>
  );
};

export default AppointmentLogItem;
