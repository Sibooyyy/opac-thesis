import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentRecord from './student-rec'; 
import FacultyRecord from './faculty-rec'; 
import StaffRecord from './staff-rec'
const Records = () => {
  const [designation, setDesignation] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {  
      try {
        const response = await axios.post('http://localhost:8081/user/booked');
        if (response.data.status) {
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
    return <div>Loading...</div>; 
  }

  return (
    <div>
      {designation === 'student' && <StudentRecord />}
      {designation === 'faculty' && <FacultyRecord />}
      {designation === 'staff' && <StaffRecord />}
    </div>
  );
};

export default Records;
