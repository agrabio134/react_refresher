import React, { useState, useEffect } from 'react';
import './Style/HIW.css';

const HowItWorksPage = () => {
  const [slideIndex, setSlideIndex] = useState(1);

  const plusSlides = (n) => {
    showSlides(slideIndex + n);
  };

  const currentSlide = (n) => {
    showSlides(n);
  };

  const showSlides = (n) => {
    let i;
    const slides = document.getElementsByClassName('mySlides');
    // const dots = document.getElementsByClassName('dot');

    if (n > slides.length) {
      setSlideIndex(1);
    } else if (n < 1) {
      setSlideIndex(slides.length);
    } else {
      setSlideIndex(n);
    }

    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }

    // for (i = 0; i < dots.length; i++) {
    //   dots[i].className = dots[i].className.replace(' active', '');
    // }

    slides[slideIndex - 1].style.display = 'block';
    // dots[slideIndex - 1].className += ' active';
  };

  useEffect(() => {
    // Initial call to showSlides to hide all images
    showSlides(slideIndex);
  }, [slideIndex]);

  return (
    <>
      <section className="main_hiw_container">
      <div className='whole_hiw_container'>
        <div className='hiw_container'>
        <div className='hiw_content'>
          <h2>How it works?</h2>
          <div className="hiw-separator"></div>
          <div className='hiw-text-container'>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum, doloribus magni atque voluptatem architecto odit delectus ad perspiciatis id labore non qui cum natus eos amet, accusamus sed debitis! Iure.</p>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum, doloribus magni atque voluptatem architecto odit delectus ad perspiciatis id labore non qui cum natus eos amet, accusamus sed debitis! Iure.</p>
        </div>
        </div>

        
        <div className="slideshow-container">
          <div className="mySlides fade">
            <div className="numbertext">1 / 3</div>
            <img src="src/assets/img/HIW1.jpg" alt="" />
            <div className="text">
              <h2>Register Your Pet</h2>
              <p>Form Fields for Pet Name, Breed, Age, etc.</p>
            </div>
          </div>

          <div className="mySlides fade">
            <div className="numbertext">2 / 3</div>
            <img src="src/assets/img/HIW2.jpg" alt="" />
            <div className="text"><h2>Select Service</h2>
              <p>Dropdown Menu for Services: Vet Check-up, Grooming, Vaccinations, etc.</p>
              </div>
          </div>

          <div className="mySlides fade">
            <div className="numbertext">3 / 3</div>
            <img src="src/assets/img/HIW3.jpg" alt="" />
            <div className="text">
              <h2>Pick a Time</h2>
              <p>Form Fields for Pet Name, Breed, Age, etc.</p>
            </div>
          </div>

          <a className="prev" onClick={() => plusSlides(-1)}>
            ❮
          </a>
          <a className="next" onClick={() => plusSlides(1)}>
            ❯
          </a>
        </div>
        <br />

        {/* <div className='dotalign'>
          <span className="dot" onClick={() => currentSlide(1)}></span>
          <span className="dot" onClick={() => currentSlide(2)}></span>
          <span className="dot" onClick={() => currentSlide(3)}></span>
        </div> */}
        </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorksPage;
