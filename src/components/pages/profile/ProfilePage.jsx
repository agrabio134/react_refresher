import { useState, useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext"; // Import the useAuth hook3.
import jwt_decode from "jwt-decode"; // You can use a JWT decoding library like jwt-decode
import LoginSection from "./LoginPage";
import SigupSection from "./SignupPage";
import Swal from "sweetalert2";

// create a signup page
const ProfilePage = () => {
  const [decodedToken, setDecodedToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [userFullName, setUserFullName] = useState("");

  const [currentPage, setCurrentPage] = useState("login");
  const { isLogin, toggleLogin } = useAuth(); // Use the hook to access the global state

  // check token

  const [token, setToken] = useState(localStorage.getItem("authToken")); // Retrieve the token

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Logged out Sucessfully!",
          text: "You are now logged out!",
          icon: "success",
        }).then(() => {
          localStorage.removeItem("authToken");
          toggleLogin(false); // Update the global state to indicate logout
          window.location.reload();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "You are still logged in",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    });
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

  const checkLogin = () => {
    if (token) {
      const getUser = async () => {
        let queryIdToken = "";

        Object.values(decodedToken).forEach((value) => {
          queryIdToken = value;
        });


        // console.log(queryIdToken);

        const url = "http://localhost/api/getuser/" + queryIdToken;

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const result = await response.text(); // Get the raw response as text

          // Split the response into separate JSON objects
          const jsonObjects = result.split("}{");

          jsonObjects.forEach((json, index) => {
            let parsedJson;
            if (index === 0) {
              parsedJson = JSON.parse(json + "}"); // Add '}' back to the first object
            } else if (index === jsonObjects.length - 1) {
              parsedJson = JSON.parse("{" + json); // Add '{' back to the last object
            } else {
              parsedJson = JSON.parse("{" + json + "}"); // Add '{' and '}' to the middle objects
            }
            if (parsedJson.payload && parsedJson.payload.length > 0) {
              setUserFullName(parsedJson.payload[0].fname + " " + parsedJson.payload[0].lname); 
            }
          });

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

// call the getUser function
      getUser(); 

      return (
        <>
          <h2>Welcome {userFullName}</h2>
          <button onClick={handleLogout}>Logout</button>
        </>
      );
    } else {
      return renderPage();
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

export default ProfilePage;
