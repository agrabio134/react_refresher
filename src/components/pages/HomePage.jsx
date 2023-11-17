import AboutPage from "./AboutUs";
import "./Style/HomePage.css";

const HomePage = () => {
  return (
    <>
      <section className="home" id="home">
        <div className="content">
          <h3>Welcome To Happy Paws</h3>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat labore, sint cupiditate distinctio tempora reiciendis.</p>
          <a className="btn">Book Now</a>
        </div>
      </section>
      <AboutPage />
    </>
  );
};

export default HomePage;
