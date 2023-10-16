
import { useState } from "react";
import { useAuth } from "../../Auth/AuthContext"; // Import the useAuth hook3.
import Swal from "sweetalert2";


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
  
        // console.log(response);
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
        //   console.log("Signup successful");
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
  

  export default SigupSection;