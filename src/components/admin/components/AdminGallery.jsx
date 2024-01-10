import React, { useState, useEffect } from "react";
import "./styles/AdminContent.css";
import FileUploader from "./FileUploader";
import axios from "axios";
import jwt_decode from "jwt-decode";
import firebaseConfig from "../config/FirebaseConfig";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import { Table, Button, Image, Modal, Form, Input, Card } from "antd";

const API_URL = "https://happypawsolongapo.com/api/";

const AdminGallerySection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [selectedFileEdit, setSelectedFileEdit] = useState(null);
  const [thumbnailPreviewEdit, setThumbnailPreviewEdit] = useState(null);
  const [filename, setFilename] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);
  const [imageData, setImageData] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [filenameEdit, setFilenameEdit] = useState("");
  const [modalFormData, setModalFormData] = useState({
    id: "",
    description: "",
  });

  
  const [imageFormData, setImageFormData] = useState({
    description: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const decodeAuthToken = () => {
      const token = localStorage.getItem("adminAuthToken");
      if (token) {
        const decoded = jwt_decode(token);
        setDecodedToken(decoded);
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      decodeAuthToken();
      await fetchImageData(`${API_URL}get_all_images`, setBlogData);
      setIsLoading(false);
    };

    fetchData();
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

  const fetchImageData = async (url, setBlogPosts) => {
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

  const handleEditClick = (record) => {
    showModal();
    setCurrentImage(record.image);
    setImageFormData({
      id: record.id,
      description: record.description,
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleModalEdit = async () => {
    try {
      const thumbnailToUse = selectedFile ? thumbnailPreviewEdit || currentThumbnail : currentThumbnail;
      if (selectedFile) {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
  
        const storage = getStorage(app);
        const storageRef = ref(storage, `gallery/${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
  
        const downloadURL = await getDownloadURL(storageRef);
  
        const admin_id = decodedToken ? decodedToken.user_id : null;
  
        const imagePostData = {
          id: imageFormData.id,
          description: imageFormData.description,
          image: downloadURL,
          admin_id: admin_id,
        };
  
  
        const blogPostResponse = await axios.put(
          `${API_URL}update_image/${imageFormData.id}`,
          imagePostData,
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
  
        // console.log(blogPostResponse.data);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Content post successful",
        }).then(() => {

          setIsModalVisible(false);
          // i want to relode then auto click gallery
          localStorage.setItem("autoClickGallery", "true");
          window.location.reload();
        });
      } 
      else {
      const admin_id = decodedToken ? decodedToken.user_id : null;

      const imagePostData = {
        id: imageFormData.id,
        description: imageFormData.description,
        image: currentImage || thumbnailToUse,
        admin_id: admin_id,
      };

      // console.log(imagePostData);

      const imagePostResponse = await axios.put(
        `${API_URL}update_image/${imageFormData.id}`,
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
          text: "Image update failed",
        });
        return;
      }

      console.log(imagePostResponse.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Image update successful",
      }).then(() => {
        // fetchData();
        setIsModalVisible(false);
        // i want to relode then auto click gallery
        localStorage.setItem("autoClickGallery", "true");

        window.location.reload();
      });
    }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Image update failed",
      });
    }
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
          const imagePostResponse = await axios.delete(
            `${API_URL}delete_image/${record.id}`,
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
              text: "Image delete failed",
            });
            return;
          }

          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Image deleted",
          }).then(() => {
            window.location.reload();

            fetchData();
          });
        } catch (err) {
          console.error(err);
          Swal.fire(
            {
              icon: "error",
              title: "Oops...",
              text: "Image delete failed",
            }.then(() => {
              window.location.reload();
            })
          );
        }
      }
    });
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
        Swal.fire(
          {
            icon: "error",
            title: "Oops...",
            text: "No file selected",
          }.then(() => {
            window.location.reload();
          })
        );
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

      const imagePostResponse = await axios.post(
        `${API_URL}post_image`,
        imagePostData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!imagePostResponse.data || imagePostResponse.data.error) {
        console.error(imagePostResponse.data.error);
        Swal.fire(
          {
            icon: "error",
            title: "Oops...",
            text: "Image upload failed",
          }.then(() => {
            window.location.reload();
          })
        );

        return;
      }

      Swal.fire({
        title: "Success!",
        text: "Image uploaded successfully",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        window.location.reload();
        fetchData();
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Image upload failed",
        icon: "error",
        confirmButtonText: "Ok",
      }).then(() => {
        window.location.reload();
        fetchData();
      });
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => <Image src={image} width={150} />,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (id, record) => (
        <div className="ActionBtn">
          <Button type="primary" onClick={() => handleEditClick(record)}>
            Edit
          </Button>
          <Button
            type="primary"
            onClick={() => handleDeleteClick(record)}
            danger
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="form-container">
      <h1>Image Upload Form</h1>
      <form onSubmit={handleImageFormSubmit} encType="multipart/form-data">
        <div className="file-container">
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
        </div>
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

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table columns={columns} dataSource={blogData} />
      )}

      <Modal
        title="Edit Image"
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
          <Form
            initialValues={{
              description: imageFormData.description,
            }}
          >
            <Form.Item label="Thumbnail" name="image">
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
                currentImage && (
                  <img
                    src={currentImage}
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
              <Input value={imageFormData.id} />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input
                value={imageFormData.description}
                onChange={(e) =>
                  setImageFormData({
                    ...imageFormData,
                    description: e.target.value,
                  })
                }
              />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default AdminGallerySection;
