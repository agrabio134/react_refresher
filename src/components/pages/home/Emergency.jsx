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
            <h5>With access to 24 hour emergency assistance, It’s so
                     important you can continue to help others.
                  </h5>
          <p>It is a long established fact that a reader will be distract-
                     ed by the readable content of a page when looking at its
                     layout. The point of using Lorem Ipsum is that it has a
                     more-or-less normal distribution.
                  </p>
                  <p>It is a long established fact that a reader will be distract-
                     ed by the readable content of a page.
                  </p>

                  <div className="emergency-content">
              <div className="phone">
              <i className="fa-solid fa-phone-volume"></i></div>
            <div className="emrgency-text">
            <h4>+88 28624 79555</h4>
            </div>
            </div>
        </div>
      </section>
    </>
  );
};

export default EmergencyPage;