import { useState } from "react";
import { useAuth } from "../../Auth/AuthContext"; // Import the useAuth hook3.
import Swal from "sweetalert2";

const LoginSection = () => {
  const { toggleLogin } = useAuth(); // Use the hook to access the global state

  const [formData, setFormData] = useState({
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

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);

    try {
      const response = await fetch("http://localhost/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // console.log(response);

      if (response.ok) {
        // Extract and parse the response text
        const responseDataText = await response.text();
        console.log("Response Data:", responseDataText);

        // Remove "null" from the end of responseDataText
        const trimmedResponseDataText = responseDataText.replace(/null$/, "");

        try {
          // Parse the JSON response data
          const response2 = JSON.parse(trimmedResponseDataText);
          console.log("Response:", response2);
          // Store the token in localStorage
          localStorage.setItem("authToken", response2.payload.token);

          // Login successful, update the isLogin state
          toggleLogin(); // Update the global state
          // console.log("Login successful");
          Swal.fire({
            title: "Login successful",
            icon: "success",
            confirmButtonText: "Okay",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        } catch (error) {
          console.error("An error occurred while parsing JSON:", error);
        }
      } else {
        // Handle errors, e.g., display error messages to the user

        Swal.fire({
          title: "Login failed",
          icon: "error",
          text: "Invalid email or password",
          confirmButtonText: "Okay",
        });
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

export default LoginSection;
