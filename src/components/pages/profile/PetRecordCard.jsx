import React from "react";
import { Card, Button, Image } from "antd";
import moment from "moment";

const PetRecordCard = ({ record, onViewRecordsClick }) => {
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

  return (
    <Card
      title={record.name}
      style={{ width: 300 }}
      cover={<Image src={record.image} alt="Animal" />}
      actions={[
        <Button
          type="primary"
          onClick={() => onViewRecordsClick(record.id)}
        >
          View Records
        </Button>
      ]}
    >
      <p><strong>Type:</strong> {record.type}</p>
      <p><strong>Breed:</strong> {record.breed}</p>
      <p><strong>Date of Birth / Age:</strong> {moment(record.birthdate).format("MMMM D, YYYY")} / {calculateAge(record.birthdate)} old</p>
    </Card>
  );
};

export default PetRecordCard;
