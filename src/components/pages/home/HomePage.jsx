import AboutPage from "./AboutUs";
import HowItWorksPage from "./HowItWorks";
import WhyHappyPawsPage from "./WhyHappyPaws";
import ServicePage from "./Service";
import EmergencyPage from "./Emergency";
import "./Style/HomePage.css";




const HomePage = () => {
  return (
    <>
      <section className="home phone-home" id="home">
        <div className="content phone-content"> 
          <h4>Welcome to </h4>
          <h2>Vatan<span className="span"> HP</span></h2>
          <p>At Vatan HP, we understand that your furry friends are family. 
            That's why we've crafted an easy, convenient, and stress-free way to manage your pet's appointments. 
            Our online system is designed with both you and your pet in mind, ensuring a seamless experience from booking to check-out.</p>
        </div>
      </section>
      <AboutPage />
      <WhyHappyPawsPage />
      <EmergencyPage />
      <ServicePage />
      <HowItWorksPage />
      </>
  );
};

export default HomePage;
