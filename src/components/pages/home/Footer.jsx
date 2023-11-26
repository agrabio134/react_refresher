import "./Style/Footer.css";

const FooterPage = () => {
  return (
    <>
      <section className="main_footer_container">
            <div className="footer-content-container">
                <div className="footer-content">

                    <div className="happy-paws-content">
                        <h1>Happy Paws</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>

                    <div className="quick-links-content">
                    <h1>Quick Links</h1>
                    <a href="">Home</a>
                    <a href="">Appointment</a>
                    <a href="">Blogs</a>
                    <a href="">Gallery</a>
                    </div>

                    <div className="contactus-content">
                    <h1>Contact Us</h1>
                    <div className="contacus-details">
                    <i className="fa-solid fa-envelope"></i>
                    <h6>happypaws@example.com</h6>
                    </div>
                    <div className="contacus-details">
                    <i className="fa-solid fa-phone-volume"></i>
                    <h6>094-2666-666</h6>
                    </div>
                    </div>

                    <div className="followus-content">
                    <h1>Follow Us</h1>
                    <div className="followus-icon">
                        <i className="fa-brands fa-square-facebook"></i>
                        <i className="fa-brands fa-x-twitter"></i>
                        <i className="fa-brands fa-instagram"></i>
                    </div>
                    </div>

                </div>
                <div className="copyrigt-content">
                    <h6>Copyright © [Year] Happy Paws. All Rights Reserved.</h6>
                </div>
            </div>
      </section>
    </>
  );
};

export default FooterPage;
