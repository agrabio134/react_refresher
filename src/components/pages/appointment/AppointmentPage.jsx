import React, { useState } from 'react';
import AppointmentFormConsult from './AppointmentFormConsult';
import AppointmentFormGroom from './AppointmentFormGroom';
import AppointmentFormVaccine from './AppointmentFormVaccine';
import AppointmentLog from './AppointmentLog';
import './Styles/AppointmentPage.css';
import ErrorBoundary from '../../ErrorBoundary';

const AppointmentPage = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleAppointmentSelection = (type) => {
    setSelectedAppointment(type);
  };

  const handleGoBack = () => {
    setSelectedAppointment(null);
  };

  return (
    <section className="whole-appointment-container">
      <div className="main-appointment-container">
        <ErrorBoundary>
          {/* Appointment Type Cards */}
          {selectedAppointment === null && (
            <div className="appointment-type">
              <h2>Appointment</h2>
              <div className="appointment-type-container">
                <div className="appointment-type-card" onClick={() => handleAppointmentSelection('Consultation')}>
                  <img src="/page/stethoscope.png" alt="consultation" />
                  <h3>Consultation</h3>
                  <p>For general checkup and consultation</p>
                </div>
                <div className="appointment-type-card" onClick={() => handleAppointmentSelection('Vaccination')}>
                  <img src="/page/vaccine.png" alt="vaccination" />
                  <h3>Vaccination</h3>
                  <p>For vaccination and immunization</p>
                </div>
                <div className="appointment-type-card" onClick={() => handleAppointmentSelection('Grooming')}>
                  <img src="/page/scissor-tool.png" alt="grooming" />
                  <h3>Grooming</h3>
                  <p>For grooming</p>
                </div>
              </div>
            </div>
          )}

          {/* Selected Appointment Form */}
          {selectedAppointment && (
            <div>
              <button onClick={handleGoBack} className='backBtn'>Back</button>
              {selectedAppointment === 'Grooming' && <AppointmentFormGroom />}
              {selectedAppointment === 'Vaccination' && <AppointmentFormVaccine />}
              {selectedAppointment === 'Consultation' && <AppointmentFormConsult />}
            </div>
          )}

          {/* Appointment Log */}
          <AppointmentLog />
        </ErrorBoundary>
      </div>
    </section>
  );
};

export default AppointmentPage;
