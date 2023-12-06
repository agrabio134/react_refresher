import "./Style/AboutUs.css";

const AboutPage = () => {
  return (
    <>
        <section className="about-img" id="about">
        <div className="row">
        <div className="image-section ps-rel ">
        <img src="src/assets/img/time.jpg" alt="" />
                  <div className="image-content ">
                     <h5>Open Hours</h5>
                     <ul className="content-box">
                        <li>
                           <ul>
                              <li>Monday :</li>
                              <li>Tuesday :</li>
                              <li>Wednesday :</li>
                              <li>Tuesday :</li>
                              <li>Thursday :</li>
                              <li>Friday :</li>
                              <li>Saturday :</li>
                           </ul>
                        </li>
                        <li>
                           <ul>
                              <li>08.00 - 10.00</li>
                              <li>08.00 - 10.00</li>
                              <li>08.00 - 10.00</li>
                              <li>08.00 - 10.00</li>
                              <li>08.00 - 10.00</li>
                              <li>08.00 - 10.00</li>
                              <li>08.00 - 10.00</li>
                           </ul>
                        </li>
                     </ul>
                     <div className="logo-icon">
                     <img src="src/assets/img/247.png" alt="" />
                     </div>
                  </div>
               </div>
          {/* <img src="src/assets/img/aboutus.png" alt="" /> */}


          <div className="content">        
            <h6>About Us</h6>
            <h4>Professional Health and Medical
                     Care in Full Measure
                  </h4>
                  <p className="py-3">
                  Happy Paws is a special place that focuses on taking great care of your pets. We're not just about regular vet services; we go the extra mile to make sure your furry friends are happy and healthy. In addition to basic vet care, we offer grooming, handpicked pet products, and other services designed to meet the specific needs of your pets. We're all about making sure your beloved animals are well taken care of in every way possible.
                  </p>

          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
