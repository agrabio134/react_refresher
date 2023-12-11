import "./Style/AddPetForm.css";
import { initializeApp } from "firebase/app";
import { staticBreeds, staticAnimalTypes } from "./StaticData";
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
  const [filteredAnimalTypes, setFilteredAnimalTypes] = useState([]);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [submissionCount, setSubmissionCount] = useState(0);

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

  const handleAddPetWithImage = async () => {
    if (selectedFile && uploading) {
      const storageRef = ref(storage, `petImages/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      try {
        await uploadTask;
        const imageUrl = await getDownloadURL(storageRef);
        setDownloadURL(imageUrl);

        setSubmissionCount((prevCount) => prevCount + 1);

        // Delay the resubmission by 1 second
        if (submissionCount < 2) {
          // Delay the resubmission by 1 second
          setTimeout(() => {
            setUploading(false);
            handleAddPet();
          }, 1000);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploading(false);
      }
    }
  };
  useEffect(() => {
    if (submissionCount < 2) {
      handleAddPetWithImage();
    }
  }, [
    submissionCount,

    selectedFile,
    uploading,
    storage,
    filename,
    setDownloadURL,
    handleAddPet,
  ]);

  // Update breeds when the pet type changes
  useEffect(() => {
    setFilteredBreeds(staticBreeds[petType] || []);
  }, [petType]);

  const handleTypeSearch = (input) => {
    const filteredTypes = staticAnimalTypes.filter((type) =>
      type.name.toLowerCase().startsWith(input.toLowerCase())
    );
    setFilteredAnimalTypes(filteredTypes);

    // Update breeds based on the selected pet type
    if (filteredTypes.length === 1) {
      const selectedType = filteredTypes[0].name;
      setFilteredBreeds(staticBreeds[selectedType] || []);
    }
  };

  return (
    <div className="main-add-pet-form-container">
      <h2>Add Pet</h2>

      <div className="add-pet-separator"></div>
      <div className="profile-img">
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            style={{ maxWidth: "100px", maxHeight: "100px" }}
          />
        )}
      </div>

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
              <h1>Profile Image:</h1>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                required
              />
            </label>
          </div>

          {/* pet name */}
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
          <div className="add-pet-form autocomplete-container">
            <label>
              <h1>Type:</h1>
              <input
                type="text"
                value={petType}
                onChange={(e) => {
                  setPetType(e.target.value);
                  handleTypeSearch(e.target.value);
                }}
                required
              />
              {filteredAnimalTypes.length > 0 && (
                <div className="autocomplete-results">
                  <h4>Search Results:</h4>
                  <ul>
                    {filteredAnimalTypes.map((type) => (
                      <li
                        key={type.name}
                        onClick={() => {
                          setPetType(type.name);
                          setFilteredAnimalTypes([]);
                        }}
                      >
                        {type.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </label>
          </div>

          <div className="add-pet-form">
            <label>
              <h1>Breed:</h1>
              <input
                type="text"
                value={petBreed}
                onChange={(e) => setPetBreed(e.target.value)}
                list="breeds"
                disabled={!petType}
                required={!!petType} // Make breed input required only if pet type is selected
              />
              <datalist id="breeds">
                {filteredBreeds.map((breed) => (
                  <option key={breed} value={breed} />
                ))}
              </datalist>
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
        </div>
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Add Pet"}
        </button>
      </form>
    </div>
  );
};

export default AddPetForm;
