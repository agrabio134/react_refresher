import React, { useState, useEffect } from "react";
import "./styles/AdminContent.css";
import FileUploader from "../components/FileUploader";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AdminContentPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [filename, setFilename] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);
  const [blogFormData, setBlogFormData] = useState({
    title: "",
    content: "",
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
  }, []);

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

  const handleBlogFormChange = (e) => {
    const { name, value } = e.target;
    setBlogFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBlogFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!selectedFile) {
        console.error("No file selected");
        alert("No file selected");
        return;
      }

      const firebaseConfig = {
        apiKey: "AIzaSyAef0EQJJNig0J9z9Z7V1o1gAazT0Aohc8",
        authDomain: "happy-paws-office.firebaseapp.com",
        projectId: "happy-paws-office",
        storageBucket: "happy-paws-office.appspot.com",
        messagingSenderId: "394632516498",
        appId: "1:394632516498:web:3bbb449299e9a65342674b",
        measurementId: "G-XDW1V85YM0",
      };

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);

      const storage = getStorage(app);
      const storageRef = ref(storage, `blogs/${selectedFile.name}`);
      await uploadBytes(storageRef, selectedFile);

      const downloadURL = await getDownloadURL(storageRef);

      const admin_id = decodedToken ? decodedToken.user_id : null;

      const blogPostData = {
        title: blogFormData.title,
        content: blogFormData.content,
        thumbnail: downloadURL,
        admin_id: admin_id,
      };

      const UPLOAD_URL = "http://localhost/api/";

      const blogPostResponse = await axios.post(
        `${UPLOAD_URL}/post_blog`,
        blogPostData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!blogPostResponse.data || blogPostResponse.data.error) {
        console.error(blogPostResponse.data.error);
        alert("Blog post failed");
        return;
      }

      console.log(blogPostResponse.data);

      alert("Blog Post Success");
    } catch (err) {
      console.error(err);
      alert("Blog Post Error");
    }
  };

  return (
    <div className="form-container">
      <h1>Blog Post Form</h1>
      <form onSubmit={handleBlogFormSubmit} encType="multipart/form-data">
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
          Title:
          <input
            type="text"
            name="title"
            value={blogFormData.title}
            onChange={handleBlogFormChange}
            className="input-field"
          />
        </label>
        <label>
          Content:
          <textarea
            name="content"
            value={blogFormData.content}
            onChange={handleBlogFormChange}
            className="input-field"
          />
        </label>
        <button type="submit" className="submit-button">
          Submit Blog Post
        </button>
      </form>
    </div>
  );
};

export default AdminContentPage;
