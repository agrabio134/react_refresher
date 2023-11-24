import "./Style/HIW.css";
import "./js/slinder.js";


const HowItWorksPage = () => {
  return (
    <>
      <section className="main_service_container">
      <div class="slideshow-container">

<div class="mySlides fade">
  <div class="numbertext">1 / 3</div>
  <img src="src/assets/img/time.jpg" alt="" />
  <div class="text">Caption Text</div>
</div>

<div class="mySlides fade">
  <div class="numbertext">2 / 3</div>
  <img src="src/assets/img/time.jpg" alt="" />
  <div class="text">Caption Two</div>
</div>

<div class="mySlides fade">
  <div class="numbertext">3 / 3</div>
  <img src="src/assets/img/time.jpg" alt="" />
  <div class="text">Caption Three</div>
</div>

<a class="prev" onclick="plusSlides(-1)">❮</a>
<a class="next" onclick="plusSlides(1)">❯</a>

</div>
<br />

<div>
  <span class="dot" onclick="currentSlide(1)"></span> 
  <span class="dot" onclick="currentSlide(2)"></span> 
  <span class="dot" onclick="currentSlide(3)"></span> 
</div>
      </section>
    </>
  );
};

export default HowItWorksPage;