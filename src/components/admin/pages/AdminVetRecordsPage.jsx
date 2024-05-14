import React, { useState, useEffect } from "react";
import DataFetching from "./records/DataFetching";
import AppointmentDetailsModal from "./records/AppointmentDetailsModal";
import { Form, Button, Tabs, Table, Modal, Select, Image, Card } from "antd";
import moment from "moment";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";
import "./styles/card-style.css";
import AppoinmentVaccinationModal from "./records/AppointmentVaccinationModal";

const { TabPane } = Tabs;
const { Option } = Select;

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
const VeterinaryRecord = () => {
  const [printableRecords, setPrintableRecords] = useState([]);
  const [selectedPet, setSelectedPet] = useState([]);
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const [form] = Form.useForm();
  const [formVaccine] = Form.useForm();
  const [appointments, setAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [recordVetModalVisible, setRecordVetModalVisible] = useState(false);
  const [recordGroomingModalVisible, setRecordGroomingModalVisible] = useState(false);
  const [recordVaccineModalVisible, setRecordVaccineModalVisible] = useState(false);
  const [modalVaccineVisible, setModalVaccineVisible] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null); // [1]
  const [clients, setClients] = useState([]);
  const [vetRecord, setVetRecord] = useState([]);
  const [vetGroomRecord, setVetGroomRecord] = useState([]);
  const [vetPetRecord, setVetPetRecord] = useState([]);
  const [vetRecordError, setVetRecordError] = useState(null); // New state to store vet record fetching errors

  useEffect(() => {
    if (selectedOption !== null) {
      handleOptionClicked(selectedOption);
    }
  }, [selectedOption]);
  const fetchClientData = async () => {
    try {
      const clientsResponse = await fetch(
        "https://happypawsolongapo.com/api/get_clients"
      );
      const jsonData = await clientsResponse.text();

      try {
        const jsonObjects = jsonData
          .split("}{")
          .map((json, index, array) =>
            index === 0
              ? json + "}"
              : index === array.length - 1
              ? "{" + json
              : "{" + json + "}"
          );

        const clientsData = jsonObjects.flatMap((json, index) => {
          try {
            const parsedResult = JSON.parse(json);
            return parsedResult.payload || [];
          } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            return null;
          }
        });

        // console.log(clientsData);
        setClients(clientsData);
      } catch (splitError) {
        console.error("Error splitting JSON:", splitError);
      }
    } catch (error) {
      console.error("Error fetching client data:", error.message);
    }
  };

  useEffect(() => {
    // Fetch appointment data when the component mounts
    fetchData();

    // Fetch client data when the component mounts
    fetchClientData();
  }, []); // Empty dependency array means this effect runs once on mount

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://happypawsolongapo.com/api/get_done_appointments_admin"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

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

        const appointmentsData = jsonObjects.flatMap((json) => {
          try {
            const parsedResult = JSON.parse(json);
            return parsedResult.payload || [];
          } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            return [];
          }
        });

        setAppointments(appointmentsData);
      } catch (splitError) {
        console.error("Error splitting JSON:", splitError);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const mapAppointmentData = (appointment) => {
    const status = appointment.status.toLowerCase();
    const startDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    return {
      ...appointment,
      title: `${appointment.fname}'s appointment for ${appointment.name}`,
      start: startDateTime,
      end: endDateTime,
      petId: appointment.t2_id,
      userId: appointment.t3_id,
    };
  };

  const ClientsColumns = [
    { title: "First Name", dataIndex: "fname", key: "fname" },
    { title: "Last Name", dataIndex: "lname", key: "lname" },
    { title: "Contact Number", dataIndex: "contact_no", key: "contact_no" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Account Status",
      dataIndex: "is_verified",
      key: "is_verified",
      render: (text, record) => (
        <p style={{ color: text ? "green" : "red" }}>
          {text ? "Verified" : "Not Verified"}
        </p>
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
            handleViewClientsDataClick(record);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const vetGroomColumns = [
    { title: "Pet Name", dataIndex: "name", key: "name" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  const VetRecordColumns = [
    // { title: "id", dataIndex: "t1_id", key: "t1_id" },
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
    {
      title: "Action",
      dataIndex: "print",
      key: "print",
      render: (text, record) => (
        <Button type="primary" onClick={() => handlePrint(record.t1_id)}>
          Print
        </Button>
      ),
    },
  ];
  useEffect(() => {
    if (selectedClient) {
      getVeterinaryRecord(selectedClient.id);
      getVeterinaryPetRecord(selectedClient.id);
    }
  }, [selectedClient /* other dependencies */]);

  const handlePrint = (targetId) => {
    const printableData = vetRecord.filter(
      (record) => record.t1_id === targetId
    );

    console.log(printableData);

    // Open a new window for printing
    const printWindow = window.open("", "_blank");

    // Construct the HTML content for printing
    const printContent = `
    <html>
    <head>
      <title>Veterinary Records</title>
      <!-- Add any additional styles if needed -->
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }
  
        .record-container {
          margin-bottom: 20px;
          border: 1px solid #ddd;
          padding: 15px;
        }
  
        h1 {
          text-align: center;
        }
  
        .info-box {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }
  
        .record-label {
          font-weight: bold;
          margin-bottom: 5px;
        }
  
        .record-value {
          margin-bottom: 15px;
        
          border: 1px solid #ddd;
          padding: 5px 20px;

        }
  
        .date-picker {
          width: 100%;
          margin-bottom: 15px;
        }
  
        .text-area {
          width: 100%;
          height: 100px;
          margin-bottom: 15px;
        }
  
        .hidden-input {
          display: none;
        }
  
        .submit-button {
          margin-top: 15px;
        }

        .first_row {
          display: flex;
          flex-direction: row;
          
        }
        .record_item {
          display: flex;
        }
        .record_item_lab {
          
        }
        .second_row {
          margin-top: 20px;
          margin-bottom: 30px;
         
        }
        .third_row {
          display: flex;
          flex-direction: row;
          margin-bottom: 30px;
        }
        .fourth_row {
          margin-bottom: 30px;
        }
        .fifth_row {
          display: flex;
          flex-direction: row;
          margin-bottom: 30px;
        }
        .sixth_row {
          margin-bottom: 30px;
        }
        .client-info{
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

    
      </style>
    </head>
    <body>
      <h1>Veterinary Records</h1>
      ${printableData
        .map(
          (record) => `
          <div class="record-container">

          <div class="client-info">
            <div class="info-box">CLIENT NAME: ${record.fname} ${record.lname}</div>
            <div class="info-box">CONTACT NO: ${record.contact_no}</div>

            <div class="info-box">ADDRESS: ${record.address}</div>
            <div class="info-box">BREED: ${record.breed}</div>

            <div class="info-box">PETNAME: ${record.name}</div>
            <div class="info-box">SEX: ${record.sex}</div>

            <div class="info-box">DATE OF BIRTH: ${record.birthdate}</div>
  
          </div>
  
            <div class="first_row">
            <div style="flex-grow: 2" class="record_item">
            <div class="record-label">Date:</div>
            <div class="record-value">${record.date}</div>
            </div>
            <div style="flex-grow: 2" class="record_item">
            <div class="record-label">Vet on Duty:</div>
            <div class="record-value">${record.vet_on_duty}</div>
            </div>
            <div style="flex-grow: 1" class="record_item">

            <div class="record-label">Body Weight:</div>
            <div class="record-value">${record.body_wt}</div>
            </div>
            <div style="flex-grow: 1" class="record_item">
            <div class="record-label">Temperature:</div>
            <div class="record-value">${record.temp}</div>
            </div>

            </div>

            <div class="second_row">

  
            <div class="record-label">Complaint History:</div>
            <div class="record-value">${record.complaint_history}</div>
            </div>

            <div class="third_row">

            <div style="flex-grow: 2" class="record_item_lab">

            <div class="record-label">Diagnostic Tool:</div>
            <div class="record-value" >${record.diagnostic_tool}</div>
            </div>
            <div style="flex-grow: 2" class="record_item_lab">

  
            <div class="record-label">Laboratory Findings:</div>
            <div class="record-value">${record.laboratory_findings}</div>
            </div>
            </div>

            <div class="fourth_row">

  
            <div class="record-label">General Assessment:</div>
            <div class="record-value">${record.general_assessment}</div>

            </div>

            <div class="fifth_row">

            <div style="flex-grow: 2" class="record_item_lab">

            <div class="record-label">Medication Treatment:</div>
            <div class="record-value">${record.medication_treatment}</div>
            </div>
            <div style="flex-grow: 2" class="record_item_lab">
  
            <div class="record-label">Remarks:</div>
            <div class="record-value">${record.remarks}</div>
            </div>

            </div>
            <div class="sixth_row">
  
            <div class="record-label">Next Follow-up Checkup:</div>
            <div class="record-value">${record.next_followup_checkup}</div>
            </div>

          </div>
        `
        )
        .join("")}
    </body>
  </html>
  
  
    `;

    // Set the HTML content to the new window
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Trigger the print dialog
    printWindow.print();
  };

  // Update printableRecords whenever vetRecord is updated
  useEffect(() => {
    setPrintableRecords(vetRecord);
  }, [vetRecord]);

  const handleViewClientsDataClick = async (client) => {
    try {
      setSelectedClient(client);
      await getVeterinaryRecord(client.id);
      await getVeterinaryPetRecord(client.id);
      setRecordModalVisible(true);
      setVetRecord((prevVetRecord) => [...prevVetRecord]);
      setVetPetRecord((prevVetPetRecord) => [...prevVetPetRecord]);
    } catch (error) {
      console.error("Error fetching veterinary record:", error);
      setVetRecord([]);
      setVetPetRecord([]);
      setVetRecordError(error);
    }
  };

  const handleViewPetDataClick = async (pet) => {
    try {
      setSelectedPet(pet);

      // add 3 card option if consultation, vaccination, grooming
      setOptionModalVisible(true);
    } catch (error) {
      console.error("Error fetching veterinary record:", error);
      setVetRecord([]);
      setVetRecordError(error);
    }
  };

  const handleOptionClicked = () => {
    if (selectedOption === "consultation") {
      handleViewPetViewConsultation(selectedPet);
    }
    if (selectedOption === "vaccination") {
      console.log("vaccination");
      handleViewPetViewVaccination(selectedPet);
    }
    if (selectedOption === "grooming") {
      console.log("grooming");
      handleViewPetViewGrooming(selectedPet);
    }
  };

  const handleViewPetViewGrooming = async (pet) => {
    try {
      setSelectedClient(pet);
      await getGroomingPetRecord(pet.id);
      setRecordGroomingModalVisible(true);
      setVetPetRecord((prevVetPetRecord) => [...prevVetPetRecord]);
    } catch (error) {
      console.error("Error fetching veterinary record:", error);
      setVetPetRecord([]);
      setVetRecordError(error);
    }
  };

  const handleViewPetViewVaccination = async (pet) => {
    try {
      setSelectedClient(pet);
      await getVaccinePetRecord(pet.id);
      setRecordVetModalVisible(true);
      setVetPetRecord((prevVetPetRecord) => [...prevVetPetRecord]);
    } catch (error) {
      console.error("Error fetching veterinary record:", error);
      setVetPetRecord([]);
      setVetRecordError(error);
    }
  };

  const handleViewPetViewConsultation = async (pet) => {
    try {
      setSelectedClient(pet);
      await getVeterinaryPetRecord(pet.id);
      setRecordVetModalVisible(true);
      setVetPetRecord((prevVetPetRecord) => [...prevVetPetRecord]);
    } catch (error) {
      console.error("Error fetching veterinary record:", error);
      setVetPetRecord([]);
      setVetRecordError(error);
    }
  };

  const handleRecordModalCancel = () => {
    setRecordModalVisible(false);
    setSelectedAppointment(null);
  };

  const handleRecordVetModalCancel = () => {
    setRecordVetModalVisible(false);
    setRecordGroomingModalVisible(false);
    setRecordVaccineModalVisible(false);
    setSelectedOption(null);
    setSelectedAppointment(null);
  };

  const getVeterinaryRecord = async (user_id) => {
    try {
      const response = await fetch(
        `https://happypawsolongapo.com/api/get_user_pets/${user_id}`
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

  const getGroomingPetRecord = async (pet_id) => {
    try {
      const response = await fetch(
        `https://happypawsolongapo.com/api/get_grooming_record_admin_by_pet/${pet_id}`
      );

      if (!response.ok) {
        // Check specifically for 404 status and handle it as a non-error
        if (response.status === 404) {
          // console.log(`No data found for user with ID ${user_id}`);
          setVetGroomRecord([]); // Set the state to an empty array
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
              console.log(parsedResult.payload); // Add this line to log data
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
              console.log(parsedResult.payload); // Add this line to log data
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

  const mappedAppointments = appointments.map(mapAppointmentData);

  const mapDataSource = (appointment, index) => {
    const isAM = moment(appointment.start).format("A") === "AM";

    return {
      key: index,
      fullName: `${appointment.fname} ${appointment.lname}`,
      contactNumber: appointment.contact_no,
      address: appointment.address,
      petName: appointment.name,
      petBreed: appointment.breed,
      dateOfBirth: appointment.birthdate,
      petSex: appointment.sex,
      date: moment(appointment.start).format("YYYY-MM-DD"),
      time: `${moment(appointment.start).format("hh:mm")} ${
        isAM ? "AM" : "PM"
      }`,
      reason: appointment.reason,
      petId: appointment.t2_id,
      userId: appointment.t3_id,
    };
  };

  const dataSource = mappedAppointments.map(mapDataSource);

  const columns = [
    {
      title: "Pet Owner",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Pet Name",
      dataIndex: "petName",
      key: "petName",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Reason for Appointment",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Button
        type="primary"
        onClick={() => {
          if (record.reason != 'Checkup') {
            handleVaccinationClick(record);
          } else {
            handleHistoryClick(record);
          }
        }}
      >
        Details
      </Button>
      ),
    },
  ];
  const handleVaccinationClick = (appointment) => {
    const initialValues = {
      date: "",
      vetOnDuty: "",
      bodyWt: "",
      temp: "",
      complaintHistory: "",
      diagnosticTool: "",

      laboratoryFindings: "",
      generalAssessment: "",
      medicationTreatment: "",
      remarks: "",
      nextFollowupCheckup: "",
      userId: appointment.userId,
      petId: appointment.petId,
      adminId: "",
    };

    form.setFieldsValue(initialValues);
    setSelectedAppointment(appointment);
    setModalVaccineVisible(true);
  };




  const handleHistoryClick = (appointment) => {
    const initialValues = {
      date: "",
      vetOnDuty: "",
      bodyWt: "",
      temp: "",
      complaintHistory: "",
      diagnosticTool: "",
      laboratoryFindings: "",
      generalAssessment: "",
      medicationTreatment: "",
      remarks: "",
      nextFollowupCheckup: "",
      userId: appointment.userId,
      petId: appointment.petId,
      adminId: "",
    };

    form.setFieldsValue(initialValues);
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setModalVaccineVisible(false);
    setSelectedAppointment(null);
  };

  const adminAuthToken = localStorage.getItem("adminAuthToken");
  const decodedAdminToken = jwt_decode(adminAuthToken);
  const adminId = decodedAdminToken.user_id;

  const handleSubmitVaccineForm = async (values) => {
    const formData = new FormData();
    const formattedNextFollowUpDate = moment(values.next_due_date).format(
      "YYYY-MM-DD"
    );
    const formattedDate = moment(values.date_administered).format("YYYY-MM-DD");
// vaccine_name
    formData.append("date_administered", formattedDate);
    formData.append("vaccine_name", values.vaccine_name);
    formData.append("administered_by", values.administered_by);
    formData.append("next_due_date", formattedNextFollowUpDate);

    formData.append("pet_id", values.pet_id);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
      showDenyButton: true,
      denyButtonColor: "#3085d6",
      denyButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            "https://happypawsolongapo.com/api/submit_vaccine_record_admin",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            console.error(`Request failed with status: ${response.status}`);
            const contentType = response.headers.get("content-type");
            
            if (contentType && contentType.includes("application/json")) {
              const errorJson = await response.json();
              console.error("Error response JSON:", errorJson);
            } else {
              const errorText = await response.text();
              console.error(`Error response text: ${errorText}`);
            }

            throw new Error("Failed to submit vaccine record");

          }

          const data = await response.json(); 
          console.log(data);

          Swal.fire("Submitted!", "Record has been submitted.", "success");
          setModalVaccineVisible(false);
        } catch (error) {
          console.error("Error submitting vaccine record:", error);
        }
      }
    });
  };





    

  const handleSubmit = async (values) => {
    const formData = new FormData();
    const formattedNextFollowUpDate = moment(values.nextFollowupCheckup).format(
      "YYYY-MM-DD"
    );
    const formattedDate = moment(values.date).format("YYYY-MM-DD");

    formData.append("date", formattedDate);
    formData.append("vet_on_duty", values.vetOnDuty);
    formData.append("body_wt", values.bodyWt);
    formData.append("temp", values.temp);
    formData.append("complaint_history", values.complaintHistory);
    formData.append("diagnostic_tool", values.diagnosticTool);
    formData.append("laboratory_findings", values.laboratoryFindings);
    formData.append("general_assessment", values.generalAssessment);
    formData.append("medication_treatment", values.medicationTreatment);
    formData.append("remarks", values.remarks);
    formData.append("next_followup_checkup", formattedNextFollowUpDate);
    formData.append("user_id", values.userId);
    formData.append("pet_id", values.petId);
    formData.append("admin_id", adminId);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
      showDenyButton: true,
      denyButtonColor: "#3085d6",
      denyButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            "https://happypawsolongapo.com/api/submit_vet_record_admin",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            console.error(`Request failed with status: ${response.status}`);
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
              const errorJson = await response.json();
              console.error("Error response JSON:", errorJson);
            } else {
              const errorText = await response.text();
              console.error(`Error response text: ${errorText}`);
            }

            throw new Error("Failed to submit vet record");
          }

          const data = await response.json();
          console.log(data);

          Swal.fire("Submitted!", "Record has been submitted.", "success");
          setModalVisible(false);
        } catch (error) {
          console.error("Error submitting vet record:", error);
        }
      }
    });
  };

  const renderTabs = () => (
    <Tabs defaultActiveKey="1" style={{ marginTop: 20 }}>
      <TabPane tab="Appointment History" key="1">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          style={{ marginTop: 20 }}
          rowKey={(record) => record.key}
          scroll={{ x: true }}
        />
      </TabPane>
      <TabPane tab="Client Records" key="2">
        <h1>Client Records</h1>
        {clients.length > 0 && (
          <Table
            dataSource={clients}
            columns={ClientsColumns}
            style={{ marginTop: 20 }}
            rowKey={(record) => record.id}
            scroll={{ x: true }}
          />
        )}
      </TabPane>
    </Tabs>
  );

  const renderModal = () => (
    <>
      <Modal
        // other properties
        visible={optionModalVisible}
        onCancel={() => setOptionModalVisible(false)}
        width={1600}
      >
        <h1>Choose Option</h1>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <Card
            className="consultation-card"
            onClick={() => {
              setSelectedOption("consultation");
              setOptionModalVisible(false);
              // setRecordVetModalVisible(true);
              handleOptionClicked(selectedOption);
            }}
          >
            <h3>Consultation</h3>
            <p>Description of Consultation</p>
          </Card>
          <Card
            className="vaccination-card"
            onClick={() => {
              setSelectedOption("vaccination");
              setOptionModalVisible(false);
              // setRecordVetModalVisible(true);
              handleOptionClicked(selectedOption);
            }}
          >
            <h3>Vaccination</h3>
            <p>Description of Vaccination</p>
          </Card>
          <Card
            className="grooming-card"
            onClick={() => {
              setSelectedOption("grooming");
              setOptionModalVisible(false);
              // setRecordVetModalVisible(true);
              handleOptionClicked(selectedOption);
            }}
          >
            <h3>Grooming</h3>
            <p>Description of Grooming</p>
          </Card>
        </div>
      </Modal>
      <AppointmentDetailsModal
        modalVisible={modalVisible}
        handleModalCancel={handleModalCancel}
        form={form}
        handleSubmit={handleSubmit}
        selectedAppointment={selectedAppointment}
        Option={Option}
      />

      <AppoinmentVaccinationModal
        // other properties
        modalVisible={modalVaccineVisible}
        handleModalCancel={handleModalCancel}
        form={formVaccine}
        handleSubmit ={handleSubmitVaccineForm}
        selectedAppointment={selectedAppointment}
        Option={Option}
      >

      </AppoinmentVaccinationModal>
      <Modal
        // other properties
        visible={recordModalVisible}
        onCancel={handleRecordModalCancel}
        onOk={() => setRecordModalVisible(false)}
        width={1600}
      >
        <h1>Users Pet</h1>
        {vetPetRecord.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {vetPetRecord.map((pet, index) => (
              <Card
                key={index}
                style={{ width: 300, marginBottom: 20 }}
                cover={<Image src={pet.image} alt="Animal" />}
              >
                <Card.Meta
                  title={pet.name}
                  description={
                    <div>
                      <p>Type: {pet.type}</p>
                      <p>Breed: {pet.breed}</p>
                      <p>
                        Date of Birth:{" "}
                        {moment(pet.birthdate).format("MMMM D, YYYY")}
                      </p>
                      <p>Age: {calculateAge(pet.birthdate)} years old</p>
                    </div>
                  }
                />
                <Button
                  type="primary"
                  onClick={() => {
                    handleViewPetDataClick(pet);
                  }}
                >
                  View Records
                </Button>
              </Card>
            ))}
          </div>
        ) : vetRecordError ? (
          <p>Error fetching veterinary record: {vetRecordError.message}</p>
        ) : (
          <p>No Pet found.</p>
        )}
      </Modal>
      ;
      <Modal
        // other properties
        visible={recordVetModalVisible}
        onCancel={handleRecordVetModalCancel}
        onOk={() => setRecordVetModalVisible(false)}
        width={1600}
      >
        <h1>Veterinary Records</h1>
        {vetRecord.length > 0 ? (
          <Table
            dataSource={vetRecord}
            columns={VetRecordColumns}
            style={{ marginTop: 20 }}
            rowKey={(record, index) => `${record.t3_id}_${index}`}
            scroll={{ x: true }}
          />
        ) : vetRecordError ? (
          <p>Error fetching veterinary record: {vetRecordError.message}</p>
        ) : (
          <p>No veterinary record found.</p>
        )}
      </Modal>
      <Modal
        // other properties
        visible={recordGroomingModalVisible}
        onCancel={handleRecordVetModalCancel}
        onOk={() => setRecordVetModalVisible(false)}
        width={1600} // Set the width of the modal
      >
        <h1>Grooming Records</h1>
        {vetGroomRecord.length > 0 ? (
          <Table
            dataSource={vetGroomRecord}
            columns={vetGroomColumns}
            style={{ marginTop: 20 }}
            rowKey={(record, index) => `${record.t3_id}_${index}`}
            scroll={{ x: true }}
          />
        ) : vetRecordError ? (
          <p>Error fetching veterinary record: {vetRecordError.message}</p>
        ) : (
          <p>No veterinary record found.</p>
        )}


      </Modal>
    </>


  );

  return (
    <>
      <DataFetching fetchData={fetchData} setAppointments={setAppointments} />
      {renderTabs()}
      {renderModal()}
    </>
  );
};

export default VeterinaryRecord;
