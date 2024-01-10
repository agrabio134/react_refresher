import { useState } from "react";
import { useAuth } from "../AuthContext"; // Import the useAuth hook3.
import Swal from "sweetalert2";
import "../Style/signup.css";
import { Modal } from "antd";

const SignupPage = () => {
  const { isLogin } = useAuth(); // Use the hook to access the global state
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
      <section className="signup-main-container">
        <div className="signup-side">
          <img src="/page/LGHD.png" alt="" />
        </div>
        <div className="main-user-signup-container">
          <p className="title">Happy Paws</p>
          <div className="signup-separator"></div>

          <form className="user-signup-box" onSubmit={handleSubmit}>
            <div className="user-signup-grid-container">
              <div className="user-signup-form-control">
                <label htmlFor="fname">First Name</label>
                <input
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                />
              </div>
              <div className="user-signup-form-control">
                <label htmlFor="lname">Last Name</label>
                <input
                  type="text"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                />
              </div>
              <div className="user-signup-form-control">
                <label htmlFor="contact">Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>
              <div className="user-signup-form-control">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>{" "}
            </div>

            <div className="user-signup-form-control">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="user-signup-grid-container">
              <div className="user-signup-form-control">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{,}"
                  title="Must contain at least one number and one uppercase and lowercase letter"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="user-signup-form-control">
                <label htmlFor="confirmPass">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPass"
                  value={formData.confirmPass}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="user-signup-form-control rm">
              <label
                className={`user-signup-check-box${
                  viewedTerms ? " viewed" : ""
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
              <span onClick={openTermsModal} className="terms-link">
              I agree to the Terms and Conditions
              </span>
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
        </div>
      </section>
    </>
  );
};

export default SignupPage;
