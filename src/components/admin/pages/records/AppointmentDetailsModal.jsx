import { Modal, Form, Row, Col, DatePicker, Input, Button   } from "./Imports";


const AppointmentDetailsModal = ({
  
  modalVisible,
  handleModalCancel,
  form,
  handleSubmit,
  selectedAppointment,
  Option,
}) => (

  
    <Modal
    title="Appointment Details"
    visible={modalVisible}
    onCancel={handleModalCancel}
    footer={null}
    width={1000}
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    )}
  </Modal>
);

export default AppointmentDetailsModal;
