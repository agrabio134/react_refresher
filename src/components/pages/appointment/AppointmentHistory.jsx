import "./Styles/AppointmentLogItems.css"; // Import your CSS file for styling

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
     
    </tr>
  );
};

export default AppointmentLogItem;
