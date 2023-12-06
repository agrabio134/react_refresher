import { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Select,
  Row,
  Col,
  Table,
  Modal, // Import Modal from Ant Design
} from "antd";
import moment from "moment";
import "./styles/AdminVetRecords.css";

const { Option } = Select;

const VeterinaryRecord = () => {
  const [form] = Form.useForm();
  const [appointments, setAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // This useEffect will run whenever appointments state changes
    // console.log(appointments);
  }, [appointments]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost/api/get_appointments_admin"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const textData = await response.text();

      // Surround the parsing logic in a try-catch block
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

  const mappedAppointments = appointments.map((appointment) => {
    const status = appointment.status.toLowerCase();
    const startDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    // console.log("user id", appointment.t3_id);
    // console.log("pet id", appointment.t2_id);
    // console.log("appointment id", appointment.t1_id);

    return {
      ...appointment,
      title: `${appointment.fname}'s appointment for ${appointment.name}`,
      start: startDateTime,
      end: endDateTime,
      petId: appointment.t2_id,
      userId: appointment.t3_id,
    };
  });

  const dataSource = mappedAppointments.map((appointment) => {
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
  });

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
    // console.log("Selected user ID:", appointment.userId);
    // console.log("Selected Pet ID:", appointment.petId);

    // Set initial form values based on the selected appointment
    form.setFieldsValue({
      date: moment(), // Set the date to the current date or use appointment.date
      vetOnDuty: "", // Set the default vet name or use appointment.vetOnDuty
      bodyWt: "", // Set the default body weight or use appointment.bodyWt
      temp: "", // Set the default temperature or use appointment.temp
      complaintHistory: "", // Use appointment.complaintHistory if available
      diagnosticTool: "", // Use appointment.diagnosticTool if available
      laboratoryFindings: "", // Use appointment.laboratoryFindings if available
      generalAssessment: "", // Use appointment.generalAssessment if available
      medicationTreatment: "", // Use appointment.medicationTreatment if available
      remarks: "", // Use appointment.remarks if available
      nextFollowupCheckup: moment(), // Set the next follow-up date or use appointment.nextFollowupCheckup
      userId: appointment.userId,
      petId: appointment.petId,
      adminId: "", // Set the default admin ID or leave it empty
    });

    setSelectedAppointment(appointment); // <-- Corrected
    setModalVisible(true);
    // Add your logic here if needed
  };

  const handleModalCancel = () => {
    // Close the modal when the "Cancel" button is clicked
    setModalVisible(false);
    setSelectedAppointment(null);
  };

  const handleSubmit = (values) => {
    console.log("Form submitted:", values);
    // Add logic to handle form submission, e.g., sending data to a server
  };

  return (
    <>
      <h1>Appointments History</h1>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        style={{ marginTop: 20 }}
      />

      <Modal
        title="Appointment Details"
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={800} // Set the width according to your preference
      >
        {selectedAppointment && (
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <div className="grid-container">
              <div>
                <h2 className="info-box">
                  CLIENT NAME: {selectedAppointment.fullName}
                </h2>
                <h2 className="info-box">
                  ADDRESS: {selectedAppointment.address}
                </h2>
                <h2 className="info-box">
                  PETNAME: {selectedAppointment.petName}
                </h2>
                <h2 className="info-box">
                  DATE OF BIRTH: {selectedAppointment.dateOfBirth}
                </h2>
              </div>
              <div>
                <h2 className="info-box">
                  CONTACT NO: {selectedAppointment.contactNumber}
                </h2>
                <h2 className="info-box">
                  BREED: {selectedAppointment.petBreed}
                </h2>
                <h2 className="info-box">SEX: {selectedAppointment.petSex}</h2>
              </div>
            </div>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Date"
                  name="date"
                  rules={[{ required: true, message: "Please select a date" }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Vet on Duty"
                  name="vetOnDuty"
                  rules={[
                    { required: true, message: "Please enter the vet on duty" },
                  ]}
                >
                  <Input placeholder="Vet Name" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Body Weight" name="bodyWt">
                  <Input type="number" placeholder="in kg" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Temperature" name="temp">
                  <Input type="number" placeholder="in °C" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Complaint/History" name="complaintHistory">
                  <Input.TextArea />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Diagnostic Tool" name="diagnosticTool">
                  <Input.TextArea />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Laboratory Findings"
                  name="laboratoryFindings"
                >
                  <Input.TextArea />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="General Assessment" name="generalAssessment">
                  <Input.TextArea />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Medication/Treatment"
                  name="medicationTreatment"
                >
                  <Input.TextArea />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Remarks" name="remarks">
                  <Input.TextArea />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Next Followup Checkup"
                  name="nextFollowupCheckup"
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="User ID"
                  name="userId"
                  style={{ display: "none" }}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Pet ID"
                  name="petId"
                  style={{ display: "none" }}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Admin ID"
                  name="adminId"
                  style={{ display: "none" }}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>

            {/* Submit Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default VeterinaryRecord;
