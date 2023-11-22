import { useState, useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext"; // Import the useAuth hook3.
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";

// create a signup page
const ProfilePage = () => {
  const [decodedToken, setDecodedToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [userFullName, setUserFullName] = useState("");

  const [currentPage, setCurrentPage] = useState("login");
  const { isLogin, toggleLogin } = useAuth(); // Use the hook to access the global state

  // PET
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petList, setPetList] = useState([]);


  // add PET
  const handleAddPet = async () => {
    const petData = {
      name: petName,
      type: petType,
      breed: petBreed,
      age: petAge,
      user_id: decodedToken, // Assuming decodedToken contains user information
    };


    try {
      const response = await fetch("http://localhost/api/addpet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(petData),
      });

      if (!response.ok) {
        throw new Error("Failed to add pet");
      }

      // Handle success (you can show a success message using Swal or other UI feedback)
      Swal.fire({
        title: "Pet Added!",
        text: "Your pet has been added successfully.",
        icon: "success",
      });

      // Clear the form fields
      setPetName("");
      setPetType("");
      setPetBreed("");
      setPetAge("");
    } catch (error) {
      console.error("Error adding pet:", error);
      // Handle error (show an error message using Swal or other UI feedback)
      Swal.fire({
        title: "Error",
        text: "Failed to add pet. Please try again.",
        icon: "error",
      });
    }
  };

  // const user_id = decodedToken.user_id;


  const user_id = decodedToken ? decodedToken.user_id : null;

  if (user_id !== null) {
    console.log(user_id);
  } else {
    console.error("decodedToken is null or undefined");
  }

  
  // get pet by user id
  const fetchUserPets = async () => {
    try {
      const response = await fetch("http://localhost/api/get_user_pets/26" , {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pets");
      }

      const result = await response.json();
      setPetList(result.data); // Assuming the pet data is in the 'data' property
      console.log(result.data);

    } catch (error) {
      console.error("Error fetching pet data:", error);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (token) {
        const decodedToken = jwt_decode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("authToken");
          setIsLoading(false);
          toggleLogin(false);
        } else {
          setDecodedToken(decodedToken);
          setIsLoading(false);
          toggleLogin(true);
          fetchUserPets(); // Fetch pets when the component mounts
        }
      } else {
        setIsLoading(false);
        toggleLogin(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, []);

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
              setUserFullName(
                parsedJson.payload[0].fname + " " + parsedJson.payload[0].lname
              );
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

          {/* Step 3: Add Pet Form */}
          <h2>Add Pet</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <label>
              Name:
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                required
              />
            </label>
            <label>
              Type:
              <input
                type="text"
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                required
              />
            </label>
            <label>
              Breed:
              <input
                type="text"
                value={petBreed}
                onChange={(e) => setPetBreed(e.target.value)}
                required
              />
            </label>
            <label>
              Age:
              <input
                type="numbers"
                value={petAge}
                onChange={(e) => setPetAge(e.target.value)}
                required
              />
            </label>
            <button onClick={handleAddPet}>Add Pet</button>
          </form>

          <h2>Your Pets</h2>
          <ul>
            {petList.map((pet) => (
              <li key={pet.id}>
                <strong>Name:</strong> {pet.name}, <strong>Type:</strong> {pet.type}, <strong>Breed:</strong> {pet.breed}, <strong>Age:</strong> {pet.age}
              </li>
            ))}
          </ul>
        </>
      );
    } else {
      window.location.href = "/auth/login";
      // return a message or UI indicating redirection
      return (
        <div>
          <p>Redirecting to login page...</p>
        </div>
      );
    }
  };

  useEffect(() => {
    // Simulate a 1-second loading delay
    const delay = setTimeout(() => {
      if (token) {
        const decodedToken = jwt_decode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("authToken");
          setIsLoading(false);
          toggleLogin(false);
        } else {
          setDecodedToken(decodedToken);
          setIsLoading(false);
          toggleLogin(true);
          // console.log(decodedToken);
        }
      } else {
        setIsLoading(false);
        toggleLogin(false);
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
