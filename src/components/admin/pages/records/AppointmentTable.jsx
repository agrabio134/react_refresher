
const AppointmentTable = ({ dataSource, columns, handleHistoryClick }) => (
  <Table
    dataSource={dataSource}
    columns={columns}
    pagination={false}
    style={{ marginTop: 20 }}
  />
);

export default AppointmentTable;
