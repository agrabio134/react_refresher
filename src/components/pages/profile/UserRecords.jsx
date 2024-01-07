import React, { useState, useEffect } from "react";
import { Table } from "antd";

const UserRecords = ({ id }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getVeterinaryRecords();
  }, [id]);

  const getVeterinaryRecords = async () => {
    try {
      const response = await fetch(`https://happypawsolongapo.com/api/get_vet_record_admin/${id}`);
      if (!response.ok) {
        setRecords([]);
        return;
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

        const vetRecordData = jsonObjects.flatMap((json) => {
          try {
            const parsedResult = JSON.parse(json);
            return parsedResult.payload || [];
          } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            return [];
          }
        });

        setRecords(vetRecordData);
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
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
      <h2>User Records</h2>
      {records.length > 0 ? (
        <Table
          dataSource={records}
          columns={columns}
          rowKey={(record) => record.t1_id}
          pagination={true}
        />
      ) : (
        <p>No records found.</p>
      )}
    </div>
  );
};

export default UserRecords;
