// ClientDataFetching.js
import { useEffect } from "react";

const API_BASE_URL = "http://localhost/api"; // Replace with your API base URL

export const fetchClients = async () => {
  const response = await fetch(`${API_BASE_URL}/get_clients`);
  if (!response.ok) {
    throw new Error(`Failed to fetch clients: ${response.status}`);
  }

  const jsonData = await response.text();

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

    return clients.filter(Boolean); // Filter out null values
  } catch (splitError) {
    console.error("Error splitting JSON:", splitError);
  }
};

export const ClientDataFetching = ({ setClients }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchClients();
        if (!response.ok) {
          throw new Error(`Failed to fetch clients: ${response.status}`);
        }

        const jsonData = await response.text();

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

          setClients(clients.filter(Boolean)); // Filter out null values
        } catch (splitError) {
          console.error("Error splitting JSON:", splitError);
        }
      } catch (error) {
        console.error("Error fetching client data:", error.message);
        console.error("Full error object:", error);

        // If the error is due to a network failure, we can try again later
        // (assuming the server is running)
        if (error.message.includes("Failed to fetch")) {
          setTimeout(fetchData, 5000);
        }
      }
    };

    fetchData();

    // Fetch client data every 5 seconds
    const interval = setInterval(fetchData, 5000);

    // Stop fetching data when the component unmounts
    return () => clearInterval(interval);
  }, [setClients]);

  return null;
};
