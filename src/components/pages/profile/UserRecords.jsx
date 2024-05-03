import React, { useState, useEffect, lazy, Suspense } from "react";
import { Modal, Table, Card } from "antd"; // Import Card component
import { Button, Image } from "antd";
import moment from "moment";

const LazyTable = lazy(() => import("antd/lib/table"));

const UserRecords = ({ id }) => {
  const [vetRecord, setVetRecord] = useState([]);
  const [vetPetRecord, setVetPetRecord] = useState([]);
  const [vetGroomRecord, setVetGroomRecord] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    getVeterinaryRecord();
  }, [id]);

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

          // console.log(vetRecordData);
          setVetRecord(vetRecordData);
          setVetPetRecord(vetRecordData);
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          setVetRecord([]); // Clear the state in case of an error
          setVetPetRecord([]); // Clear the state in case of an error
        }
      }
    } catch (error) {
      // console.error("Error fetching data:", error.message);
      setVetRecord([]); // Clear the state in case of an error
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

          // console.log(vetRecordData);
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
              // console.log(parsedResult.payload);
              return parsedResult.payload || [];
            } catch (jsonError) {
              // console.error("Error parsing JSON:", jsonError);
              return [];
            }
          });

          // console.log(vetRecordData);
          setVetRecord(vetRecordData);
        } catch (jsonError) {
          // console.error("Error parsing JSON:", jsonError);
          setVetRecord([]); // Clear the state in case of an error
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setVetRecord([]); // Clear the state in case of an error
    }
  };

  const handleGoBack = () => {
    setSelectedAppointment(null);
    setVetRecord([]);

    setSelectedPet(null); 

    

    

  
  };

  const handleAppointmentSelection = (appointment) => {
    setSelectedAppointment(appointment);


  };

  const handleViewRecordDataClick = (id) => {
    // get veterinary record id
    console.log(id);
    setSelectedPet(id);

    // handleViewPetDataClick(id);
  };

  const viewPetRecords = (id) => {

    handleViewPetDataClick(id);
    handleViewPetGroomingDataClick(id);

  };

  const PetRecordCard = ({ record }) => (
    <Card style={{ width: 300, marginBottom: 20 }}>
      <Image src={record.image} alt="Animal" width={50} height={50} />
      <p>Name: {record.name}</p>
      <p>Type: {record.type}</p>
      <p>Breed: {record.breed}</p>
      <p>
        Date of Birth / Age:{" "}
        {moment(record.birthdate).format("MMMM D, YYYY")} /{" "}
        {calculateAge(record.birthdate)} old
      </p>
      <Button
        type="primary"
        onClick={() => handleViewRecordDataClick(record.id)}
      >
        View Records
      </Button>
    </Card>
  );

  const handleViewPetDataClick = async (id) => {
    // get veterinary record id

    try {
      // setSelectedClient(client);
      await getVeterinaryPetRecord(id);
            setVetPetRecord((prevVetPetRecord) => [...prevVetPetRecord]);
    } catch (error) {
      console.error("Error fetching veterinary record:", error);
      setVetPetRecord([]);
    }


    
  };

  const handleViewPetGroomingDataClick = async (id) => {
    // get veterinary record id
    
    try {
      // setSelectedClient(client);
      await getGroomingPetRecord(id);
      setVetGroomRecord((prevVetGroomRecord) => [...prevVetGroomRecord]);
    } catch (error) {
      console.error("Error fetching grooming record:", error);
      setVetGroomRecord([]);

      
    }
  };

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
    <div className="user-records-container">
   
   {selectedPet === null && (
        <div>
          {vetPetRecord.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {vetPetRecord.map((record) => (
                <PetRecordCard key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <p>No records found.</p>
          )}
        </div>
      )}

      <div>
        {selectedPet != null && (
          <div>
            {selectedAppointment === null && (
              <div className="appointment-type">
                <h1>Record Categories</h1>
                <button
                  onClick={() => {
                    setSelectedPet(null);
                  }}
                >
                  Back
                </button>
                <div className="appointment-type-container">
                  <div
                    className="appointment-type-card"
                    onClick={() => handleAppointmentSelection("Consultation")}
                  >
                    <img src="/page/stethoscope.png" alt="consultation" />
                    <h3>Consultation</h3>
                    <p>For general checkup and consultation</p>
                  </div>
                  <div
                    className="appointment-type-card"
                    onClick={() => handleAppointmentSelection("Vaccination")}
                  >
                    <img src="/page/vaccine.png" alt="vaccination" />
                    <h3>Vaccination</h3>
                    <p>For vaccination and immunization</p>
                  </div>
                  <div
                    className="appointment-type-card"
                    onClick={() => handleAppointmentSelection("Grooming")}
                  >
                    <img src="/page/scissor-tool.png" alt="grooming" />
                    <h3>Grooming</h3>
                    <p>For grooming</p>
                  </div>
                </div>
              </div>
            )}

            {selectedAppointment && (
              <div>
                <button onClick={handleGoBack} className="backBtn">
                  Back
                </button>
                {selectedAppointment === "Grooming" && (
                  <div>
                    <h1>Grooming</h1>
                    <p>For grooming</p>

                    <Suspense fallback={<div>Loading...</div>}>
                    <LazyTable
                      dataSource={vetRecord}
                      columns={groomColumn}
                      rowKey={(vetRecord) => vetRecord.t1_id}
                      pagination={true}
                    />
                    </Suspense>

                  </div>
                )}
                {selectedAppointment === "Vaccination" && (
                  <div>
                    <h1>Vaccination</h1>
                    <p>For vaccination and immunization</p>
                  </div>
                )}
                {selectedAppointment === "Consultation" && (
                  <div>
                    <h1>Consultation</h1>
                    <p>For general checkup and consultation</p>

                    {(viewPetRecords(selectedPet))}
                    <Suspense fallback={<div>Loading...</div>}>

                    <LazyTable
                      dataSource={vetRecord}
                      columns={columns}
                      rowKey={(vetRecord) => vetRecord.t1_id}
                      pagination={true}
                    />
                                    </Suspense>

                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRecords;
