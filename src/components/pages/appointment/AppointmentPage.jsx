// Your main component file
import AppointmentForm from "./AppointmentForm";
import AppointmentLog from "./AppointmentLog";
import "./Styles/AppointmentPage.css";
const AppointmentPage = () => {
  return (
    <section className="whole-appointment-container">
      <div className="main-appointment-container">
      <AppointmentForm />
      <AppointmentLog />
      </div>
    </section>
  );
};

export default AppointmentPage;
