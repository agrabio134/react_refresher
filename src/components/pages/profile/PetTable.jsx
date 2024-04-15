import { useState, useEffect } from "react";
import { Image, Button, Modal, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import axios from "axios";
import firebaseConfig from "../../admin/config/FirebaseConfig";
import {
  calculateAgeInMonths,
  calculateAgeInDays,
} from "../utils/petAgeCalculation";
import "./Style/PetTable.css";
import Swal from "sweetalert2";

const { Item } = Form;
const storage = getStorage(initializeApp(firebaseConfig));

const PetTable = ({ petList, handleUpdatePet, handleDeletePet }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [file, setFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [filename, setFilename] = useState("");
  const [downloadURL, setDownloadURL] = useState(null);

  const handleFileInputChange = (info) => {
    if (info.file.status === "done" || info.file.status === "error") {
      setFile(info.file.originFileObj);
      setFilename(info.file.name);
      setThumbnailPreview(info.file.thumbUrl);

      if (info.file.originFileObj) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result);
        };
        reader.readAsDataURL(info.file.originFileObj);
      }
    }
    // Handle other file status if needed
  };

  const handleEditPet = (pet) => {
    setSelectedPet(pet);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdate = async () => {
    try {
      let imageUrl = selectedPet.image;

      if (file) {
        const storageRef = ref(storage, `petImages/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        await uploadTask;
        imageUrl = await getDownloadURL(storageRef);
      }

      const birthdate = new Date(selectedPet.birthdate)
        .toISOString()
        .split("T")[0];

      const updateData = {
        name: selectedPet.name,
        type: selectedPet.type,
        breed: selectedPet.breed,
        birthdate: birthdate, // Modify this accordingly
        sex: selectedPet.sex, // Add this line
        image: imageUrl,
        // Add other fields as needed
      };

      console.log("Update Request Data:", updateData);

      const response = await axios.put(
        `https://happypawsolongapo.com/api/update_pet/${selectedPet.id}`,
        updateData
      );

      console.log("Update Response Data:", response.data);

      setIsModalVisible(false);

      Swal.fire({
        title: "Success!",
        text: "Pet updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error updating pet:", error);
    }
  };

  return (
    <>
      <div className="main-pet-table-container">
        <h2>Your Pets</h2>
        <div className="pet-table-separator"></div>
        <div className="profile-pet-card-container">
          <div className="profile-pet-card">

          </div>

        </div>
        <div className="mobile-table">
          <table className="whole-pet-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Type</th>
                <th>Breed</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="pet-table-item">
              {petList && petList.length > 0 ? (
                petList.map((pet) => (
                  <tr className="pet-item" key={pet.id}>
                    <td className="pet-number-column">
                      {petList.indexOf(pet) + 1}
                    </td>
                    <td className="pet-image-column">
                      {" "}
                      <Image
                        src={`${pet.image}`}
                        alt={pet.image}
                        width={100}
                        height={100}
                      />
                    </td>
                    <td className="pet-name-column">{pet.name}</td>
                    <td className="pet-type-column">{pet.type}</td>
                    <td className="pet-breed-column">{pet.breed}</td>
                    <td className="pet-age-column">
                      {calculateAgeInMonths(pet.birthdate) >= 12 ? (
                        <>
                          {Math.floor(calculateAgeInMonths(pet.birthdate) / 12)}{" "}
                          {Math.floor(
                            calculateAgeInMonths(pet.birthdate) / 12
                          ) === 1
                            ? "year"
                            : "years"}
                          {calculateAgeInMonths(pet.birthdate) % 12 > 0 && (
                            <>
                              {" and "}
                              {calculateAgeInMonths(pet.birthdate) % 12}{" "}
                              {calculateAgeInMonths(pet.birthdate) % 12 === 1
                                ? "month"
                                : "months"}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {calculateAgeInMonths(pet.birthdate) < 1 ? (
                            <>
                              {calculateAgeInDays(pet.birthdate)}{" "}
                              {calculateAgeInDays(pet.birthdate) === 1
                                ? "day"
                                : "days"}
                            </>
                          ) : (
                            <>
                              {calculateAgeInMonths(pet.birthdate)}{" "}
                              {calculateAgeInMonths(pet.birthdate) < 2
                                ? "month"
                                : "months"}
                            </>
                          )}
                        </>
                      )}
                    </td>
                    <td className="pet-button-column">
                      <button
                        className="pet-action-edit-button"
                        onClick={() => handleEditPet(pet)}
                      >
                        Edit
                      </button>
                      <button
                        className="pet-action-delete-button"
                        onClick={() => handleDeletePet(pet.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No pets available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        title="Edit Pet"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="update" type="primary" onClick={handleUpdate}>
            Update
          </Button>,
        ]}
        destroyOnClose={true}
      >
        {selectedPet && (
          <Form layout="vertical">
            <Item label="Image">
              {thumbnailPreview ? (
                <Image
                  width={200}
                  src={thumbnailPreview}
                  alt={selectedPet.name}
                />
              ) : (
                <Image
                  width={200}
                  src={selectedPet.image}
                  alt={selectedPet.name}
                />
              )}
            </Item>
            <Item label="Image File">
            <Upload
      customRequest={async ({ file, onSuccess, onError }) => {
        try {
          const storageRef = ref(storage, `petImages/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          await uploadTask;

          const url = await getDownloadURL(storageRef);
          setDownloadURL(url);

          onSuccess();

          // Display success message using SweetAlert
          Swal.fire({
            title: "Success!",
            text: "File uploaded successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          onError(error);
          console.error("File upload failed:", error);

          // Display error message using SweetAlert
          Swal.fire({
            title: "Error!",
            text: "File upload failed. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }}
      beforeUpload={(file) => {
        const maxSize = 5 * 1024 * 1024; // 5 MB
        const allowedFormats = ["image/jpeg", "image/png", "image/gif"];

        if (file.size > maxSize) {
          const errorMessage = `File size must be smaller than ${
            maxSize / 1024 / 1024
          } MB!`;
          // Display error message using SweetAlert
          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "OK",
          });

          return false;
        }

        if (!allowedFormats.includes(file.type.toLowerCase())) {
          const errorMessage = "Only JPEG, PNG, and GIF formats are allowed!";
          // Display error message using SweetAlert
          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "OK",
          });
          return false;
        }

        return true;
      }}
      onChange={handleFileInputChange}
      showUploadList={false}
    >
      <Button icon={<UploadOutlined />}>Upload File</Button>
    </Upload>
            </Item>
            <Item label="Name">
              <Input
                value={selectedPet.name}
                onChange={(e) =>
                  setSelectedPet({ ...selectedPet, name: e.target.value })
                }
              />
            </Item>
            <Item label="Type">
              <Input
                value={selectedPet.type}
                onChange={(e) =>
                  setSelectedPet({ ...selectedPet, type: e.target.value })
                }
              />
            </Item>
            <Item label="Breed">
              <Input
                value={selectedPet.breed}
                onChange={(e) =>
                  setSelectedPet({ ...selectedPet, breed: e.target.value })
                }
              />
            </Item>
            <Item label="Birthdate">
              <Input
                type="date"
                value={selectedPet.birthdate}
                onChange={(e) =>
                  setSelectedPet({
                    ...selectedPet,
                    birthdate: e.target.value,
                  })
                }
              />
            </Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default PetTable;
