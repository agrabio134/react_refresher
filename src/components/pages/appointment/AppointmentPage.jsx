// Your main component file
import AppointmentForm from "./AppointmentForm";
import AppointmentLog from "./AppointmentLog";
import "./Styles/AppointmentPage.css";
import ErrorBoundary from "../../ErrorBoundary";

const AppointmentPage = () => {
  return (
    <section className="whole-appointment-container">
      <div className="main-appointment-container">
      <ErrorBoundary>
      <AppointmentForm />
      <AppointmentLog />
      </ErrorBoundary>
      </div>
    </section>
  );
};

export default AppointmentPage;
