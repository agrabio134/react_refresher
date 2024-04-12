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
    <section id="appointment">
      <div className="main-appointment-container">
        <ErrorBoundary>
          {/* Appointment Type Cards */}
          {selectedAppointment === null && (
            <div className="appointment-type">
              <h2>Appointment Categories</h2>
              <div class="bar"></div>
              <div className="appointment-type-container">
                <div className="single-features" onClick={() => handleAppointmentSelection('Consultation')}>
                  <div className='img-container'>
                    <img src="/page/consultation.png" alt="consultation" />
                  </div>
                  <h3>Consultation</h3>
                  <p>For general checkup and consultation</p>
                </div>
                <div className="single-features" onClick={() => handleAppointmentSelection('Vaccination')}>
                <div className='img-container'>
                    <img src="/page/vaccination.png" alt="Vaccination" />
                  </div>
                  <h3>Vaccination</h3>
                  <p>For vaccination and immunization</p>
                </div>
                <div className="single-features" onClick={() => handleAppointmentSelection('Grooming')}>
                <div className='img-container'>
                    <img src="/page/groom.png" alt="Grooming" />
                  </div>
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
              {selectedAppointment === 'Grooming' && <div><h1>Grooming</h1><p>For grooming</p><AppointmentFormGroom /></div>}
              {selectedAppointment === 'Vaccination' && <div><h1>Vaccination</h1><p>For vaccination and immunization</p><AppointmentFormVaccine /></div>}
              {selectedAppointment === 'Consultation' && <div><h1>Consultation</h1><p>For general checkup and consultation</p><AppointmentFormConsult  /></div>}
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
