import "./Style/AboutUs.css";

const AboutPage = () => {
  return (
    <>
        <section className="about-img" id="about">
        <div className="row">
        <div class="image-section ps-rel ">
        <img src="src/assets/img/time.jpg" alt="" />
                  <div class="image-content ">
                     <h5>Open Hours</h5>
                     <ul class="content-box">
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
                     <div class="logo-icon">
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
                  <p class="py-3">
                     It is a long established fact that a reader will be distracted by the readable content of a
                     page when looking at its layout. The point of using Lorem Ipsum is that it has a
                     more-or-less normal distribution of letters, as opposed to using 'Content here, content
                     here', making it look like readable English.
                  </p>
                  <p>
                     It is a long established fact that a reader will be distracted by the readable
                     content of a page when looking at its layout.
                  </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
