import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/alerts/');
        // Asegúrate de que response.data sea un array
        if (Array.isArray(response.data)) {
          setAlerts(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
          setAlerts([]);
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
        setAlerts([]);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div>
      <h1>Alerts</h1>
      {Array.isArray(alerts) && alerts.length > 0 ? (
        alerts.map((alert) => (
          <div key={alert.id}>{alert.message}</div>
        ))
      ) : (
        <p>No alerts available</p>
      )}
    </div>
  );
};

export default Alerts;