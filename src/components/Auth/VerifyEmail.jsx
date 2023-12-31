import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Style/verifyemail.css";

const VerifyEmail = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const location = useLocation();

  const userEmail = new URLSearchParams(location.search).get("email");

  useEffect(() => {
    fetch("https://happypawsolongapo.com/api/getEmail/" + userEmail)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text(); // Read the response as text
      })
      .then((data) => {
        // Split the response into valid JSON objects
        const jsonObjects = data.trim().split("}{");

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
            const email = parsedJson.payload[0].email; // Access email from the payload
            setEmailAddress(email);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching email address:", error);
      });
  }, [userEmail]);

 




  return (
    <section className="main-verify-email-container">

      <div className="whole-verify-email-container">
      <img src="/page/LGHD.png" alt="" />
    <div className="verify-email-container">
      <h1>Please Verify your email address</h1>
      <p>
        {" "}
        <h3>
          Email Address: <i>{userEmail}</i>
        </h3>
        <br />
        {userEmail
          ? `We've sent an email to ${userEmail} to verify your email address. Please click on the link in that email to continue.`
          : "Loading..."}
      </p>

      <p>
        If you don't see the email in your inbox, please check other folders,
        such as your Spam folder.
      </p>
      <p>Still can't find it? Click the button below to resend the email.</p>
      <button onClick={()=>{
        window.location.reload();
      }}>Resend Email</button>
    </div>
    </div>
    </section>
  );
};

export default VerifyEmail;
