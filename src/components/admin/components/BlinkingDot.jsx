import { useState, useEffect } from "react";
import "./styles/BlinkingDot.css";

const BlinkingDot = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible((prevVisible) => !prevVisible);
    }, 1000); // Change the interval time as needed

    return () => clearInterval(intervalId);
  }, []);

  return <div className={`blinking-dot ${isVisible ? "visible" : "hidden"}`} />;
};

export default BlinkingDot;
