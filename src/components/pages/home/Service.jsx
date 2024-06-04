import "./Style/Service.css";

const ServicePage = () => {
  return (
    <>
      <section id="service">
        <div className="container">
          <h2>Our Services</h2>
          <div class="bar"></div>
            <div className="service_item_container">

              <div className="service_content">
                <div class="icon">
                  <i className="fa-solid fa-shield-dog"></i>
                </div>
                  <h5>Veterinary Care </h5>
                  <p>Comprehensive health check-ups, vaccinations, and treatments for various health issues.</p>
              </div>

              <div className="service_content">
                <div class="icon">
                  <i className="fa-solid fa-scissors"></i>
                </div>
                  <h5>Grooming Services</h5>
                  <p>Bathing, brushing, nail trimming, haircuts, and overall grooming to keep your pet clean and healthy.</p>
              </div>

              <div className="service_content">
                <div class="icon">
                  <i className="fa-solid fa-house-chimney-medical"></i>
                </div>
                  <h5>Home Service</h5>
                  <p>Vatan Animal Hospital offers convenient home service care for your furry friends, bringing top-notch veterinary attention directly to your doorstep.</p>
              </div>

              <div className="service_content">
                <div class="icon">
                  <i className="fa-solid fa-parachute-box"></i>
                </div>
                  <h5>Open to All types of Pets</h5>
                  <p>Our services are open to all types of your furry or feathery friends .</p>
              </div>

              <div className="service_content">
                <div class="icon">
                  <i className="fa-solid fa-kit-medical"></i>
                </div>
                  <h5>Emergency Care</h5>
                  <p>Access to emergency services and immediate attention in critical situations.</p>
              </div>

              <div className="service_content">
                <div class="icon">
                  <i className="fa-solid fa-truck-medical"></i>
                </div>
                  <h5>Specialized Care</h5>
                  <p>Services tailored for specific needs like senior pet care, special diets, or medical conditions.</p>
              </div>
              
            </div>
          </div>
      </section>
    </>
  );
};

export default ServicePage;
