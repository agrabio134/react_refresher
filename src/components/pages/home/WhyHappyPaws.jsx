import "./Style/WhyHP.css";

const WhyHappyPawsPage = () => {
  return (
    <>
      <section className="main_service_container">
        <div className="service_content_container">
          <h6 className="home1-section-heading1">Our Services</h6>
          <h5 className="home1-section-heading2">Why Choose Happy Paws?</h5>
          <p>It is a long established fact that a reader will be distracted by the readable <br />
                      content of a page when looking at its layout. </p>
            <div className="service-section">
              <div className="service_item,">
                <div className="service_item_container">
                  <div className="service_content">
                      <h5>Simplified Booking </h5>
                      <p>Say goodbye to long phone calls and waiting on hold. 
                        With just a few clicks, schedule appointments that suit your schedule.</p>
                  </div>
                  <div className="service_content">
                      <h5>Personalized Profiles</h5>
                      <p>Say goodbye to long phone calls and waiting on hold. 
                        With just a few clicks, schedule appointments that suit your schedule.</p>
                  </div>
                  <div className="service_content">
                      <h5>Access Anytime, Anywhere</h5>
                      <p>Our platform is available 24/7, accessible from any device, 
                        allowing you to manage appointments at your convenience.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>
    </>
  );
};

export default WhyHappyPawsPage;
