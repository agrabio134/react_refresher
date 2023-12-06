// DataFetching.js
import { useEffect } from "react";

const DataFetching = ({ fetchData, setAppointments }) => {
  useEffect(() => {
    fetchData();
  }, []);

  return null;
};

export default DataFetching;
