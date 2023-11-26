import "./Style/Service.css";

const ServicePage = () => {
  return (
    <>
      <section className="main_service_container">
        <div className="service_content_container">
          <h5 className="home1-section-heading2"> Our <span className="span">Services</span></h5>
            <div className="service-section">
              <div className="service_item,">
                <div className="service_item_container">
                  <div className="service_content">
                  <i className="fa-solid fa-shield-dog"></i>
                      <h5>Veterinary Care </h5>
                      <p>Comprehensive health check-ups, vaccinations, and treatments for various health issues.</p>
                  </div>
                  <div className="service_content">
                  <i className="fa-solid fa-scissors"></i>
                      <h5>Grooming Services</h5>
                      <p>Bathing, brushing, nail trimming, haircuts, and overall grooming to keep your pet clean and healthy.</p>
                  </div>
                  <div className="service_content">
                  <i className="fa-solid fa-tooth"></i>
                      <h5>Dental Care</h5>
                      <p>Teeth cleaning, oral examinations, and advice on maintaining good dental hygiene for pets.</p>
                  </div>

                  <div className="service_content">
                  <i className="fa-solid fa-house-chimney-medical"></i>
                      <h5>Boarding/Daycare</h5>
                      <p>Safe and comfortable facilities for pets when you're away, providing proper care, feeding, and playtime.</p>
                  </div>
                  <div className="service_content">
                  <i className="fa-solid fa-paw"></i>
                      <h5>Training and Behavioral Classes</h5>
                      <p>Assistance in training your pet, addressing behavioral issues, and enhancing obedience.</p>
                  </div>
                  <div className="service_content">
                  <i className="fa-solid fa-parachute-box"></i>
                      <h5>Pet Supplies</h5>
                      <p>Offering a range of pet care products including food, toys, grooming tools, and accessories.</p>
                  </div>

                  <div className="service_content">
                  <i className="fa-solid fa-kit-medical"></i>
                      <h5>Emergency Care</h5>
                      <p>Services tailored for specific needs like senior pet care, special diets, or medical conditions.</p>
                  </div>
                  <div className="service_content">
                  <i className="fa-solid fa-truck-medical"></i>
                      <h5>Specialized Care</h5>
                      <p>Access to emergency services and immediate attention in critical situations.</p>
                  </div>
                  {/* <div className="service_content">
                      <h5>Access Anytime, Anywhere</h5>
                      <p>Our platform is available 24/7, accessible from any device, 
                        allowing you to manage appointments at your convenience.</p>
                  </div> */}
                  
                </div>
              </div>
            </div>
          </div>
      </section>
    </>
  );
};

export default ServicePage;
