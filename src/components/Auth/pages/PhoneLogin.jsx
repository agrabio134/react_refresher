import { useState } from "react";
import Swal from "sweetalert2";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const PhoneLogin = ({ onPhoneLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginWithPhoneNumber = async () => {
    try {
      const formattedPhoneNumber = "63" + phoneNumber;
      // console.log("Phone Number:", formattedPhoneNumber);
      // console.log("Pin Code:", pinCode);

      const response = await fetch(
        "https://happypawsolongapo.com/api/phone-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contact_no: formattedPhoneNumber,
            pincode: pinCode,
          }),
        }
      );

      const responseDataText = await response.text();
      // console.log("Response Data Text:", responseDataText);

      // Check if response data is not empty and ends with 'null'
      if (responseDataText && responseDataText.trim().endsWith("null")) {
        // Remove 'null' from the end of the response data
        const trimmedResponseDataText = responseDataText.trim().slice(0, -4);

        // Parse the trimmed response data
        const responseData = JSON.parse(trimmedResponseDataText);

        if (response.ok) {
          onPhoneLogin(responseData.payload.token);
          Swal.fire({
            title: "Login successful",
            icon: "success",
            confirmButtonText: "Okay",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/";
            }
          });
        } else {
          Swal.fire({
            title: "Login failed",
            icon: "error",
            text: responseData.message,
            confirmButtonText: "Okay",
          });
        }
      } else {
        console.error("Invalid response data:", responseDataText);
        // Handle invalid response data
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleChangePhoneNumber = (event) => {
    // Remove non-numeric characters
    const cleanedPhoneNumber = event.target.value.replace(/[^\d]/g, "");

    // Format the phone number with dashes
    let formattedPhoneNumber = "";
    if (cleanedPhoneNumber.length > 5) {
      formattedPhoneNumber = `${cleanedPhoneNumber.slice(
        0,
        3
      )}-${cleanedPhoneNumber.slice(3, 6)}-${cleanedPhoneNumber.slice(6)}`;
    } else {
      formattedPhoneNumber = `${cleanedPhoneNumber}`;
    }

    // Update the phone number state
    setPhoneNumber(formattedPhoneNumber);
  };

  const handleChangePinCode = (event) => {
    // Remove non-numeric characters
    const cleanedPinCode = event.target.value.replace(/[^\d]/g, "");

    // Update the pin code state
    setPinCode(cleanedPinCode);

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
            type={showPassword ? "text" : "password"}
            placeholder="Enter Pin code"
            value={pinCode}
            maxLength={4}
            onChange={handleChangePinCode}
            iconRender={(visible) =>
              visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
            }
          />
          <button onClick={toggleShowPassword}>
          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </button>
          <button onClick={handleLoginWithPhoneNumber}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default PhoneLogin;
