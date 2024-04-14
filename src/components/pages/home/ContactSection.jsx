import "./Style/Contact.css";
import VatanHP from "./VatanHP";

const ContactSection = () => {
  return (
    <>
      <section id="contact">
        <div className="container">
        <h2>Contact Us</h2>
          <div class="bar"></div>
            <div className="contact-info-container">

                <div className="contact-info-card">
                <div class="icon">
                <i class="fa-solid fa-phone-volume"></i>
                </div>
                    <h5>Telephone</h5>
                    <p>+63 923-960-1739</p>
                </div>

                <div className="contact-info-card">
                <div class="icon">
                <i class="fa-solid fa-location-dot"></i>
                </div>
                    <h5>Location</h5>
                    <p>26 W 21st St, Olongapo, 2200 Zambales</p>
                </div>

                <div className="contact-info-card">
                <div class="icon">
                <i class="fa-solid fa-envelope"></i>
                </div>
                    <h5>Email</h5>
                    <p>Example@gmail.com</p>
                </div>

            </div>

            <div className="contact-form-map-container">
                <div className="contact-form-container">
                  <h2>Your Details</h2>
                  <div class="contact-from-grid-container">
                            <div class="form-control">
                                <h3 class="h3-img">Name<img src="../assets/asterisk.png" alt="" /></h3>
                                  <input type="text" id="name" name="wholename" placeholder="Your Name" />
                            </div>
                            <div class="form-control">
                                <h3 class="h3-img">Email Address<img src="../assets/asterisk.png" alt="" /></h3>
                                <input type="text" id="email" name="email" placeholder="Your email" />
                            </div>
                        </div>

                        <div class="form-control">
                            <h3 class="h3-img">Subject<img src="../assets/asterisk.png" alt="" /></h3>
                            <input type="text" id="subject" name="subject" placeholder="Message Subject" />
                        </div>
                        <div class="form-control">
                            <h3 class="h3-img">Comments / Questions<img src="../assets/asterisk.png" alt="" /></h3>
                            <textarea type="text" id="qa" name="qa" placeholder="Your Message" ></textarea>
                        </div>

                        <button>View More</button>

                </div>
                <div className="contact-map-container">
                  <h2>Get In Touch</h2>
                  <div class="bar"></div>
                  <p>Vatan HP helps our customers by providing complete access 24/7, emergency hours start from 6:01 PM to 7:59 AM. This continual availability proves to be a helpful tool for pet owners who may require emergency services or supplies for their cherished animals beyond typical operating hours. We ensure convenience in addressing any immediate needs for their pets.</p>
                  <VatanHP />
                </div>
            </div>
            
          </div>
      </section>
    </>
  );
};

export default ContactSection;
