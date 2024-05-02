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

  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);
  const [verifyCodeClicked, setVerifyCodeClicked] = useState(false);
  const [resetPasswordClicked, setResetPasswordClicked] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleForgotPassword = async () => {
    if (forgotPasswordClicked) return;

    try {
      setForgotPasswordClicked(true);

      const response = await fetch(
        "https://happypawsolongapo.com/api/send_forgot_password_code/" +
          formData.email,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
    if (verifyCodeClicked) return;

    try {
      setVerifyCodeClicked(true);

      const response = await fetch(
        "https://happypawsolongapo.com/api/verify_forgot_password_otp/" +
          formData.email +
          "/" +
          verificationCode,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        // Proceed to the next step (password reset).
        Swal.fire({
          title: "Code verified",
          icon: "success",
          confirmButtonText: "Okay",
        });

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

        setVerifyCodeClicked(false);
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

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Passwords do not match",
        confirmButtonText: "Okay",
      });
      return;
    }
    

    if (resetPasswordClicked) return;

    try {
      setResetPasswordClicked(true);

      const response = await fetch(
        "https://happypawsolongapo.com/api/reset_password/" +
          formData.email +
          "/" +
          newPassword,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Password reset successful
        Swal.fire({
          title: "Password reset successful",
          icon: "success",
          confirmButtonText: "Okay",
        });

        // Redirect to login page
        window.location.href = "/auth/login";
      } else {
        // Handle error
        console.error("Error resetting password");
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Failed to reset password",
          confirmButtonText: "Okay",
        });

        setResetPasswordClicked(false);
      }
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
            required
            value={formData.email}
            onChange={handleChange}
          />
          <button onClick={handleForgotPassword} disabled={forgotPasswordClicked}>Forgot Password</button>
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
          <button onClick={handleVerifyCode} disabled={verifyCodeClicked}>
            Verify Code
          </button>
        </>
      )}
      {step === 3 && (
        <>
          {/* <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            disabled

          /> */}

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
          <button onClick={handlePasswordReset} disabled={resetPasswordClicked}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
