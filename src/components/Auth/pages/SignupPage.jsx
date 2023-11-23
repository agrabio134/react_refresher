import { useState } from "react";
import { useAuth } from "../AuthContext"; // Import the useAuth hook3.
import Swal from "sweetalert2";

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
    <div className="color">
      <h1>Signup Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fname">First Name</label>
          <input
            type="text"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
          />
          <label htmlFor="lname">Last Name</label>
          <input
            type="text"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
          />

          <label htmlFor="contact">Contact Number</label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
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

          <label htmlFor="confirmPass">Confirm Password</label>
          <input
            type="password"
            name="confirmPass"
            value={formData.confirmPass}
            onChange={handleChange}
          />

          <input
            type="checkbox"
            id="termsAndConditions"
            name="termsAndConditions"
            required
          />
          <label htmlFor="termsAndConditions">
            I accept the terms and conditions
          </label>

          <input type="submit" value="Signup" />
        </div>
      </form></div>
    </>
  );
};

export default SignupPage;
