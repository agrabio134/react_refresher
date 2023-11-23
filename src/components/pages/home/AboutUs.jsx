import "./Style/AboutUs.css";

const AboutPage = () => {
  return (
    <>
        <div className="about-main">
           <div className="container">
            <div className="row1">
            <div className="column">
              <h5>Column 1</h5>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
          <div className="column">
            <h5>Column 2</h5>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
          <div className="column">
            <h5>Column 3</h5>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
          </div>
           </div>
        </div>
        <section className="about-img" id="about">
        <div className="row">
          <div className="image">

          <img src="src/assets/img/aboutus.png" alt="" />

          </div>
          <div className="content">        
            <h3>About Us</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus qui ea ullam, enim tempora ipsum fuga alias quae ratione a officiis id temporibus autem? Quod nemo facilis cupiditate. Ex, vel?</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odit amet enim quod veritatis, nihil voluptas culpa! Neque consectetur obcaecati sapiente?</p>
            <a className="btn">learn more</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
