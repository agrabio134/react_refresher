import React, { useState, useEffect } from "react";
import "./styles/AdminContent.css";
import FileUploader from "./FileUploader";
import axios from "axios";
import jwt_decode from "jwt-decode";
import firebaseConfig from "../config/FirebaseConfig";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";

const AdminGallerySection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [filename, setFilename] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);
  const [imageFormData, setImageFormData] = useState({
    description: "",
  });

  useEffect(() => {
    const decodeAuthToken = () => {
      const token = localStorage.getItem("adminAuthToken");
      if (token) {
        const decoded = jwt_decode(token);
        setDecodedToken(decoded);
        console.log(decoded);
      }
    };
    decodeAuthToken();

    // Initialize Firebase once when the component mounts
    const app = initializeApp(firebaseConfig);
    return () => {
      // Optionally, you can clean up the Firebase app when the component unmounts
      // e.g., app.delete();
    };
  }, []); // Empty dependency array ensures that this effect runs only once

  const handleFileInput = (file) => {
    const filename = file.name;
    setFilename(filename);

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const handleImageFormChange = (e) => {
    const { name, value } = e.target;
    setImageFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!selectedFile) {
        console.error("No file selected");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No file selected",
        });
        return;
      }

      const storage = getStorage();
      const storageRef = ref(storage, `gallery/${selectedFile.name}`);
      await uploadBytes(storageRef, selectedFile);

      const downloadURL = await getDownloadURL(storageRef);

      const admin_id = decodedToken ? decodedToken.user_id : null;

      const imagePostData = {
        description: imageFormData.description,
        admin_id: admin_id,
        image: downloadURL,
      };

      const UPLOAD_URL = "https://happypawsolongapo.com/api/";

      const imagePostResponse = await axios.post(
        `${UPLOAD_URL}/post_image`,
        imagePostData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!imagePostResponse.data || imagePostResponse.data.error) {
        console.error(imagePostResponse.data.error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Image upload failed",
        });

        return;
      }

      // console.log(imagePostResponse.data);

      Swal.fire({
        title: "Success!",
        text: "Image uploaded successfully",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      console.error(err);
      Swal.fire(
        {
          title: "Error!",
          text: "Image upload failed",
          icon: "error",
          confirmButtonText: "Ok",
        }.then(() => {
          window.location.reload();
        })
      );
    }
  };

  return (
    <div className="form-container">
      <h1>Image Upload Form</h1>
      <form onSubmit={handleImageFormSubmit} encType="multipart/form-data">
        <FileUploader onFileSelectSuccess={handleFileInput} />
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "200px",
              marginTop: "10px",
            }}
          />
        )}
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={imageFormData.description}
            onChange={handleImageFormChange}
            className="input-field"
          />
        </label>
        <button type="submit" className="submit-button">
          Submit Image
        </button>
      </form>
    </div>
  );
};

export default AdminGallerySection;
