import React, { useState } from "react";
import { Image, Button, Modal, Form, Input, Select } from "antd";
import "./Style/PetTable.css";
import {
  calculateAgeInMonths,
  calculateAgeInDays,
} from "../utils/petAgeCalculation";

const { Option } = Select;

const PetTable = ({ petList, handleUpdatePet, handleDeletePet }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  const columns = [
    // ... other columns
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => handleEditPet(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => handleDeletePet(record.id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const handleEditPet = (pet) => {
    setSelectedPet(pet);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdate = () => {
    // Handle update logic here
    setIsModalVisible(false);
    handleUpdatePet(selectedPet.id);
  };
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
                        onClick={() => handleEditPet(pet)} // Fix this line
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
      >
        {selectedPet && (
          <Form layout="vertical">
            <Form.Item label="Image">
              <Image
                width={200}
                src={selectedPet.image}
                alt={selectedPet.name}
              />
            </Form.Item>
            <Form.Item label="Image URL">
              <Input
                value={selectedPet.image}
                onChange={(e) =>
                  setSelectedPet({ ...selectedPet, image: e.target.value })
                }
              />
            </Form.Item>
            
                
            <Form.Item label="Name">
              <Input
                value={selectedPet.name}
                onChange={(e) =>
                  setSelectedPet({ ...selectedPet, name: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Type">
              <Input
                value={selectedPet.type}
                onChange={(e) =>
                  setSelectedPet({ ...selectedPet, type: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Breed">
              <Input
                value={selectedPet.breed}
                onChange={(e) =>
                  setSelectedPet({ ...selectedPet, breed: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Birthdate">
              <Input
                value={selectedPet.birthdate}
                onChange={(e) =>
                  setSelectedPet({ ...selectedPet, birthdate: e.target.value })
                }
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default PetTable;
