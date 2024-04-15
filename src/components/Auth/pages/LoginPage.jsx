import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import Swal from "sweetalert2";
import "../Style/login.css";
import firebase from "firebase/compat/app";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import { firebaseApp } from "./firebase";

const auth = getAuth(firebaseApp);

const LoginPage = () => {
  const { toggleLogin } = useAuth();
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [timer, setTimer] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  const initializeRecaptcha = () => {
    try {
      if (!recaptchaInitialized) {
        const recaptchaContainer = document.getElementById(
          "recaptcha-container"
        );
        if (!recaptchaContainer) {
          console.error("Error: recaptcha-container element not found.");
          return;
        }

        const recaptchaVerifierInstance = new firebase.auth.RecaptchaVerifier(
          recaptchaContainer,
          { size: "invisible" }
        );
        setRecaptchaVerifier(recaptchaVerifierInstance); // Set the recaptchaVerifier in the state
        setRecaptchaInitialized(true);
      }
    } catch (error) {
      console.error("Error initializing reCAPTCHA:", error);
    }
  };

  // initialize initializeRecaptcha once the component mounts for the first time
  useEffect(() => {
    initializeRecaptcha();
  }, [recaptchaInitialized]);

  const handleChangePhoneNumber = (event) => {
    let inputNumber = event.target.value.replace(/\D/g, "");
    inputNumber = inputNumber.substring(0, 10);
    if (inputNumber.length > 0) {
      setPhoneNumber(inputNumber.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3"));
    } else {
      setPhoneNumber("");
    }
  };

  const handleSendVerificationCode = async () => {
    try {
      setIsSendingCode(true);
      setTimer(60);

      const intervalId = setInterval(() => {
        setTimer((prevTimer) => (prevTimer === 0 ? 0 : prevTimer - 1));
      }, 1000);

      setTimeout(() => {
        clearInterval(intervalId);
        setVerificationId("");
      }, 60000);

      const fullPhoneNumber = "+63 " + phoneNumber;

      if (recaptchaVerifier) {
        // Check if recaptchaVerifier is truthy
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          fullPhoneNumber,
          recaptchaVerifier
        );
        setVerificationId(confirmationResult.verificationId);
        setError(null);
      } else {
        console.error("Recaptcha verifier is not initialized.");
        setError("Error sending verification code. Please try again.");
        setIsSendingCode(false);
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      setError("Error sending verification code. Please try again.");
      setIsSendingCode(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error sending verification code: ${error.message}. Please try again.`,
      });
    }
  };

  const handleVerifyCode = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await firebase.auth().signInWithCredential(credential);
      alert("Code matched.");
    } catch (error) {
      console.error("Error verifying code:", error);
      if (error.code === "auth/code-expired") {
        Swal.fire({
          title: "Code Expired",
          text: "The verification code has expired. Please resend the code.",
          icon: "error",
          confirmButtonText: "Resend Code",
        }).then(handleSendVerificationCode);
      } else {
        alert("Code did not match. Please try again.");
      }
    }
  };

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
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
      <section id="login">
        <div className="container">
          <div className="main-login-container">

            <div className="login-logo-container">
              <img src="/page/NLHD.png" alt="" />
              <h1>Paws Pro</h1>
            </div>

            <div className="main-user-login-container">
              <h2>Welcome!</h2>
            <div class="bar"></div>
              <p>Please provide login credential to proceed and have access to all our services</p>
            <div className="scrollable-container">
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
                      maxLength={12}
                      pattern="\d*"
                      required
                    />
                  </div>
                  <button
                    onClick={handleSendVerificationCode}
                    disabled={
                      !phoneNumber || phoneNumber.length !== 12 || timer !== 0
                    }
                  >
                    {timer === 0
                      ? "Send OTP"
                      : `Resend OTP in ${timer} seconds`}
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
                {/* {error && <p>{error}</p>} */}
              </div>
            )}
          </div>
        </div>
        </div>
        </div>
        <div className="default-shape">
                <div className="shape-1">
                <img src="/page/paws.png" width="100px" height="auto" alt="" />
                </div>

                <div className="shape-2 rotateme">
                <img src="/page/dog-toy-1.png" width="100px" height="auto" alt="" />
                </div>

                <div className="shape-3">
                <img src="/page/groom-1.png" width="70px" height="auto" alt="" />
                </div>

                <div className="shape-4">
                <img src="/page/cat-toy.png" width="60px" height="auto" alt="" />
                </div>

                <div className="shape-5">
                <img src="/page/medicine.png" width="75px" height="auto" alt="" />
                </div>
          </div>
      </section>
    </>
  );
};

export default LoginPage;
