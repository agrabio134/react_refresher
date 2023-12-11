import { useState } from "react";
import Swal from "sweetalert2";

const SignupPage = () => {
  // const { isLogin } = useAuth(); // Use the hook to access the global state

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPass: "",
  });

  // if (isLogin) {
  //   window.location.href = "/";
  // }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatedSignup = async () => {
    try {
      const response = await fetch("https://happypawsolongapo.com/api/admin_register", {
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
            window.location.href = "admin/login";
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
    if (formData.password !== formData.confirmPass) {
      Swal.fire({
        title: "Password does not match",
        icon: "error",
        confirmButtonText: "Okay",
      });
    } else {
      validatedSignup();
    }
  };

  // add useEffect to check if email already exists

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
        </form>
      </div>
    </>
  );
};

export default SignupPage;
