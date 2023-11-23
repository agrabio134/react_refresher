import React from "react";

const PetTable = ({ petList, handleUpdatePet, handleDeletePet }) => {
  return (
    <>
      <h2>Your Pets</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Breed</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {petList && petList.length > 0 ? (
            petList.map((pet) => (
              <tr key={pet.id}>
                <td>{pet.name}</td>
                <td>{pet.type}</td>
                <td>{pet.breed}</td>
                <td>{pet.age}</td>
                <td>
                  <button onClick={() => handleUpdatePet(pet.id)}>Edit</button>
                  <button onClick={() => handleDeletePet(pet.id)}>
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
    </>
  );
};

export default PetTable;
