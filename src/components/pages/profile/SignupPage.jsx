import { useState } from "react";
import { useAuth } from "../../Auth/AuthContext"; // Import the useAuth hook3.
import Swal from "sweetalert2";
import { Form } from "react-router-dom";

const SigupSection = () => {
  const { isLogin } = useAuth(); // Use the hook to access the global state

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
            window.location.reload();
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

      let isEmailExists = false;
      responseDataText.payload.forEach((item) => {
        if (item.email === formData.email) {
          isEmailExists = true;
        }
      });
      // if data is empty then alert user
      if (
        (formData.firstname === "",
        formData.lastname === "",
        formData.email === "",
        formData.password === "")
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
        validatedSignup();
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  return (
    <>
      <h1>Signup Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <input type="submit" value="Signup" />
        </div>
      </form>
    </>
  );
};

export default SigupSection;
