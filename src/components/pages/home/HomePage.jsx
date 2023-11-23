import AboutPage from "./AboutUs";
import "./Style/HomePage.css";
import WhyHappyPawsPage from "./WhyHappyPaws";

const HomePage = () => {
  return (
    <>
      <section className="home" id="home">
        <div className="content">
          <h4>Welcome to </h4>
          <h2><span className="span">Happy Paws</span> Online  Appointment System!</h2>
          <p>At Happy Paws, we understand that your furry friends are family. 
            That's why we've crafted an easy, convenient, and stress-free way to manage your pet's appointments. 
            Our online system is designed with both you and your pet in mind, ensuring a seamless experience from booking to check-out.</p>
          <a className="btn">Book Now</a>
        </div>
      </section>
      <AboutPage />
      <WhyHappyPawsPage/>
      
      </>
  );
};

export default HomePage;
