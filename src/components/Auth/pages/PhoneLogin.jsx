import { useState } from "react";
import Swal from "sweetalert2";

const PhoneLogin = ({ onPhoneLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pinCode, setPinCode] = useState("");

  const handleLoginWithPhoneNumber = async () => {
    try {
      const response = await fetch("https://happypawsolongapo.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contact_no: phoneNumber, pincode: pinCode }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const { token } = responseData.payload;
        // Call the callback function passed from the parent component
        onPhoneLogin(token);
      } else {
        const responseData = await response.json();
        Swal.fire({
          title: "Login failed",
          icon: "error",
          text: responseData.message,
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleChangePhoneNumber = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleChangePinCode = (event) => {
    setPinCode(event.target.value);
  };

  return (
    <div>
      <h1>Phone Number Sign-In</h1>
      <div className="phone-input-container">
        <div className="phone-input">
          <span className="country-code">+63</span>
          <input
            type="text"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={handleChangePhoneNumber}
            maxLength={12}
            pattern="\d*"
            required
          />
        </div>
        <div className="verification-container">
          <input
            type="text"
            placeholder="Enter verification code"
            value={pinCode}
            onChange={handleChangePinCode}
          />
          <button onClick={handleLoginWithPhoneNumber}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default PhoneLogin;
