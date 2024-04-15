import "./Footer.css";

const FooterPage = () => {
  return (
    <>
      <section id="footer">
        <div className="footer-color-1">
          <div className="container">
            <div className="footer-content">
   
              <div className="happy-paws-content">
                <img src="/page/NLHD.png" alt="" />
              </div>

               <div className="quick-links-content">
                <h1>Quick Links</h1>
                <a href="">Home</a>
                <a href="">Appointment</a>
                <a href="">Gallery</a>
                <a href="">Promos</a>
              </div>

              <div className="contactus-content">
                    <h1>Contact Us</h1>
                <div className="contacus-details">
                  <i className="fa-solid fa-envelope"></i>
                  <h6>happypawsolongapo@gmail.com</h6>
                </div>
                <div className="contacus-details">
                  <i className="fa-solid fa-phone-volume"></i>
                  <h6>+63 923-960-1739</h6>
                </div>
              </div>

              <div className="followus-content">
                  <h1>Follow Us</h1>
                <div className="followus-icon">
                  <a href="https://web.facebook.com/olongapocentral" className="fa-brands fa-square-facebook"></a>
                  <i className="fa-brands fa-x-twitter"></i>
                  <i className="fa-brands fa-instagram"></i>
                </div>
              </div>

            </div>
          </div>        
        </div>

        <div className="footer-color-2">
          <div className="container">
              <div className="copyright-content">
                <h6>Copyright © 2023 Vatan HP. All Rights Reserved. Power</h6>
              </div>  
          </div> 
        </div>     

      </section>
    </>
  );
};

export default FooterPage;
