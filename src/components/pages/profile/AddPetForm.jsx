import React from "react";
import "./Style/AddPetForm.css";

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
}) => {
  return (
    <>
    <div className="main-add-pet-form-container">
      <h2>Add Pet</h2>
      <div className="add-pet-separator"></div>
      <form className="main-form-body-container" onSubmit={(e) => e.preventDefault()}>
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
            <h1>Age:</h1>
              <input
                type="number"
                value={petAge}
                onChange={(e) => setPetAge(e.target.value)}
                required
              />
            </label>
            </div>
            </div>
            <button onClick={handleAddPet}>Add Pet</button>
          </form> 
        </div>      
    </>
  );
};

export default AddPetForm;
