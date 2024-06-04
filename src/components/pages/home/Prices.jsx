import "./Style/Prices.css";

const Prices = () => {
  return (
    <>
      <section id="prices">
        <div className="container">
          <h2>Prices</h2>
            <div class="bar"></div>
                <div className="prices_item_container">
                  <div className="prices_content">
                      <h5>Consultation </h5>
                      <h6>Free</h6>
                      <p>Get expert advice on your pet's health and care with a free consultatio.</p>
                  </div>
                  <div className="prices_content">
                      <h5>Vaccination</h5>
                      <h6>₱200 - ₱900</h6>
                      <p>Protect your pet with our comprehensive vaccination services.</p>
                  </div>
                  <div className="prices_content ">
                      <h5>Grooming</h5>
                      <h6>₱300 - 900</h6>
                      <p>Treat your pet to professional grooming.</p>
                  </div>
                </div>
          </div>
      </section>
    </>
  );
};

export default Prices;
