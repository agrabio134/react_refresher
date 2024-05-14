import { Modal, Form, Row, Col, DatePicker, Input, Button, Select } from "./Imports";

const { Option } = Select;

const AppointmentVaccinationModal = ({
  modalVisible,
  handleModalCancel,
  form,
  handleSubmit,
  selectedAppointment,
}) => (
  <Modal
    title="Vaccination Details"
    visible={modalVisible}
    onCancel={handleModalCancel}
    footer={null}
    width={800}
  >
    {selectedAppointment && (
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <div className="grid-container">
          <div>
            <h2 className="info-box">CLIENT NAME: {selectedAppointment.fullName}</h2>
            <h2 className="info-box">ADDRESS: {selectedAppointment.address}</h2>
            <h2 className="info-box">PET NAME: {selectedAppointment.petName}</h2>
            <h2 className="info-box">DATE OF BIRTH: {selectedAppointment.dateOfBirth}</h2>
            <h2 className="info-box">CONTACT NO: {selectedAppointment.contactNumber}</h2>
          </div>
        </div>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="pet_id"
              initialValue={selectedAppointment.petId}
              style={{ display: "none" }}
              rules={[{ required: true, message: "Please enter the pet ID" }]}
            >
              <Input type="hidden" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Vaccine Name"
              name="vaccine_name"
              rules={[{ required: true, message: "Please select a vaccine or choose 'Other'" }]}
            >
              <Select placeholder="Select a vaccine">
                <Option value="Rabies">Rabies</Option>
                <Option value="Distemper">Distemper</Option>
                <Option value="Parvovirus">Parvovirus</Option>
                <Option value="Hepatitis">Hepatitis</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Date Administered"
              name="date_administered"
              rules={[{ required: true, message: "Please select the date administered" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Next Due Date"
              name="next_due_date"
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Administered By"
              name="administered_by"
              rules={[{ required: true, message: "Please enter the name of the person who administered the vaccine" }]}
            >
              <Input placeholder="Administered By" />
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

export default AppointmentVaccinationModal;
