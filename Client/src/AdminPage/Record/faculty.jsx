import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/navbar';
import { FaUser } from "react-icons/fa";
import axios from 'axios';
import moment from 'moment';

const FacultyRecord = () => {
  const defaultOptions = ['Pending', 'Returned', 'Overdue', 'Approved'];
  const [records, setRecords] = useState([]);
  const [editStatus, setEditStatus] = useState({});

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.post('http://localhost:8081/user/booked');
        if (response.data.status) {
          // Filter only faculty records
          const facultyRecords = response.data.data.filter(record => record.designation.toLowerCase() === 'faculty');
          setRecords(facultyRecords);
        } else {
          console.error("No data found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRecords();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setEditStatus({ ...editStatus, [id]: newStatus });
  };

  const updateStatus = async (id) => {
    try {
      const response = await axios.post('http://localhost:8081/user/update-status', {
        id: id,
        status: editStatus[id]
      });
      if (response.data.status) {
        alert("Status updated successfully!");
        setRecords(records.map(record => record.id === id ? { ...record, status: editStatus[id] } : record));
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusBackgroundColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'not yet claimed':
        return 'bg-yellow-500 text-black';
      case 'overdue':
        return 'bg-red-500 text-white';
      case 'return':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-300 text-black';
    }
  };

  const getFilteredOptions = (currentStatus) => {
    if (currentStatus === 'Approved') {
      return defaultOptions.filter(option => option !== 'Pending');
    }
    return defaultOptions;
  }

  return (
    <>
      <Navbar />
      <div className='w-[100%] h-screen mx-auto'>
        <div className='flex flex-row pt-8 items-center pl-[250px] border-b font-montserrat font-bold text-[25px] p-5 gap-1'>
          <FaUser /><span>Faculty Record</span>
        </div>
        <div className='flex w-[100%] justify-between items-center mt-10 font-montserrat'>
          <table className='mx-auto table-auto w-[90%]'>
            <thead className='font-poppins text-[14px] border-2 bg-[#F2F2F2] py-2 h-10'>
              <tr>
                <th className='border border-r-2 px-[30px] w-[10%] whitespace-nowrap'>No</th>
                <th className='border border-r-2 px-[30px] w-[15%] whitespace-nowrap'>Name</th>
                <th className='border border-r-2 px-[30px] whitespace-nowrap'>Designation</th>
                <th className='border border-r-2 px-[30px] w-[12%] whitespace-nowrap'>Title</th>
                <th className='border border-r-2 px-[30px] w-[15%] whitespace-nowrap'>Author</th>
                <th className='border border-r-2 px-[30px] w-[12%] whitespace-nowrap'>ISBN</th>
                <th className='border border-r-2 px-[30px] w-[17%] whitespace-nowrap'>Booking Date</th>
                <th className='border border-r-2 px-[30px] w-[15%] whitespace-nowrap'>Pick-up Date</th>
                <th className='px-[30px] whitespace-nowrap'>Status</th>
                <th className='px-[30px] whitespace-nowrap'>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((record, index) => (
                  <tr key={record.id} className='text-[14px] text-center'>
                    <td className='border border-r-2 px-[30px] whitespace-nowrap'>{index + 1}</td>
                    <td className='border border-r-2 px-[30px] whitespace-nowrap'>{record.firstname} {record.lastname}</td>
                    <td className='border border-r-2 px-[30px] whitespace-nowrap'>{record.designation}</td>
                    <td className='border border-r-2 px-[30px] whitespace-nowrap'>{record.title}</td>
                    <td className='border border-r-2 px-[30px] whitespace-nowrap'>{record.author}</td>
                    <td className='border border-r-2 px-[30px] whitespace-nowrap'>{record.isbn_issn}</td>
                    <td className='border border-r-2 px-[30px] whitespace-nowrap'>{moment(record.booking_date).format("MMM Do YYYY")}</td>
                    <td className='border border-r-2 px-[30px] whitespace-nowrap'>{moment(record.pickup_date).format("MMM Do YYYY")}</td>
                    <td className='border border-r-2 px-[30px] py-2'>
                      <div className="flex justify-center">
                        <select
                          name="status"
                          id="status"
                          className={`py-2 pl-2 min-w-[150px] w-auto rounded-lg font-montserrat text-md border-2 border-black cursor-pointer appearance-none text-center ${getStatusBackgroundColor(record.status || 'Pending')}`}
                          value={editStatus[record.id] || record.status || 'Pending'}
                          onChange={(e) => handleStatusChange(record.id, e.target.value)}
                        >
                          {getFilteredOptions(editStatus[record.id] || record.status).map((item) => (
                            <option className="text-black bg-white" value={item} key={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className='border border-r-2 items-center whitespace-nowrap'>
                      <div className="flex justify-center items-center gap-2 text-center h-full">
                        {record.status !== 'Returned' && (
                          <span
                            className="border bg-[#003687] text-white rounded-md px-3 text-[15px] cursor-pointer"
                            onClick={() => updateStatus(record.id)}
                          >
                            Submit
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className='text-center py-4'>No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FacultyRecord;
