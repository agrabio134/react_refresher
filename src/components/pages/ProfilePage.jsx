import { useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext"; // Import the useAuth hook3.
import jwt_decode from "jwt-decode"; // You can use a JWT decoding library like jwt-decode

// create a signup page
const ProfilePage = () => {
  const [decodedToken, setDecodedToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const [currentPage, setCurrentPage] = useState("login");
  const { isLogin, toggleLogin } = useAuth(); // Use the hook to access the global state

  // check token

  const [token, setToken] = useState(localStorage.getItem("authToken")); // Retrieve the token

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toggleLogin(false); // Update the global state to indicate logout
    window.location.reload();
  };

  // navigation button for signup and login
  const handleButtonNav = () => {
    return (
      <>
        <button onClick={() => setCurrentPage("signup")}>Signup</button>
        <button onClick={() => setCurrentPage("login")}>Login</button>
      </>
    );
  };

  // render page
  const renderPage = () => {
    switch (currentPage) {
      case "signup":
        return (
          <>
            {handleButtonNav()}
            <SigupSection />
          </>
        );
      case "login":
        return (
          <>
            {handleButtonNav()}
            <LoginSection />
          </>
        );
      default:
        return (
          <>
            {handleButtonNav()}
            <LoginSection />
          </>
        );
    }
  };

  const getUser = async () => {
    const url = "http://localhost/api/getuser";
    const data = { token: decodedToken };
    const response = await fetch(url, data, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: decodedToken }),
    });
    console.log(response);
    // Extract and parse the response text
    const responseDataText = await response.text();
    console.log("Response Data:", responseDataText);

    
  };

  const checkLogin = () => {
    console.log(getUser());

    if (token) {
      console.log("token", decodedToken);

      return (
        <>
          {/* <h1>Profile Page</h1> */}
          <h2>Welcome {decodedToken.firstname}</h2>
          <button onClick={handleLogout}>Logout</button>
        </>
      );
    } else {
      return <> {renderPage()}</>;
    }
  };

  useEffect(() => {
    // Simulate a 1-second loading delay
    const delay = setTimeout(() => {
      if (token) {
        const decodedToken = jwt_decode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("authToken");
          setIsLoading(false); // Set loading to false
          toggleLogin(false); // Update local state
        } else {
          setDecodedToken(decodedToken);
          setIsLoading(false); // Set loading to false
          toggleLogin(true); // Update local state
          // console.log(decodedToken);
        }
      } else {
        setIsLoading(false); // Set loading to false
        toggleLogin(false); // Update local state
      }
    }, 500); // .5-second delay

    // Clear the timeout if the component unmounts
    return () => clearTimeout(delay);
  }, []);

  return (
    <>
      <h1>Profile Page</h1>
      {isLoading ? (
        // Display a preloader while loading
        <div>Loading...</div>
      ) : (
        <div>{checkLogin()}</div>
      )}
    </>
  );
};

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);

    try {
      const response = await fetch("http://localhost/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log(response);
      if (response.ok) {
        // Signup successful, you can redirect the user or show a success message
        console.log("Signup successful");
      } else {
        // Handle errors, e.g., display error messages to the user
        console.error("Signup failed");
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
          <label htmlFor="Firstname">First Name</label>
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

      console.log(response);

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
          console.log("Login successful");
          window.location.reload();
        } catch (error) {
          console.error("An error occurred while parsing JSON:", error);
        }
      } else {
        // Handle errors, e.g., display error messages to the user
        console.error("Login failed");
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
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <input type="submit" value="Login" />
        </div>
      </form>
    </>
  );
};

export default ProfilePage;
