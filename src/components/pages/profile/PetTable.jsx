import React from "react";
import "./Style/PetTable.css";
import { calculateAgeInMonths, calculateAgeInDays } from "../utils/petAgeCalculation";

const PetTable = ({ petList, handleUpdatePet, handleDeletePet }) => {

  return (
    <>
      <div className="main-pet-table-container">
        <h2>Your Pets</h2>
        <div className="pet-table-separator"></div>
        <div className="mobile-table">
          <table className="whole-pet-table">
            <thead>
              <tr>
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
                        onClick={() => handleUpdatePet(pet.id)}
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
    </>
  );
};

export default PetTable;
