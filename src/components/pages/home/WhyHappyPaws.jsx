import "./Style/WhyHP.css";

const WhyHappyPawsPage = () => {
  return (
    <>
      <section id="whyhp">
        <div className="container">
          <h2>Why Choose <span className="span1">Vatan</span> <span className="span2">HP</span>?</h2>
            <div class="bar"></div>
                <div className="whyhp_item_container">
                  <div className="whyhp_content">
                      <h5>Simplified Booking </h5>
                      <p>Say goodbye to long phone calls and waiting on hold. 
                        With just a few clicks, schedule appointments that suit your schedule.</p>
                  </div>
                  <div className="whyhp_content">
                      <h5>Personalized Profiles</h5>
                      <p>Creating personalized profiles for pets at a Vatan HP lets our staff know about each pet's health history, preferences, and specific needs. </p>
                  </div>
                  <div className="whyhp_content ">
                      <h5>Access Anytime, Anywhere</h5>
                      <p>Our platform is available 24/7, accessible from any device, 
                        allowing you to manage appointments at your convenience.</p>
                  </div>
                </div>
          </div>
      </section>
    </>
  );
};

export default WhyHappyPawsPage;
