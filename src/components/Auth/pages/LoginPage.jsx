import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import Swal from "sweetalert2";
import "../Style/login.css";
import firebase from "firebase/compat/app";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import { firebaseApp } from "./firebase";

const auth = getAuth(firebaseApp);

const LoginPage = () => {
  const { toggleLogin, isLogin } = useAuth();
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false, // Adding a default value for rememberMe
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState(null);

  const handleChangePhoneNumber = (event) => {
    let inputNumber = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    // Limit input to a maximum of 10 digits after the country code
    inputNumber = inputNumber.substring(0, 10);
    // Format the number only if it's longer than the country code
    if (inputNumber.length > 0) {
      setPhoneNumber(inputNumber.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3"));
    } else {
      setPhoneNumber("");
    }
  };

  const handleSendVerificationCode = async () => {
    try {
      const fullPhoneNumber = "+63 " + phoneNumber; // Adding "+63" to the phone number
      const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        fullPhoneNumber, // Using the full phone number with the country code
        recaptchaVerifier
      );
      setVerificationId(confirmationResult.verificationId);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error sending verification code:", error);
      setError("Error sending verification code. Please try again."); // Update error state
    }
  };

  const handleVerifyCode = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await auth.signInWithCredential(credential);
      // User signed in successfully
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("https://happypawsolongapo.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseDataText = await response.text();
        const trimmedResponseDataText = responseDataText.replace(/null$/, "");

        try {
          const response2 = JSON.parse(trimmedResponseDataText);
          const storage = formData.rememberMe ? localStorage : sessionStorage;
          storage.setItem("authToken", response2.payload.token);

          toggleLogin();

          Swal.fire({
            title: "Login successful",
            icon: "success",
            confirmButtonText: "Okay",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/";
            }
          });
        } catch (error) {
          console.error("An error occurred while parsing JSON:", error);
        }
      } else {
        let responseDataText;
        try {
          responseDataText = await response.text();
          console.log("Response Data:", responseDataText);
        } catch (error) {
          console.error(
            "An error occurred while reading the response text:",
            error
          );
          return;
        }

        if (response.status === 403) {
          Swal.fire({
            title: "Login failed",
            icon: "error",
            text: "Email not verified. Please verify your email first.",
            confirmButtonText: "Okay",
          });
        } else {
          Swal.fire({
            title: "Login failed",
            icon: "error",
            text: "Invalid email or password",
            confirmButtonText: "Okay",
          });
        }
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  return (
    <>
      <section className="login-main-container mobile-login-main-container">
        <div className="side">
          <img src="/page/LGHD.png" alt="" />
        </div>
        <div className="main-user-login-container">
          <div className="scrollable-container">
            <p className="login-title mobile-title">Welcome!</p>
            <div className="user-separator"></div>
            <p className="welcome-message">
              Please provide login credential to proceed and have access to all
              our services
            </p>
            <div className="radio-select">
              <input
                type="radio"
                id="email"
                name="login"
                value="email"
                checked={!isPhoneLogin}
                onChange={() => setIsPhoneLogin(false)}
              />
              <label htmlFor="email">Email</label>
              <input
                type="radio"
                id="phone"
                name="login"
                value="phone"
                checked={isPhoneLogin}
                onChange={() => setIsPhoneLogin(true)}
              />
              <label htmlFor="phone">Phone</label>
            </div>
            {isPhoneLogin === false && (
              <form className="user-login-box" onSubmit={handleLoginSubmit}>
                <div className="user-login-form-control">
                  <label htmlFor="email"></label>
                  <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <i className="fa-solid fa-user fa-sm"></i>
                </div>
                <div className="user-login-form-control">
                  <label htmlFor="password"></label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <i className="fa-solid fa-lock fa-sm"></i>
                </div>
                <div className="user-login-form-control rm">
                  <label className="user-check-box">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <span>Remember Me</span>
                </div>
                <input type="submit" value="Login" className="btn1" />
                <p className="login-link">
                  Don’t have an account?
                  <a href="/auth/signup" className="dnthave">
                    {" "}
                    Sign up
                  </a>
                </p>
              </form>
            )}
            {isPhoneLogin === true && (
              <div>
                {!verificationId && <div id="recaptcha-container"></div>}
                <h1>Phone Number Sign-In</h1>
                <div>
                  <div className="phone-input">
                    <span className="country-code">+63</span>
                    <input
                      type="text"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={handleChangePhoneNumber}
                      maxLength={12} // Maximum length for the phone number
                      pattern="\d*" // Only allow digits
                    />
                  </div>
                  <button onClick={handleSendVerificationCode}>
                    Send Verification Code
                  </button>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <button onClick={handleVerifyCode}>Verify Code</button>
                </div>
                {error && <p>{error}</p>}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
