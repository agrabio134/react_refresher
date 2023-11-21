import { useState } from "react";
import { useAuth } from "../AuthContext"; // Import the useAuth hook3.
import Swal from "sweetalert2";

const LoginPage = () => {
  const { toggleLogin, isLogin } = useAuth(); // Use the hook to access the global state

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    // console.log(formData);
  
    try {
      const response = await fetch("http://localhost/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const responseDataText = await response.text();
        console.log("Response Data:", responseDataText);
  
        const trimmedResponseDataText = responseDataText.replace(/null$/, "");
  
        try {
          const response2 = JSON.parse(trimmedResponseDataText);
          console.log("Response:", response2);
  
          localStorage.setItem("authToken", response2.payload.token);
  
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
          console.error("An error occurred while reading the response text:", error);
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
      <h1>Login Page</h1>
      <form onSubmit={handleLoginSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input type="submit" value="Login" />
        </div>
      </form>
    </>
  );
};

export default LoginPage;
