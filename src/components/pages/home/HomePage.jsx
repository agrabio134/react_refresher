import AboutPage from "./AboutUs";
import "./Style/HomePage.css";

const HomePage = () => {
  return (
    <>
      <section className="home" id="home">
        <div className="content">
          <h4>Welcome To</h4>
          <h2>Happy Paws</h2>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat labore, sint cupiditate distinctio tempora reiciendis.</p>
          <a className="btn">Book Now</a>
        </div>
      </section>
      <AboutPage />
    </>
  );
};

export default HomePage;
