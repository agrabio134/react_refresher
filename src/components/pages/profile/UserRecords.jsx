import React, { useState, useEffect, lazy, Suspense } from "react";
import { Modal, Table, Card } from "antd"; // Import Card component
import { Button, Image } from "antd";
import moment from "moment";
import "./Style/UserRecord.css";

const LazyTable = lazy(() => import("antd/lib/table"));

const UserRecords = ({ id }) => {
  const [vetRecord, setVetRecord] = useState([]);
  const [vetPetRecord, setVetPetRecord] = useState([]);
  const [vetGroomRecord, setVetGroomRecord] = useState([]);
  const [vetVaccineRecord, setVetVaccineRecord] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState("Consultation");
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    getVeterinaryRecord();
  }, [id]);

  useEffect(() => {
    if (selectedPet) {
      viewPetRecords(selectedPet);
    }
  }, [selectedPet]);

  const calculateAge = (birthdate) => {
    const today = moment();
    const birthdateMoment = moment(birthdate);
    const years = today.diff(birthdateMoment, "years");
    const months = today.diff(birthdateMoment, "months") % 12;
    const days = today.diff(birthdateMoment, "days");

    if (years > 0) {
      return `${years} ${years === 1 ? "year" : "years"}`;
    } else if (months > 0) {
      return `${months} ${months === 1 ? "month" : "months"}`;
    } else {
      return `${days} ${days === 1 ? "day" : "days"}`;
    }
  };

  const getVeterinaryRecord = async () => {
    try {
      const response = await fetch(
        `https://happypawsolongapo.com/api/get_user_pets/${id}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setVetRecord([]);
          return;
        } else {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
      } else {
        const textData = await response.text();

        try {
          const jsonObjects = textData
            .split("}{")
            .map((json, index, array) =>
              index === 0
                ? json + "}"
                : index === array.length - 1
                ? "{" + json
                : "{" + json + "}"
            );

          const vetRecordData = jsonObjects.flatMap((json) => {
            try {
              const parsedResult = JSON.parse(json);
              return parsedResult.payload || [];
            } catch (jsonError) {
              console.error("Error parsing JSON:", jsonError);
              return [];
            }
          });

          setVetRecord(vetRecordData);
          setVetPetRecord(vetRecordData);
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          setVetRecord([]); // Clear the state in case of an error
          setVetPetRecord([]); // Clear the state in case of an error
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setVetRecord([]); // Clear the state in case of an error
    }
  };

  const getVaccinePetRecord = async (pet_id) => {
    try {
      const response = await fetch(
        `https://happypawsolongapo.com/api/get_vaccine_record_admin_by_pet/${pet_id}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setVetVaccineRecord([]);
          return;
        } else {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
      } else {
        const textData = await response.text();

        try {
          const jsonObjects = textData
            .split("}{")
            .map((json, index, array) =>  
              index === 0
                ? json + "}"
                : index === array.length - 1
                ? "{" + json
                : "{" + json + "}"
            );

          const vetRecordData = jsonObjects.flatMap((json) => {
            try {
              const parsedResult = JSON.parse(json);
              return parsedResult.payload || [];
            } catch (jsonError) {
              console.error("Error parsing JSON:", jsonError);
              return [];
            }
          });

          setVetVaccineRecord(vetRecordData);
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          setVetVaccineRecord([]); // Clear the state in case of an error
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setVetVaccineRecord([]); // Clear the state in case of an error
    }
  };



  const getGroomingPetRecord = async (pet_id) => {
    try {
      const response = await fetch(
        `https://happypawsolongapo.com/api/get_grooming_record_admin_by_pet/${pet_id}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setVetGroomRecord([]);
          return;
        } else {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
      } else {
        const textData = await response.text();

        try {
          const jsonObjects = textData // Split the JSON objects
            .split("}{")
            .map((json, index, array) =>
              index === 0
                ? json + "}"
                : index === array.length - 1
                ? "{" + json // Add the missing bracket for the last object
                : "{" + json + "}"
            );

          const vetRecordData = jsonObjects.flatMap((json) => {
            try {
              const parsedResult = JSON.parse(json);
              return parsedResult.payload || [];
            } catch (jsonError) {
              console.error("Error parsing JSON:", jsonError);
              return [];
            }
          });

          setVetGroomRecord(vetRecordData);
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          setVetGroomRecord([]); // Clear the state in case of an error
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setVetGroomRecord([]); // Clear the state in case of an error
    }
  };

  const getVeterinaryPetRecord = async (pet_id) => {
    try {
      const response = await fetch(
        `https://happypawsolongapo.com/api/get_vet_record_admin_by_pet/${pet_id}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setVetRecord([]);
          return;
        } else {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
      } else {
        const textData = await response.text();

        try {
          const jsonObjects = textData
            .split("}{")
            .map((json, index, array) =>
              index === 0
                ? json + "}"
                : index === array.length - 1
                ? "{" + json
                : "{" + json + "}"
            );

          const vetRecordData = jsonObjects.flatMap((json) => {
            try {
              const parsedResult = JSON.parse(json);
              return parsedResult.payload || [];
            } catch (jsonError) {
              console.error("Error parsing JSON:", jsonError);
              return [];
            }
          });

          setVetRecord(vetRecordData);
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          setVetRecord([]); // Clear the state in case of an error
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setVetRecord([]); // Clear the state in case of an error
    }
  };

  const viewPetRecords = (pet_id) => {
    getVeterinaryPetRecord(pet_id);
    getGroomingPetRecord(pet_id);
    getVaccinePetRecord(pet_id);
  };

  const handleGoBack = () => {
    // setSelectedAppointment(null);
    setVetRecord([]);
    setSelectedPet(null);
    setVetGroomRecord([]);
  };

  const handleAppointmentSelection = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleViewRecordDataClick = (id) => {
    setSelectedPet(id);
  };


  const PetRecordCard = ({ record }) => (
    <div className="user-records-container">
    <Card className="pet-record-card" style={{ width: 300, marginBottom: 20 }}>
      <Image src={record.image} alt="Animal" width={100} height={100} />
      <p className="pet-name">
          Name: <b>{record.name}</b>
      </p>
      <p className="pet-type">
        Type: <b>{record.type}</b>
      </p>
      <p className="pet-breed">
        Breed: <b>{record.breed}</b>
      </p>
      <p className="pet-age">
        Date of Birth / Age: <b>{" "}
        {moment(record.birthdate).format("MMMM D, YYYY")} /{" "}
        {calculateAge(record.birthdate)} old</b>
      </p>
      <Button
        type="primary"
        onClick={() => handleViewRecordDataClick(record.id)}
      >
        View Records
      </Button>
    </Card></div>
  );

  const vaccineColumns = [
    { title: "Pet Name", dataIndex: "name", key: "name" },
    { title: "Vaccine Name", dataIndex: "vaccine_name", key: "vaccine_name" },
    { title: "Date Administered", dataIndex: "date_administered", key: "date_administered" },
    { title: "Next Due Date", dataIndex: "next_due_date", key: "next_due_date" },
    { title: "Administered By", dataIndex: "administered_by", key: "administered_by"}
  ];


  const groomColumn = [
    { title: "Pet Name", dataIndex: "name", key: "name" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  const columns = [
    { title: "Pet Name", dataIndex: "name", key: "name" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Vet on Duty", dataIndex: "vet_on_duty", key: "vet_on_duty" },
    { title: "Body Weight", dataIndex: "body_wt", key: "body_wt" },
    { title: "Temperature", dataIndex: "temp", key: "temp" },
    {
      title: "Complaint History",
      dataIndex: "complaint_history",
      key: "complaint_history",
      render: (text) => (
        <div
          style={{ maxWidth: "200px", maxHeight: "100px", overflow: "auto" }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Diagnostic Tool",
      dataIndex: "diagnostic_tool",
      key: "diagnostic_tool",
      render: (text) => (
        <div
          style={{ maxWidth: "200px", maxHeight: "100px", overflow: "auto" }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Laboratory Findings",
      dataIndex: "laboratory_findings",
      key: "laboratory_findings",
      render: (text) => (
        <div
          style={{ maxWidth: "200px", maxHeight: "100px", overflow: "auto" }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "General Assessment",
      dataIndex: "general_assessment",
      key: "general_assessment",
      render: (text) => (
        <div
          style={{ maxWidth: "200px", maxHeight: "100px", overflow: "auto" }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Medication Treatment",
      dataIndex: "medication_treatment",
      key: "medication_treatment",
      render: (text) => (
        <div
          style={{ maxWidth: "200px", maxHeight: "100px", overflow: "auto" }}
        >
          {text}
        </div>
      ),
    },
    { title: "Remarks", dataIndex: "remarks", key: "remarks" },
    {
      title: "Next Follow-up Checkup",
      dataIndex: "next_followup_checkup",
      key: "next_followup_checkup",
    },
  ];

  return (
    <div className="user-records">
      {!selectedPet && (
        <div className="pet-card-container">
          {vetPetRecord.length > 0 ? (
            vetPetRecord.map((record) => (
              <PetRecordCard key={record.id} record={record} />
            ))
          ) : (
            <p>No pets found.</p>
          )}
        </div>
      )}

      {selectedPet && (
        <>
          <div className="appointment-selection">
            <Button
              type="primary"
              onClick={() => handleAppointmentSelection("Consultation")}
            >
              Consultation
            </Button>
            <Button
              type="primary"
              onClick={() => handleAppointmentSelection("Vaccination")}
            >
              Vaccination
            </Button>
            <Button
              type="primary"
              onClick={() => handleAppointmentSelection("Grooming")}
            >
              Grooming
            </Button>
            <Button type="default" onClick={handleGoBack}>
              Back to Pet List
            </Button>
          </div>

          {selectedAppointment === "Consultation" && (
            <div className="appointment-details">
              <h3>Consultation Records</h3>
              <Suspense fallback={<div>Loading...</div>}>
                <LazyTable dataSource={vetRecord} columns={columns} className="test"/>
              </Suspense>
            </div>
          )}

          {selectedAppointment === "Vaccination" && (
            <div className="appointment-details">
              <h3>Vaccination Records</h3>
              <Suspense fallback={<div>Loading...</div>}>
                <LazyTable dataSource={vetVaccineRecord} columns={vaccineColumns} className="test"/>
              </Suspense>
            </div>
          )}

          {selectedAppointment === "Grooming" && (
            <div className="appointment-details">
              <h3>Grooming Records</h3>
              <Suspense fallback={<div>Loading...</div>}>
                <LazyTable dataSource={vetGroomRecord} columns={groomColumn} className="test"/>
              </Suspense>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserRecords;
