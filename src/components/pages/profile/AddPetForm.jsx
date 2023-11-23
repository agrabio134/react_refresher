import React from "react";

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
      <h2>Add Pet</h2>
      <form onSubmit={(e) => e.preventDefault()}>
            <label>
              Name:
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                required
              />
            </label>
            <label>
              Type:
              <input
                type="text"
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                required
              />
            </label>
            <label>
              Breed:
              <input
                type="text"
                value={petBreed}
                onChange={(e) => setPetBreed(e.target.value)}
                required
              />
            </label>
            <label>
              Age:
              <input
                type="number"
                value={petAge}
                onChange={(e) => setPetAge(e.target.value)}
                required
              />
            </label>
            <button onClick={handleAddPet}>Add Pet</button>
          </form>       
    </>
  );
};

export default AddPetForm;
