import "./Style/Emergency.css";

const EmergencyPage = () => {
  return (
    <>
      <section className="emergency mobile-emergency">
        <div className="emergency-container">
            <div className="emergency-content">
              <div className="headphones">
            <i className="fa-solid fa-headphones"></i></div>
            <div className="emrgency-text">
            <h4>Emergency <br /> Medical Care 24/7</h4>
            </div>
            </div>
            <h5>With access to 24 hour emergency assistance.
                  </h5>
          <p>Vatan HP helps our customers by providing complete access 24/7, emergency hours start from 6:01 PM to 7:59 AM. This continual availability proves to be a helpful tool for pet owners who may require emergency services or supplies for their cherished animals beyond typical operating hours. We ensure convenience in addressing any immediate needs for their pets.
                  </p>
            

                  <div className="emergency-content">
              <div className="phone">
              <i className="fa-solid fa-phone-volume"></i></div>
            <div className="emrgency-text">
            <h4>+63 923-960-1739</h4>
            </div>
            </div>
        </div>
      </section>
    </>
  );
};

export default EmergencyPage;