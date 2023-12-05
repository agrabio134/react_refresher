import { useState } from "react";
import { useAuth } from "../AuthContext"; // Import the useAuth hook3.
import Swal from "sweetalert2";
import "../Style/signup.css";

const SignupPage = () => {
  const { isLogin } = useAuth(); // Use the hook to access the global state

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
      "http://localhost/api/sent_verification_email/" + formData.email,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    
    );

    // console.log("test if email is sent");
    // console.log(formData.email);
  }

  const validatedSignup = async () => {
    try {
      const response = await fetch("http://localhost/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
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
      const response = await fetch("http://localhost/api/users", {
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
      <img src="/src/assets/img/LGHD.png" alt="" />
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
          </div>          </div>

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
{/* 
          <div className="user-signup-form-control rm"> 
-   
          <label htmlFor="termsAndConditions" className="user-check-box">
          <input
            type="checkbox"
            id="termsAndConditions"
            name="termsAndConditions"
            required
          />
          <span className="checkmark"></span>

            I accept the terms and conditions
          </label>
          </div> */}

          <div className="user-signup-form-control rm">
              <label className="user-signup-check-box">
                <input
                  type="checkbox"
                  id="termsAndConditions"
                  name="termsAndConditions"
                  required
                />
                <span className="checkmark"></span>
              </label>
   
              <label htmlFor="termsAndConditions"> I accept the terms and conditions</label>

            </div>  

          <input type="submit" value="Signup" className="btn1"/>

      </form>
      </div>
      </section>
    </>
  );
};

export default SignupPage;
