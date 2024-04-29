import { useState } from "react";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch("https://happypawsolongapo.com/api/send_forgot_password_code/" + formData.email, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Proceed to the next step (verification)
        Swal.fire({
          title: "Verification code sent",
          icon: "success",
          confirmButtonText: "Okay",
        });
        setStep(2);
      } else {
        // Handle error
        console.error("Error sending forgot password code");
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Failed to send verification code",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.error("Error occurred while processing forgot password:", error);
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while processing forgot password",
        confirmButtonText: "Okay",
      });
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch("https://happypawsolongapo.com/api/verify_forgot_password_otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email, // Use formData.email instead of just email
          entered_otp: verificationCode, // Rename to entered_otp to match backend parameter
        }),
      });

      if (response.ok) {
        // Proceed to the next step (password reset)
        setStep(3);
      } else {
        // Handle error
        console.error("Invalid verification code");
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Invalid verification code",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.error("Error occurred while verifying code:", error);
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while verifying code",
        confirmButtonText: "Okay",
      });
    }
  };

  const handlePasswordReset = async () => {
    try {
      // Implement password reset logic
    } catch (error) {
      console.error("Error occurred while resetting password:", error);
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while resetting password",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div className="forgot-password-container">
      {step === 1 && (
        <>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          <button onClick={handleForgotPassword}>Forgot Password</button>
        </>
      )}
      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          <button onClick={handleVerifyCode}>Verify Code</button>
        </>
      )}
      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button onClick={handlePasswordReset}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
