import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext"; // Import the useAuth hook3.
import Swal from "sweetalert2";
import "../Style/signup.css";
import { Modal } from "antd";
import firebase from "firebase/compat/app";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import { firebaseApp } from "./firebase";
import e from "cors";


const auth = getAuth(firebaseApp);

const SignupPage = () => {
  const { isLogin } = useAuth(); // Use the hook to access the global state
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [isCodeMatched, setIsCodeMatched] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState('');

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [viewedTerms, setViewedTerms] = useState(true);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    contact: "",
    address: "",
    email: "",
    password: "",
    confirmPass: "",
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




  const handlePasscodeChange = (event) => {
    const { value } = event.target;
    if (value.length > 4) {
      return;
    }
    setPasscode(value);


  };

  const handleConfirmPasscodeChange = (event) => {
    const { value } = event.target;
    if (value.length > 4) {
      return;
    }
    setConfirmPasscode(value);
  };




  const handlePasscodeSubmit = () => {

    if (passcode.length < 4) {
      Swal.fire({
        title: "Passcode must be 4 digits",
        icon: "error",
        confirmButtonText: "Okay",
      }).then((result) => {
        if (result.isConfirmed) {
          return;
        }
      });
    } else if (passcode !== confirmPasscode) {
      Swal.fire({
        title: "Passcode does not match",
        icon: "error",
        confirmButtonText: "Okay",
      }).then((result) => {
        if (result.isConfirmed) {
          return;
        }
      });
    } else {

      // Add code here to save passcode to database
      updatePasscode(phoneNumber);

      console.log(phoneNumber);
      console.log(passcode);


    }



  };

  const updatePasscode = async (phoneNumber) => {

    // check if phone number already exists

    try {
      const response = await fetch(
        "https://happypawsolongapo.com/api/check_user/" + "63-" + phoneNumber,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseDataText = await response.text();
      console.log("Response Data:", responseDataText);

      if (responseDataText === "") {
        console.log("No data found in users.");

      } else {
        console.log("Data found in users.");
        Swal.fire({
          title: "Phone number already exists",
          icon: "error",
          confirmButtonText: "Okay",
        }).then((result) => {
          if (result.isConfirmed) {
            return;
          }
        });
        return;
      }
      

 



    } catch (error) {
      console.error("An error occurred", error);
    }


    try {
      const response = await fetch(
        "https://happypawsolongapo.com/api/create_passcode/" + "63" + phoneNumber + "/" + passcode,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

        }

      );
      Swal.fire({
        title: "Passcode created",
        icon: "success",
        confirmButtonText: "Okay",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/auth/login";
        }
      });
      
    } catch (error) {
      console.error("An error occurred", error);
    }


  };




  const handleSendVerificationCode = async () => {
    try {
      setIsSendingCode(true);
      setTimer(30);

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


        // run recaptchaVerifier
        const recaptchaContainer = document.getElementById("recaptcha-container");
        const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(recaptchaContainer);
        const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, recaptchaVerifier);
        setVerificationId(confirmationResult.verificationId);
        setError(null);





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

      Swal.fire({
        title: "Code Matched",
        icon: "success",
        confirmButtonText: "Okay",
      });
      setIsCodeMatched(true); // Set the state to true if code is matched



      return;
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


  if (isLogin) {
    window.location.href = "/";
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sendVerificationEmail = async () => {
    const response = await fetch(
      "https://happypawsolongapo.com/api/sent_verification_email/" +
      formData.email,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // console.log("test if email is sent");
    // console.log(formData.email);
  };

  const openTermsModal = () => {
    setViewedTerms(false);
    setShowTermsModal(true);
  };
  const closeTermsModal = () => {
    setShowTermsModal(false);
  };

  const handleCheckboxChange = (e) => {
    // Handle checkbox change if needed
  };
  const validatedSignup = async () => {
    try {
      const response = await fetch(
        "https://happypawsolongapo.com/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        // Signup successful, you can redirect the user or show a success message
        Swal.fire({
          title: "Signup successful",
          icon: "success",
          confirmButtonText: "Okay",
        }).then((result) => {
          if (result.isConfirmed) {
            const userEmail = formData.email;
            // sendVerificationEmail();

            window.location.href = `/verify-email?email=${userEmail}`; // Pass the email as a parameter
          }
        });
      } else {
        // Handle errors, e.g., display error messages to the user
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // if empty field then alert user

    console.log(formData);
    sendVerificationEmail();

    // add useEffect to check if email already exists

    try {
      const response = await fetch("https://happypawsolongapo.com/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log(response);
      const responseDataText = await response.json();
      console.log("Response Data:", responseDataText);

      if (response.status === 404) {
        console.log("No data found in users.");
        if (formData.password !== formData.confirmPass) {
          Swal.fire({
            title: "Password does not match",
            icon: "error",
            confirmButtonText: "Okay",
          }).then((result) => {
            if (result.isConfirmed) {
              return;
            }
          });
        } else if (formData.password.length < 8) {
          Swal.fire({
            title: "Password must be at least 8 characters",
            icon: "error",
            confirmButtonText: "Okay",
          }).then((result) => {
            if (result.isConfirmed) {
              return;
            }
          });
        } else {
          validatedSignup();
        }
        return;
      }

      let isEmailExists = false;
      responseDataText.payload.forEach((item) => {
        if (item.email === formData.email) {
          isEmailExists = true;
        }
      });
      // if data is empty then alert user

      if (
        (formData.fname === "",
          formData.lname === "",
          formData.contact === "",
          formData.address === "",
          formData.email === "",
          formData.password === "",
          formData.confirmPass === "")
      ) {
        Swal.fire({
          title: "Please fill all fields",
          icon: "error",
          confirmButtonText: "Okay",
        }).then((result) => {
          if (result.isConfirmed) {
            return;
          }
        });
      } else if (isEmailExists) {
        Swal.fire({
          title: "Email already exists",
          icon: "error",
          confirmButtonText: "Okay",
        }).then((result) => {
          if (result.isConfirmed) {
            return;
          }
        });
      } else {
        if (formData.password !== formData.confirmPass) {
          Swal.fire({
            title: "Password does not match",
            icon: "error",
            confirmButtonText: "Okay",
          }).then((result) => {
            if (result.isConfirmed) {
              return;
            }
          });
        } else if (formData.password.length < 8) {
          Swal.fire({
            title: "Password must be at least 8 characters",
            icon: "error",
            confirmButtonText: "Okay",
          }).then((result) => {
            if (result.isConfirmed) {
              return;
            }
          });
        } else {
          validatedSignup();
        }
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  return (
    <>
      <section id="signup">
        <div className="container">
          <div className="main-signup-container">

            <div className="signup-logo-container">
              <img src="/page/NLHD.png" alt="" />
              {/* <h1>Paws Pro</h1> */}
            </div>
            <div className="main-user-signup-container">
              <div className="scrollable-container">

                <h2 className="title">Paws Pro</h2>
                <div class="bar"></div>

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
                    <label htmlFor="email"> Email</label>
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
                    <form className="user-signup-box" onSubmit={handleSubmit}>
                      <div className="user-signup-grid-container">
                        <div className="user-signup-form-control">
                          {/* <label htmlFor="fname">First Name</label> */}
                          <input
                            type="text"
                            name="fname"
                            placeholder="First Name"
                            value={formData.fname}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="user-signup-form-control">
                          {/* <label htmlFor="lname">Last Name</label> */}
                          <input
                            type="text"
                            name="lname"
                            placeholder="Last Name"
                            value={formData.lname}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="user-signup-form-control">
                          {/* <label htmlFor="contact">Contact Number</label> */}
                          <input
                            type="tel"
                            name="contact"
                            placeholder="Contact No."
                            value={formData.contact}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="user-signup-form-control">
                          {/* <label htmlFor="address">Address</label> */}
                          <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </div>{" "}
                      </div>

                      <div className="user-signup-form-control">
                        {/* <label htmlFor="email">Email</label> */}
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="user-signup-grid-container">
                        <div className="user-signup-form-control">
                          {/* <label htmlFor="password">Password</label> */}
                          <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{,}"
                            title="Must contain at least one number and one uppercase and lowercase letter"
                            required
                            onChange={handleChange}
                          />
                        </div>

                        <div className="user-signup-form-control">
                          {/* <label htmlFor="confirmPass">Confirm Password</label> */}
                          <input
                            type="password"
                            name="confirmPass"
                            placeholder="Confirm Password"
                            value={formData.confirmPass}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="user-signup-form-control rm">
                        <label
                          className={`user-signup-check-box${viewedTerms ? " viewed" : ""
                            }`}
                        >
                          <input
                            type="checkbox"
                            id="termsAndConditions"
                            name="termsAndConditions"
                            required
                            disabled={viewedTerms}
                          />
                          <span className="checkmark"></span>
                        </label>
                        <p className="terms-link">
                          I agree to the<span onClick={openTermsModal}>Terms and Conditions</span>
                        </p>
                      </div>

                      <Modal
                        title="Terms and Conditions"
                        visible={showTermsModal}
                        onCancel={closeTermsModal}
                        footer={null}
                      >
                        <div>
                          <p>
                            <strong>
                              Happy Paws Pet Care Services Terms and Conditions
                            </strong>
                          </p>
                          <p>
                            <strong>Welcome to Happy Paws Pet Care Services.</strong> By
                            accessing our website, you agree to comply with and be bound
                            by the following terms and conditions.
                          </p>
                          <ol>
                            <li>
                              <strong>Service Description</strong>
                              <p>
                                Happy Paws Pet Care Services offers various pet care
                                services, including but not limited to pet sitting, dog
                                walking, and grooming. The specifics of each service are
                                detailed on the website.
                              </p>
                            </li>
                            <li>
                              <strong>User Responsibilities</strong>
                              <p>
                                Users are responsible for providing accurate and
                                up-to-date information when using our services. It is the
                                user's responsibility to ensure that their pets are in
                                good health and have all necessary vaccinations.
                              </p>
                            </li>
                            <li>
                              <strong>Booking and Payments</strong>
                              <p>
                                The Happy Paws website will not handle any mode of payment
                                and will only be responsible for the user appointment for
                                the Happy Paws customer.
                              </p>
                            </li>
                            {/* Add more sections as needed */}
                          </ol>
                          {/* Add more paragraphs or sections as needed */}
                          <p>
                            <strong>Contact Information</strong>
                            <br />
                            For any questions or concerns regarding these terms and
                            conditions, please contact us at happypawsolongapo@gmail.com.
                            By using our services, you acknowledge that you have read,
                            understood, and agreed to these terms and conditions.
                          </p>
                        </div>
                      </Modal>

                      <input type="submit" value="Signup" className="btn1" />
                    </form>
                  )}
                  {isPhoneLogin === true && !isCodeMatched && (
                    <div>
                      <h1>Phone Number Sign-In</h1>
                      <div className="phone-input-container">
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
                      <div className="verification-container">
                        <input
                          type="text"
                          placeholder="Enter verification code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                        />
                        <button onClick={handleVerifyCode}>Verify Code</button>
                      </div>
                    </div>
                  )}
                </div>

                {isPhoneLogin === true && isCodeMatched && (
                  <div>
                    <h1>Create 4-digit Passcode</h1>
                    <div className="phone-input-container">
                      <input
                        type="password"
                        placeholder="4-digit Passcode"
                        value={passcode}
                        maxLength={4}
                        onChange={handlePasscodeChange}
                      />

                      <input
                        type="password"
                        placeholder="Confirm Passcode"
                        value={confirmPasscode}
                        maxLength={4}
                        onChange={handleConfirmPasscodeChange}
                      />


                      <button onClick={handlePasscodeSubmit}>Submit Passcode</button>
                    </div>
                  </div>
                )}

                <p className="login-link">
                  Already have an account? <a href="/auth/login">Login here</a>
                </p>
              </div>
              {!verificationId && <div id="recaptcha-container"></div>}

            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default SignupPage;
