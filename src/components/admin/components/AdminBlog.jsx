import React, { useState, useEffect } from "react";
import "./styles/AdminContent.css";
import FileUploader from "../components/FileUploader";
import axios from "axios";
import jwt_decode from "jwt-decode";
import firebaseConfig from "../config/FirebaseConfig"; // Import the configuration
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import { Table, Button, Image } from "antd";


const fetchBlogData = async (url, setBlogPosts) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const textData = await response.text();
    const jsonObjects = textData
      .split("}{")
      .map((json, index, array) =>
        (index === 0 ? json + "}" : index === array.length - 1 ? "{" + json : "{" + json + "}")
      );

    const blogPosts = jsonObjects.flatMap((json) => {
      try {
        const parsedResult = JSON.parse(json);
        return parsedResult.payload || [];
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        return [];
      }
    });

    setBlogPosts(blogPosts);
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error.message);
    setBlogPosts([]);
  }
};

const columns = [
  {
    title: "Image",
    dataIndex: "thumbnail",
    key: "thumbnail",
    render: (thumbnail) => <Image src={thumbnail} width={150} />,

  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },

  {
    title: "Content",
    dataIndex: "content",
    key: "content",
  },
  {
    title: "Status",
    dataIndex: "status",  // Corrected from "data"
    key: "status",
    render: (status) => {
      const statusText = status === 0 ? "Unpublished" : "Published";
      const color = status === 0 ? "red" : "green"; // Set color based on status

      return <span style={{ color }}>{statusText}</span>;
    },
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    // render: (text, record) => (
    //   <Button type="primary" onClick={() => handleEditClick(record)}>
    //     Edit
    //   </Button>
    // ),
  },
]


const AdminBlogSection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [filename, setFilename] = useState("");
  const [blogData, setBlogData] = useState([]);
  const [decodedToken, setDecodedToken] = useState(null);
  const [blogFormData, setBlogFormData] = useState({
    title: "",
    content: "",
  });


  useEffect(() => {
    const apiUrl = "https://happypawsolongapo.com/api/get_all_blog_posts";
    fetchBlogData(apiUrl, setBlogData);

    console.log(blogData);
  }, []); // Fix: Added dependency array

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
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No file selected",
        });
        return;
      }

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

      const UPLOAD_URL = "https://happypawsolongapo.com/api/";

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
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Blog post failed",
        });
        return;
      }

      console.log(blogPostResponse.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Blog post successful",
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Blog post failed",
      }).then(() => {
        window.location.reload();
      });
    }
  };


  // get data



  return (
    <>
      <div className="form-container">
        <h1>News and Announcements Post</h1>
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
      <Table columns={columns} dataSource={blogData} 
      height="100%"
      />
    </>
  );
};

export default AdminBlogSection;
