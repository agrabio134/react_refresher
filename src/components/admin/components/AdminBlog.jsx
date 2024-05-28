import React, { useState, useEffect } from "react";
import "./styles/AdminContent.css";
import FileUploader from "../components/FileUploader";
import axios from "axios";
import jwt_decode from "jwt-decode";
import firebaseConfig from "../config/FirebaseConfig"; // Import the configuration
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import { Table, Button, Image, Modal, Form, Input, Card } from "antd";

const { TextArea } = Input;

const AdminBlogSection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailPreviewEdit, setThumbnailPreviewEdit] = useState(null);
  const [filename, setFilename] = useState("");
  const [filenameEdit, setFilenameEdit] = useState("");
  const [blogData, setBlogData] = useState([]);
  const [decodedToken, setDecodedToken] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [blogFormData, setBlogFormData] = useState({
    title: "",
    content: "",
  });
  const [modalFormData, setModalFormData] = useState({
    title: "",
    content: "",
  });

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
          index === 0
            ? json + "}"
            : index === array.length - 1
            ? "{" + json
            : "{" + json + "}"
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
      dataIndex: "status", // Corrected from "data"
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
      // edit and delete button
      render: (id, record) => (
        <div className="ActionBtn">
          <Button className="btn-warning" onClick={() => handleEditClick(record)}>
            Edit
          </Button>
          <Button
            className="btn-danger"
            onClick={() => handleDeleteClick(record)}
            danger
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };




  const handleEditClick = (record) => {
    showModal();

    // Set current data to modalFormData for prefilling the modal
    setModalFormData({
      id: record.id,
      title: record.title,
      content: record.content,
    });

    setCurrentThumbnail(record.thumbnail);
  };

  const handleModalEdit = async () => {
    try {
      // Check if a new image is selected, otherwise use the current thumbnail
      const thumbnailToUse = selectedFile ? thumbnailPreviewEdit || currentThumbnail : currentThumbnail;
  
      // Additional logic to handle the edit
      console.log(modalFormData.id);
  
      if (selectedFile) {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
  
        const storage = getStorage(app);
        const storageRef = ref(storage, `blogs/${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
  
        const downloadURL = await getDownloadURL(storageRef);
  
        const admin_id = decodedToken ? decodedToken.user_id : null;
  
        const blogPostData = {
          id: modalFormData.id,
          title: modalFormData.title,
          content: modalFormData.content,
          thumbnail: downloadURL || thumbnailToUse,
          admin_id: admin_id,
        };
  
        const UPLOAD_URL = "https://happypawsolongapo.com/api/";
  
        const blogPostResponse = await axios.put(
          `${UPLOAD_URL}/update_blog_post/${modalFormData.id}`,
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
            text: "Content post failed",
          });
          return;
        }
  
        console.log(blogPostResponse.data);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Content post successful",
        }).then(() => {
          window.location.reload();
        });
      } else {
        // Handle the case where no file is selected
        const admin_id = decodedToken ? decodedToken.user_id : null;
  
        const blogPostData = {
          id: modalFormData.id,
          title: modalFormData.title,
          content: modalFormData.content,
          thumbnail: thumbnailToUse,
          admin_id: admin_id,
        };
  
        const UPLOAD_URL = "https://happypawsolongapo.com/api/";
  
        const blogPostResponse = await axios.put(
          `${UPLOAD_URL}/update_blog_post/${modalFormData.id}`,
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
            text: "Content post failed",
          });
          return;
        }
  
        console.log(blogPostResponse.data);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Content post successful",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Content post failed",
      }).then(() => {
        window.location.reload();
      });
    }
  
    setIsModalVisible(false);
  };
  

  const handleDeleteClick = (record) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const UPLOAD_URL = "https://happypawsolongapo.com/api/";

          const blogPostResponse = await axios.delete(
            `${UPLOAD_URL}/delete_blog_post/${record.id}`,
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
              text: "Content post failed",
            });
            return;
          }

          console.log(blogPostResponse.data);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Content post deleted",
          }).then(() => {
            window.location.reload();
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Content post failed",
          }).then(() => {
            window.location.reload();
          });
        }
      }
    });

  };

  useEffect(() => {
    const apiUrl = "https://happypawsolongapo.com/api/get_all_blog_posts";
    fetchBlogData(apiUrl, setBlogData);

    // console.log(blogData);
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

  const handleFileInputEdit = (file) => {
    const filename = file.name;
    setFilenameEdit(filename);

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreviewEdit(reader.result);
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
          text: "Content post failed",
        });
        return;
      }

      console.log(blogPostResponse.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Content post successfully",
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Content post failed",
      }).then(() => {
        window.location.reload();
      });
    }
  };

  // get data

  return (
    <>
    <div className="admin-promos-main-container">
    <div className="form-container">
  <h1>Promos</h1>
  <form onSubmit={handleBlogFormSubmit} encType="multipart/form-data">
    <div className="file-container">
      <FileUploader onFileSelectSuccess={handleFileInput} />
      {thumbnailPreview && (
        <div className="file-preview">
          <img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            className="thumbnail-preview"
          />
        </div>
      )}
    </div>
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
        className="input-field textarea-field"
      />
    </label>
    <button type="submit" className="submit-button">
      Submit Content post
    </button>
  </form>
</div>


<Table columns={columns} dataSource={blogData} scroll={{ x: true }} />
      {/* Modal for editing */}
      <Modal
        title="Edit Content post"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalEdit}>
            Save
          </Button>,
        ]}
      >
        <Card className="custom-card">
          {/* Form inside the modal */}
          <Form
            initialValues={{
              title: modalFormData.title,
              content: modalFormData.content,
            }}
          >
            <Form.Item label="Thumbnail" name="thumbnail">
              <FileUploader onFileSelectSuccess={handleFileInputEdit} />
              {thumbnailPreviewEdit ? (
                <img
                  src={thumbnailPreviewEdit}
                  alt="Thumbnail Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    marginTop: "10px",
                  }}
                />
              ) : (
                // Display current thumbnail if available
                currentThumbnail && (
                  <img
                    src={currentThumbnail}
                    alt="Current Thumbnail"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      marginTop: "10px",
                    }}
                  />
                )
              )}
            </Form.Item>
            <Form.Item name="id" hidden={true}>
              <Input value={modalFormData.id} />
            </Form.Item>
            <Form.Item label="Title" name="title">
              {/* Use modalFormData.title to prefill the value */}
              <Input
                value={modalFormData.title}
                onChange={(e) =>
                  setModalFormData({
                    ...modalFormData,
                    title: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Content" name="content">
              {/* Use modalFormData.content to prefill the value */}
              <TextArea
                rows={4}
                value={modalFormData.content}
                onChange={(e) =>
                  setModalFormData({
                    ...modalFormData,
                    content: e.target.value,
                  })
                }
              />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
    </>
  );
};

export default AdminBlogSection;
