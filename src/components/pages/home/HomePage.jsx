import AboutPage from "./AboutUs";
import HowItWorksPage from "./HowItWorks";
import WhyHappyPawsPage from "./WhyHappyPaws";
import Prices from "./Prices";
import ServicePage from "./Service";
import EmergencyPage from "./Emergency";
import PromoSection from "./PromoSection";
import ContactSection from "./ContactSection";
import "./Style/HomePage.css";




const HomePage = () => {
  return (
    <>
      <section id="home">
        <div className="home-main-box-container">
          <div className="home-content-container"> 
              <h1>Welcome to</h1>
              <h2>Vatan</h2> 
              {/* <span>Animal Hospital</span> */}
              <p>At Vatan Animal Hospital, we understand that your furry friends are family. 
                That's why we've crafted an easy, convenient, and stress-free way to manage your pet's appointments. 
                Our online system is designed with both you and your pet in mind, ensuring a seamless experience from booking to check-out.
              </p>
          </div>
          <div className="home-img-container">
            <img src="/page/freecon.png" alt="" />
            <h2>Free Consultation!</h2>
          </div>
        </div>
        
        <div className="default-shape">
                <div className="shape-1">
                <img src="/page/paws.png" width="100px" height="auto" alt="paws" />
                </div>

                <div className="shape-2 rotateme">
                <img src="/page/dog-toy-1.png" width="100px" height="auto" alt="toy" />
                </div>

                <div className="shape-3">
                <img src="/page/groom-1.png" width="70px" height="auto" alt="groom" />
                </div>

                <div className="shape-4">
                <img src="/page/cat-toy.png" width="60px" height="auto" alt="cat-toy" />
                </div>

                <div className="shape-5">
                <img src="/page/medicine.png" width="75px" height="auto" alt="medicine" />
                </div>
          </div>

      </section>
      <WhyHappyPawsPage />
      <AboutPage />
      <Prices />
      <PromoSection />
      <ServicePage />
      {/* <EmergencyPage /> */}
      {/* <HowItWorksPage /> */}
      <ContactSection />
      </>
  );
};

export default HomePage;
