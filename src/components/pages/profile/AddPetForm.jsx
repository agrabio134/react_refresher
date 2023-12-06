import "./Style/AddPetForm.css";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useState, useEffect } from "react";
import firebaseConfig from "../../admin/config/FirebaseConfig";

const AddPetForm = ({
  petName,
  setPetName,
  petType,
  setPetType,
  petBreed,
  setPetBreed,
  petAge,
  setPetAge,
  handleAddPet,
  petSex,
  setPetSex,
  petImageUrl,
  setDownloadURL,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [filename, setFilename] = useState("");
  const [uploading, setUploading] = useState(false);

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      const filename = file.name;
      setFilename(filename);

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  useEffect(() => {
    if (selectedFile && uploading) {
      const handleAddPetWithImage = async () => {
        const storageRef = ref(storage, `petImages/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        try {
          await uploadTask;
          const imageUrl = await getDownloadURL(storageRef);
          setDownloadURL(imageUrl);

          setTimeout(() => {
            handleAddPet();
            setUploading(false);
          }, 1000);
        } catch (error) {
          console.error("Error uploading file:", error);
          setUploading(false);
        }
      };

      handleAddPetWithImage();
    }
  }, [selectedFile, uploading, storage, filename, setDownloadURL]); // Removed handleAddPet from dependencies


  return (
    <div className="main-add-pet-form-container">
      <h2>Add Pet</h2>
      <div className="add-pet-separator"></div>
      <form
        className="main-form-body-container"
        onSubmit={(e) => {
          e.preventDefault();
          setUploading(true);
        }}
      >
        <div className="add-pet-grid-form">
          <div className="add-pet-form">
            <label>
              <h1>Name:</h1>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="add-pet-form">
            <label>
              <h1>Type:</h1>
              <input
                type="text"
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="add-pet-form">
            <label>
              <h1>Breed:</h1>
              <input
                type="text"
                value={petBreed}
                onChange={(e) => setPetBreed(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="add-pet-form">
            <label>
              <h1>Birthdate:</h1>
              <input
                type="date"
                value={petAge}
                onChange={(e) => setPetAge(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="add-pet-form">
            <label>
              <h1>Sex:</h1>
              <select
                value={petSex}
                onChange={(e) => setPetSex(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Sex
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
          </div>

        <div className="add-pet-form">
          <label>
            <h1>Profile Image:</h1>
            <input type="file" accept="image/*" onChange={handleFileInput} />
          </label>
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          )}
        </div>
        </div>
        <button onClick={() => setUploading(true)} disabled={uploading}>
          {uploading ? "Uploading..." : "Add Pet"}
        </button>
      </form>
    </div>
  );
};

export default AddPetForm;
