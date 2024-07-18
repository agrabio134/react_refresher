import "./Style/AboutUs.css";

const AboutPage = () => {
  return (
    <>
      <section id="about">
         <div className="about-main-box-container">
            <div className="about-office-hour-container">
               <img src="/page/calendar.png" alt="" />
               <div className="about-office-hour-schedule-container">
                  <h5>Office Hours</h5>
                  <div className="about-office-hour-content-box">
                     <ul>
                        <li>Monday :</li>
                        <li>Tuesday :</li>
                        <li>Wednesday :</li>
                        <li>Thursday :</li>
                        <li>Friday :</li>
                        <li>Saturday :</li>
                        <li>Sunday :</li>
                     </ul>
                     <ul>
                        <li>8:00 AM - 6:00 PM</li>
                        <li>8:00 AM - 6:00 PM</li>
                        <li>8:00 AM - 6:00 PM</li>
                        <li>8:00 AM - 6:00 PM</li>
                        <li>8:00 AM - 6:00 PM</li>
                        <li>8:00 AM - 6:00 PM</li>
                        <li>8:00 AM - 6:00 PM</li>
                     </ul>
                  </div>
                  <div className="twofourseven-container">
                     <img src="/page/247.png" alt="" />
                  </div>
               </div>
            </div>
            <div className="about-content-container">        
               <h2>About Us</h2>
               <div class="bar"></div>
               <h3>Professional Health and Medical Care in Full Measure</h3>
               <p> Vatan Animal Hospital is a special place that focuses on taking great care of your pets. We're not just about regular vet services; we go the extra mile to make sure your furry friends are happy and healthy. In addition to basic vet care, we offer grooming, handpicked pet products, and other services designed to meet the specific needs of your pets. We're all about making sure your beloved animals are well taken care of in every way possible.</p>
            </div>
         </div>
      </section>
    </>
  );
};

export default AboutPage;
