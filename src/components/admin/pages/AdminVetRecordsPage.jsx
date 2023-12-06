import React, { useState, useEffect } from "react";
import DataFetching from "./records/DataFetching";
// import AppointmentTable from "./records/AppointmentTable";
import AppointmentDetailsModal from "./records/AppointmentDetailsModal";
import { ClientDataFetching } from "./records/ClientDataFetching";

import { Form, Button, Tabs, Option, Table } from "./records/Imports";
import moment from "moment";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";

const { TabPane } = Tabs;

const VeterinaryRecord = () => {
  const [form] = Form.useForm();
  const [appointments, setAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [clients, setClients] = useState([]);

  const fetchClientData = async () => {
    try {
      const clients = await fetch("http://localhost/api/get_clients");

      const jsonData = await clients.text();

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

        const clients = jsonObjects.flatMap((json, index) => {
          try {
            const parsedResult = JSON.parse(json);
            return parsedResult.payload || { key: index }; // Add a unique key property
          } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            return null;
          }
        });
        console.log(clients);
        setClients(clients);
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
        "http://localhost/api/get_done_appointments_admin"
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

        const appointments = jsonObjects.flatMap((json) => {
          try {
            const parsedResult = JSON.parse(json);
            return parsedResult.payload || [];
          } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            return [];
          }
        });

        setAppointments(appointments);
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
    // add button
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  const mappedAppointments = appointments.map(mapAppointmentData);

  const mapDataSource = (appointment) => {
    const isAM = moment(appointment.start).format("A") === "AM";

    return {
      key: appointment.t1_id,
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
        <Button type="primary" onClick={() => handleHistoryClick(record)}>
          Details
        </Button>
      ),
    },
  ];

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
    setSelectedAppointment(null);
  };

  const adminAuthToken = localStorage.getItem("adminAuthToken");
  const decodedAdminToken = jwt_decode(adminAuthToken);
  const adminId = decodedAdminToken.user_id;

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
            "http://localhost/api/submit_vet_record_admin",
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

          Swal.fire("Submitted!", "Your file has been submitted.", "success");
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
        />
      </TabPane>
      <TabPane tab="Client Records" key="2">
        <h1>Client Records</h1>
        <Table
          dataSource={clients}
          columns={ClientsColumns}
          pagination={false}
          style={{ marginTop: 20 }}
          rowKey={(record) => record.key} // Ensure each row has a unique key
        />
      </TabPane>
    </Tabs>
  );

  const renderModal = () => (
    <AppointmentDetailsModal
      modalVisible={modalVisible}
      handleModalCancel={handleModalCancel}
      form={form}
      handleSubmit={handleSubmit}
      selectedAppointment={selectedAppointment}
      Option={Option}
    />
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
