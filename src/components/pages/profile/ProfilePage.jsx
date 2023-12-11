import { useState, useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import AddPetForm from "./AddPetForm";
import PetTable from "./PetTable";
import "./Style/ProfilePage.css";

const ProfilePage = () => {
  const [decodedToken, setDecodedToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userFullName, setUserFullName] = useState("");
  const { isLogin, toggleLogin } = useAuth();

  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petSex, setPetSex] = useState("");
  const [petList, setPetList] = useState([]);
  const [petImageUrl, setDownloadURL] = useState("");

  // console.log("petImageUrl", petImageUrl);

  const user_id = decodedToken ? decodedToken.user_id : null;

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    if (user_id !== null) {
      const fetchUserPets = async () => {
        try {
          const response = await fetch(
            `https://happypawsolongapo.com/api//get_user_pets/${user_id}`,
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

          const result = await response.text();
          const jsonObjects = result.split("}{").map((json, index, array) => {
            return index === 0
              ? json + "}"
              : index === array.length - 1
              ? "{" + json
              : "{" + json + "}";
          });

          jsonObjects.forEach((json) => {
            try {
              const parsedResult = JSON.parse(json);
              if (parsedResult.payload) {
                setPetList(parsedResult.payload);
              }
            } catch (jsonError) {
              console.error("Error parsing JSON:", jsonError);
            }
          });
        } catch (error) {
          console.error("Error fetching pet data:", error);
        }
      };

      fetchUserPets();
    } else {
      // console.error("decodedToken is null or undefined");
    }

    return () => abortController.abort();
  }, [user_id]);

  useEffect(() => {
    const delay = setTimeout(() => {
      let storedToken = localStorage.getItem("authToken");
      let storageType = "localStorage";

      if (!storedToken) {
        storedToken = sessionStorage.getItem("authToken");
        storageType = "sessionStorage";
      }

      if (storedToken) {
        const decodedToken = jwt_decode(storedToken);

        if (decodedToken.exp * 1000 < Date.now()) {
          window[storageType].removeItem("authToken");
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
    }, 500);

    return () => clearTimeout(delay);
  }, [toggleLogin]);

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
          title: "Logged out Successfully!",
          text: "You are now logged out!",
          icon: "success",
        }).then(() => {
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
          toggleLogin(false);
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

  const checkLogin = () => {
    if (decodedToken) {
      const getUser = async () => {
        let queryIdToken = "";

        Object.values(decodedToken).forEach((value) => {
          queryIdToken = value;
        });

        const url = "https://happypawsolongapo.com/api//getuser/" + queryIdToken;

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

          const result = await response.text();

          const jsonObjects = result.split("}{");

          jsonObjects.forEach((json, index) => {
            let parsedJson;
            if (index === 0) {
              parsedJson = JSON.parse(json + "}");
            } else if (index === jsonObjects.length - 1) {
              parsedJson = JSON.parse("{" + json);
            } else {
              parsedJson = JSON.parse("{" + json + "}");
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

      getUser();

      return (
        <>
          <section className="main-profile-container">
            <div className="whole-profile-container">
              <div className="profile-header-container">
                <h2>Welcome {userFullName}</h2>
                <button onClick={handleLogout}>Logout</button>
              </div>

              <AddPetForm
                petName={petName}
                setPetName={setPetName}
                petType={petType}
                setPetType={setPetType}
                petBreed={petBreed}
                setPetBreed={setPetBreed}
                petAge={petAge}
                setPetAge={setPetAge}
                petSex={petSex}
                setPetSex={setPetSex}
                petImageUrl={petImageUrl}
                setDownloadURL={setDownloadURL}
                handleAddPet={handleAddPet}
              />
              <PetTable
                petList={petList}
                handleUpdatePet={handleUpdatePet}
                handleDeletePet={handleDeletePet}
              />
            </div>
          </section>
        </>
      );
    } else {
      window.location.href = "/auth/login";
      return (
        <div>
          <p>Redirecting to login page...</p>
        </div>
      );
    }
  };

  const handleAddPet = async () => {
    if (petName === "" || petType === "" || petBreed === "" || petAge === "" || petSex === "" || petImageUrl === "") {
      // Swal.fire({
      //   title: "Error",
      //   text: "Please fill in all fields.",
      //   icon: "error",
      // });
      return;
    }
    const petData = {
      name: petName,
      type: petType,
      breed: petBreed,
      birthdate: petAge,
      sex: petSex,
      image: petImageUrl,
      user_id: decodedToken, // Assuming decodedToken contains user information
    };

    try {
      const response = await fetch("https://happypawsolongapo.com/api//addpet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(petData),
      });

      if (!response.ok) {
        throw new Error("Failed to add pet");
      }

      Swal.fire({
        title: "Pet Added!",
        text: "Your pet has been added successfully.",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/profile";
        }
      });

      setPetName("");
      setPetType("");
      setPetBreed("");
      setPetAge("");
      setPetSex("");
      setDownloadURL("");
    } catch (error) {
      console.error("Error adding pet:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to add pet. Please try again.",
        icon: "error",
      });
    }
  };

  const handleUpdatePet = (petId) => {
    console.log(`Update pet with ID: ${petId}`);
  };

  const handleDeletePet = async (petId) => {
    // Check if the pet has an appointment
    const hasAppointment = await checkPetAppointment(petId);

    if (hasAppointment === true) {
      Swal.fire({
        title: "Error",
        text: "This pet cannot be deleted because it has an appointment.",
        icon: "error",
      });
      return;
    }

    // If no appointment, proceed with the delete action
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this pet!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `https://happypawsolongapo.com/api//delete_pet/${petId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete pet");
          }

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

  const checkPetAppointment = async (petId) => {
    try {
      const response = await fetch(
        `https://happypawsolongapo.com/api//check_pet_appointment/${petId}`
      );

      // Handle 404 status code
      if (response.status === 404) {
        console.log("Pet appointment not found");
        return false; // Treat as if there is no appointment
      }

      const data = await response.text();

      // console.log("Response data:", data);

      // Split the response into separate JSON objects
      const jsonObjects = data.split("}{").map((json, index, array) => {
        return index === 0
          ? json + "}"
          : index === array.length - 1
          ? "{" + json
          : "{" + json + "}";
      });
      // console.log("JSON objects:", jsonObjects);

      return true;
    } catch (error) {
      console.error("Error checking pet appointment:", error);
      return false; // Assume there is no appointment in case of an error
    }
  };

  return (
    <>
      {/* <h1>Profile Page</h1> */}
      {isLoading ? <div>Loading...</div> : <div>{checkLogin()}</div>}
    </>
  );
};

export default ProfilePage;
