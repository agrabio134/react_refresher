import React, { useState, useEffect } from "react";
import { Modal, Table } from "antd";
import { Button, Image } from "antd";
import moment from "moment";

const UserRecords = ({ id }) => {
  const [records, setRecords] = useState([]);
  const [vetRecord, setVetRecord] = useState([]);
  const [vetPetRecord, setVetPetRecord] = useState([]);
  const [recordVetModalVisible, setRecordVetModalVisible] = useState(false);
  const [vetRecordError, setVetRecordError] = useState(null);
  

  useEffect(() => {
    getVeterinaryRecord();
  }, [id]);

  const calculateAge = (birthdate) => {
    const today = moment();
    const birthdateMoment = moment(birthdate);
    const years = today.diff(birthdateMoment, 'years');
    const months = today.diff(birthdateMoment, 'months') % 12;
    const days = today.diff(birthdateMoment, 'days');
  
    if (years > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    } else if (months > 0) {
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    }
  };
  const getVeterinaryRecord = async () => {
    try {
      const response = await fetch(
        `https://happypawsolongapo.com/api/get_user_pets/${id}`
      );

      if (!response.ok) {
        // Check specifically for 404 status and handle it as a non-error
        if (response.status === 404) {
          // console.log(`No data found for user with ID ${user_id}`);
          setVetRecord([]); // Set the state to an empty array
          return; // Return early without throwing an error
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
      console.error("Error fetching data:", error.message);
      setVetRecord([]); // Clear the state in case of an error
    }
  };

  const getVeterinaryPetRecord = async (pet_id) => {
    try {
      const response = await fetch(
        `https://happypawsolongapo.com/api/get_vet_record_admin_by_pet/${pet_id}`
      );

      if (!response.ok) {
        // Check specifically for 404 status and handle it as a non-error
        if (response.status === 404) {
          // console.log(`No data found for user with ID ${user_id}`);
          setVetRecord([]); // Set the state to an empty array
          return; // Return early without throwing an error
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
                console.log(parsedResult.payload);  // Add this line to log data
                return parsedResult.payload || [];
              } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError);
                return [];
              }
            });
            

          // console.log(vetRecordData);
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

  const PetRecordColumns = [
    { title: "image", dataIndex: "image", key: "image",
    render: (image) => <Image src={image} alt="Animal" width={50} height={50} />,
  },

    { title: "name", dataIndex: "name", key: "name" },
    { title: "type", dataIndex: "type", key: "type" },
    { title: "breed", dataIndex: "breed", key: "breed" },
    {
      title: 'Date of Birth / Age',
      dataIndex: 'birthdate',
      key: 'birthdate',
      render: (birthdate) => (
        <>
          <div>{moment(birthdate).format('MMMM D, YYYY')} / {calculateAge(birthdate)} old</div>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record, index) => (
        <Button
          type="primary"
          key={index}
          onClick={() => {
            handleViewPetDataClick(record.id);
          }}
        >
          View Records
        </Button>
      ),
    },
  ];

  const handleViewPetDataClick = async (id) => {
    // get veterinary record id

    try {
      // setSelectedClient(client);
      await getVeterinaryPetRecord(id);
      setRecordVetModalVisible(true);
      setVetPetRecord((prevVetPetRecord) => [...prevVetPetRecord]);
    } catch (error) {
      console.error("Error fetching veterinary record:", error);
      setVetPetRecord([]);
      setVetRecordError(error);
    }
  };


  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Vet on Duty", dataIndex: "vet_on_duty", key: "vet_on_duty" },
    { title: "Body Weight", dataIndex: "body_wt", key: "body_wt" },
    { title: "Temperature", dataIndex: "temp", key: "temp" },
    {
        title: "Complaint History",
        dataIndex: "complaint_history",
        key: "complaint_history",
        render: (text) => (
          <div style={{ maxWidth: "200px", maxHeight: "100px", overflow: "auto" }}>
            {text}
          </div>
        ),
      },
      {
        title: "Diagnostic Tool",
        dataIndex: "diagnostic_tool",
        key: "diagnostic_tool",
        render: (text) => (
          <div style={{ maxWidth: "200px", maxHeight: "100px", overflow: "auto" }}>
            {text}
          </div>
        ),
      },
      {
        title: "Laboratory Findings",
        dataIndex: "laboratory_findings",
        key: "laboratory_findings",
        render: (text) => (
          <div style={{ maxWidth: "200px", maxHeight: "100px", overflow: "auto" }}>
            {text}
          </div>
        ),
      },
      {
        title: "General Assessment",
        dataIndex: "general_assessment",
        key: "general_assessment",
        render: (text) => (
          <div style={{ maxWidth: "200px", maxHeight: "100px", overflow: "auto" }}>
            {text}
          </div>
        ),
      },
      {
        title: "Medication Treatment",
        dataIndex: "medication_treatment",
        key: "medication_treatment",
        render: (text) => (
          <div style={{ maxWidth: "200px", maxHeight: "100px", overflow: "auto" }}>
            {text}
          </div>
        ),
      },
    { title: "Remarks", dataIndex: "remarks", key: "remarks" },
    { title: "Next Follow-up Checkup", dataIndex: "next_followup_checkup", key: "next_followup_checkup" },
  ];

  return (
    <div className="user-records-container">
      {/* <h2>User Records</h2> */}
      {vetPetRecord.length > 0 ? (
        <Table
          dataSource={vetPetRecord}
          columns={PetRecordColumns}
          rowKey={(vetPetRecord) => vetPetRecord.t1_id}
          pagination={true}

        />
      ) : (
        <p>No records found.</p>
      )}

      
      <Modal 
        title="Veterinary Records"
        visible={recordVetModalVisible}
        onCancel={() => setRecordVetModalVisible(false)}
        footer={null}
        width={1200}
      > 
        <Table
          dataSource={vetRecord}
          columns={columns}
          rowKey={(vetRecord) => vetRecord.t1_id}
          pagination={true}
        />
      </Modal>



    </div>
  );
};

export default UserRecords;
