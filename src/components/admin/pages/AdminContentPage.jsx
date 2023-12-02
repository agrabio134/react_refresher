// AdminContentPage.jsx
import React, { useState } from "react";
import "./styles/AdminContent.css";
import FileUploader from "../components/FileUploader";
import axios from "axios";

const AdminContentPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [blogFormData, setBlogFormData] = useState({
    title: "",
    content: "",
  });

  const handleFileInput = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
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
      const UPLOAD_URL = 'http://localhost/api/';
  
      // Check if a file is selected
      if (!selectedFile) {
        alert('Please select a file');
        return;
      }
  
      // Prepare form data for image upload
      const imageFormData = new FormData();
      imageFormData.append('file', selectedFile);
  
      // Make the API request to upload the image
      const imageUploadResponse = await axios.post(`${UPLOAD_URL}/upload_image`, imageFormData);
      if (!imageUploadResponse.data || imageUploadResponse.data.error) {
        alert('Image upload failed');
        return;
      }

      console.log(imageFormData);
            const imageDataUrl = imageUploadResponse.data.imageUrl;
  
      // Prepare form data for blog post data
      const blogPostData = {
        title: blogFormData.title,
        content: blogFormData.content,
        thumbnail: imageDataUrl,
      };

      console.log(blogPostData);

      // Make the API request to create the blog post
      const blogPostResponse = await axios.post(`${UPLOAD_URL}/post_blog`, blogPostData);
      if (!blogPostResponse.data || blogPostResponse.data.error) {
        alert('Blog post failed');
        return;
      }

      console.log(blogPostResponse.data);


    

      alert('Blog Post Success');
    } catch (err) {
      console.error(err);
      alert('Blog Post Error');
    }
  };
  
  return (
    <div className="form-container">
      <h1>Blog Post Form</h1>
      <form onSubmit={handleBlogFormSubmit} encType="multipart/form-data">
        <FileUploader
          onFileSelectSuccess={(file) => {
            handleFileInput({ target: { files: [file] } });
          }}
          onFileSelectError={({ error }) => alert(error)}
        />
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "10px" }}
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
