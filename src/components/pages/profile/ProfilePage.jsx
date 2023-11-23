import { useState, useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext"; // Import the useAuth hook3.
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import AddPetForm from "./AddPetForm";
import PetTable from "./PetTable";

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
    if (petName === "" || petType === "" || petBreed === "" || petAge === "") {
      Swal.fire({
        title: "Error",
        text: "Please fill in all fields.",
        icon: "error",
      });
      return;
    }
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

  const handleUpdatePet = (petId) => {
    // Implement your update logic here
    console.log(`Update pet with ID: ${petId}`);
  };

  const handleDeletePet = (petId) => {
    // Show confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this pet!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // If the user confirms, proceed with the delete action
        try {
          const response = await fetch(
            `http://localhost/api/delete_pet/${petId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                              },
              
              
            }
          );

          // console.log("Delete response:", response);


          if (!response.ok) {
            throw new Error("Failed to delete pet");
          }

          // Update the pet list after successful deletion
          setPetList((prevPetList) =>
            prevPetList.filter((pet) => pet.id !== petId)
          );

          Swal.fire({
            title: "Deleted!",
            text: "Your pet has been deleted.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting pet:", error);
          Swal.fire({
            title: "Error",
            text: "Failed to delete pet. Please try again.",
            icon: "error",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Your pet is safe :)",
          icon: "info",
          confirmButtonText: "Okay",
        });
      }
    });
  };

  // const user_id = decodedToken.user_id;

  
  const user_id = decodedToken ? decodedToken.user_id : null;

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

  if (user_id !== null) {
    // console.log(user_id);

    // Only fetch user pets if user_id is not null
    const fetchUserPets = async () => {
      try {
        const response = await fetch(
          `http://localhost/api/get_user_pets/${user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch pets. Status: ${response.status}`);
        }

        const result = await response.text(); // Get the raw response as text
        // console.log(result); // Log the response content

        // Parse the response as JSON
        const jsonObjects = result.split("}{").map((json, index, array) => {
          // Add '}' back to the first object and '{' back to the last object
          return index === 0
            ? json + "}"
            : index === array.length - 1
            ? "{" + json
            : "{" + json + "}";
        });

        // Parse each JSON object
        jsonObjects.forEach((json) => {
          try {
            const parsedResult = JSON.parse(json);

            if (parsedResult.payload) {
              setPetList(parsedResult.payload);
            } else {
            }
          } catch (jsonError) {
            // console.error("Error parsing JSON:", jsonError);
          }
        });
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };

    fetchUserPets();
  } else {
    console.error("decodedToken is null or undefined");
  }

  return () => abortController.abort();
}, [user_id]);



    // Cleanup function to cancel the request when the component unmounts
 
  // Fetch user data and set loading state
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
        }
      } else {
        setIsLoading(false);
        toggleLogin(false);
      }
    }, 1000);

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


<AddPetForm
            petName={petName}
            setPetName={setPetName}
            petType={petType}
            setPetType={setPetType}
            petBreed={petBreed}
            setPetBreed={setPetBreed}
            petAge={petAge}
            setPetAge={setPetAge}
            handleAddPet={handleAddPet}
          />
          <PetTable
            petList={petList}
            handleUpdatePet={handleUpdatePet}
            handleDeletePet={handleDeletePet}
          />
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
