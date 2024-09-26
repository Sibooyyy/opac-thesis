import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentRecord from './student-rec'; // Adjust the import path as needed
import FacultyRecord from './faculty'; // Adjust the import path as needed

const Records = () => {
  const [designation, setDesignation] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.post('http://localhost:8081/user/booked');
        if (response.data.status) {
          // Assuming that the first record will give the current user's designation
          const userDesignation = response.data.data.length > 0 ? response.data.data[0].designation.toLowerCase() : '';
          setDesignation(userDesignation);
        } else {
          console.error("No data found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRecords();
  }, []);

  if (!designation) {
    return <div>Loading...</div>; // or any loading indicator
  }

  return (
    <div>
      {designation === 'student' && <StudentRecord />}
      {designation === 'faculty' && <FacultyRecord />}
    </div>
  );
};

export default Records;
