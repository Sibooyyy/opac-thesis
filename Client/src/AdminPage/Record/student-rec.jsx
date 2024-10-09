import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/navbar';
import { FaUser } from "react-icons/fa";
import axios from 'axios';
import moment from 'moment';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import * as XLSX from 'xlsx'; 


const StudentRecord = () => {
  const defaultOptions = ['Pending', 'Returned', 'Approved'];
  const [records, setRecords] = useState([]);
  const [editStatus, setEditStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // New state for success message

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const filteredRecords = records.filter(record => 
    record.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.isbn_issn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.post('http://localhost:8081/user/booked');
        if (response.data.status) {
          const studentRecords = response.data.data.filter(record => record.designation.toLowerCase() === 'student');
          setRecords(studentRecords);
        } else {
          console.log("No data found");
        }
      } catch (error) {
        console.log("Error fetching data:", error);
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
        setShowSuccessMessage(true); 
        setTimeout(() => setShowSuccessMessage(false)
        , 3000);
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
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredRecords.length / recordsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const exportToExcel = () => {
    const returnedRecords = records.filter(record => record.status === 'Returned');
    const data = returnedRecords.map(record => ({
      No: records.indexOf(record) + 1,
      Name: `${record.firstname} ${record.lastname}`,
      Designation: record.designation,
      Title: record.title,
      Author: record.author,
      ISBN: record.isbn_issn,
      BookingDate: moment(record.booking_date).format("MMM Do YYYY"),
      PickupDate: moment(record.pickup_date).format("MMM Do YYYY"),
      Status: record.status
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StudentRecords");

    XLSX.writeFile(workbook, "StudentDataRecord.xlsx");
  };

  return (
    <>
      <Navbar />
      <div className='flex flex-row pt-8 items-center justify-start pl-[250px] border-b font-montserrat font-bold text-[25px] p-5 gap-1 bg-white'>
        <FaUser /><span>Student Record</span>
      </div>
      <div className='flex justify-between w-[80%] mx-auto mt-5 mb-3  font-montserrat'>
        <div className='flex flex-row items-center gap-3'>
          <span>Search By</span>
          <div>
            <input 
              type="text" 
              className='pl-10 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400' 
              placeholder="Search..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>
        <div>
          <button 
            className='bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer' 
            onClick={exportToExcel}>
            Export Student Record
          </button>
        </div>
      </div>
      {showSuccessMessage && (
        <div className="fixed top-10 right-10 bg-green-500 text-white p-3 rounded-md shadow-md">
          Status updated successfully!
        </div>
      )}

      <div className='flex flex-col w-[80%] mx-auto items-center mt-10 font-montserrat'>
        <table className='mx-auto table-auto w-full'>
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
              <th className='border border-r-2 px-[30px] whitespace-nowrap'>Status</th>
              <th className='px-[30px] whitespace-nowrap'>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((record, index) => (
                <tr key={record.id} className='text-[14px] text-center bg-white'>
                  <td className='border border-r-2 px-2 py-1 whitespace-nowrap'>{indexOfFirstRecord + index + 1}</td>
                  <td className='border border-r-2 px-2 py-1 whitespace-nowrap'>{record.firstname} {record.lastname}</td>
                  <td className='border border-r-2 px-2 py-1 whitespace-nowrap'>{record.designation}</td>
                  <td className='border border-r-2 px-2 py-1 whitespace-nowrap'>{record.title}</td>
                  <td className='border border-r-2 px-2 py-1 whitespace-nowrap'>{record.author}</td>
                  <td className='border border-r-2 px-2 py-1 whitespace-nowrap'>{record.isbn_issn}</td>
                  <td className='border border-r-2 px-2 py-1 whitespace-nowrap'>{moment(record.booking_date).format("MMM Do YYYY")}</td>
                  <td className='border border-r-2 px-2 py-1 whitespace-nowrap'>{moment(record.pickup_date).format("MMM Do YYYY")}</td>
                  <td className='border border-r-2 px-2 py-1 whitespace-nowrap'>
                    <select
                      name="status"
                      id="status"
                      className={`py-1 px-1 min-w-[150px] rounded-lg text-md border-2 text-center ${getStatusBackgroundColor(record.status || 'Pending')}`}
                      value={editStatus[record.id] || record.status || 'Pending'}
                      onChange={(e) => handleStatusChange(record.id, e.target.value)}
                    >
                      {getFilteredOptions(editStatus[record.id] || record.status).map((item) => (
                        <option className="text-black bg-white" value={item} key={item}>{item}</option>
                      ))}
                    </select>
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
                <td colSpan="10" className='text-center py-4 border text-red-500'>No records found</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className='flex flex-row justify-center mt-5 text-[25px] items-start gap-4'>
          <button
            onClick={previousPage}
            disabled={currentPage === 1}
            className='disabled:opacity-50 cursor-pointer'
          >
            <MdNavigateBefore />
          </button>
          <span className='font-poppins text-[18px]'>{currentPage}</span>
          <button
            onClick={nextPage}
            disabled={currentPage >= Math.ceil(filteredRecords.length / recordsPerPage)}
            className='disabled:opacity-50 cursor-pointer'
          >
            <MdNavigateNext />
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentRecord;
