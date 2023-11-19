import "./Style/Service.css";

const ServicePage = () => {
  return (
    <>
      <section className="main_service_container">
        <div className="service_content_container">
          <h6 className="home1-section-heading1">Our Services</h6>
          <h5 className="home1-section-heading2">Special High-quality Services</h5>
          <p>It is a long established fact that a reader will be distracted by the readable <br />
                      content of a page when looking at its layout. </p>
            <div className="service-section">
              <div className="service_item,">
                <div className="service_item_container">
                  <div className="service_content">
                      <h5>Grooming </h5>
                      <p>It is a long established fact that a reader
                                              will be distracted by the readable the
                                              content of a page when looking.</p>
                  </div>
                  <div className="service_content">
                      <h5>Check Up</h5>
                      <p>It is a long established fact that a reader
                                              will be distracted by the readable the
                                              content of a page when looking.</p>
                  </div>
                  <div className="service_content">
                      <h5>Unknown</h5>
                      <p>It is a long established fact that a reader
                                              will be distracted by the readable the
                                              content of a page when looking.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>
    </>
  );
};

export default ServicePage;
