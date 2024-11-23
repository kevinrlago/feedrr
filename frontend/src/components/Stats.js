import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/stats/');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({});
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1>Stats</h1>
      {stats ? (
        <div>
          <p>Total Users: {stats.totalUsers}</p>
          <p>Total Posts: {stats.totalPosts}</p>
          {/* Asegúrate de que las propiedades existan antes de acceder a ellas */}
        </div>
      ) : (
        <p>Loading stats...</p>
      )}
    </div>
  );
};

export default Stats;