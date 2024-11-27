import Navigation from "../../Components/navs";
import { LuDownloadCloud } from "react-icons/lu";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import * as XLSX from 'xlsx';

function StaffRec() {
    const defaultOptions = ['Pending', 'Returned', 'Approved', 'Overdue'];
    const [records, setRecords] = useState([]);
    const [editStatus, setEditStatus] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState(''); // State for status filter
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  
    const filteredRecords = records.filter(record => (
      (record.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.isbn_issn.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === '' || record.status === statusFilter) // Apply status filter
    ));
  
    const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  
    useEffect(() => {
      const fetchRecords = async () => {
        try {
          const response = await axios.post('http://localhost:8081/user/booked');
          if (response.data.status) {
            const studentRecords = response.data.data.filter(record => record.designation.toLowerCase() === 'staff');
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
          setTimeout(() => setShowSuccessMessage(false), 3000);
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
        <div className='bg-[#EFF6FC] min-h-screen overflow-y-auto'>
          <Navigation />
          <div className="m-5 w-full sm:w-[95%] mt-16 shadow-3xl mx-auto border bg-[#F6FBFD] rounded-md font-montserrat">
            <div className="flex justify-between h-[70px] items-center p-5 bg-[#292A84]">
              <h1 className="font-bold text-xl sm:text-2xl text-white">Staff Borrowing List</h1>
              <button 
                onClick={exportToExcel}
                className="bg-blue-600 text-white w-[150px] h-8 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm font-semibold hover:bg-blue-700"
              >
                Export Data <LuDownloadCloud />
              </button>
            </div>
            <div className="flex justify-between">
              <div className="w-full sm:w-[30%] mb-3 p-5 mt-3">
                <input
                  type="text"
                  placeholder="Search a list"
                  className="pl-10 pr-2 py-2 border rounded-md w-[60%] focus:outline-none focus:border-blue-500"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-row items-center mr-10 gap-3">
                <h1>Filter by</h1>
                <select
                  className="border rounded-md p-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  {defaultOptions.map((option) => (
                    <option value={option} key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
  
            {showSuccessMessage && (
              <div className="fixed top-10 right-10 bg-green-500 text-white p-3 rounded-md shadow-md">
                Status updated successfully!
              </div>
            )}
  
            <div className='h-[400px]'>
              <table className="w-[95%] mx-auto table-auto font-montserrat text-sm sm:text-md cursor-pointer">
                <thead className="text-xs sm:text-sm md:text-md font-semibold h-[45px] text-gray-700">
                  <tr className="border-b-2 border-gray-500">
                    <th className="px-10 py-4">No</th>
                    <th className="px-10 py-4">Name</th>
                    <th className="px-10 py-4">Designation</th>
                    <th className="px-10 py-4">Title</th>
                    <th className="px-10 py-4">Category</th>
                    <th className="px-10 py-4">Author</th>
                    <th className="hidden sm:table-cell px-4 py-4">Booking Date</th>
                    <th className="hidden sm:table-cell px-4 py-4">Pick-Up Date</th>
                    <th className="px-10 py-4">Status</th>
                    <th className="px-10 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.length > 0 ? (
                    currentRecords.map((record, index) => (
                      <tr key={record.id} className='text-center hover:bg-gray-200'>
                        <td className='px-4 py-2 border-b-2'>{indexOfFirstRecord + index + 1}</td>
                        <td className='border-b-2 px-4 py-2 whitespace-nowrap'>{record.firstname} {record.lastname}</td>
                        <td className='border-b-2 px-4 py-2 whitespace-nowrap'>{record.designation}</td>
                        <td className='border-b-2 px-4 py-2 whitespace-nowrap'>{record.title}</td>
                        <td className='border-b-2 px-4 py-2 whitespace-nowrap'>{record.author}</td>
                        <td className='border-b-2 px-4 py-2 whitespace-nowrap'>{record.isbn_issn}</td>
                        <td className='border-b-2 px-4 py-2 whitespace-nowrap'>{moment(record.pickup_date).format("MMM Do YYYY")}</td>
                        <td className='border-b-2 px-4 py-2 whitespace-nowrap'>{moment(record.estimated_date).format("MMM Do YYYY")}</td>
                        <td className='border-b-2 px-4 py-2 whitespace-nowrap'>
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
                        <td className='border-b-2 px-4 py-2 whitespace-nowrap items-center'>
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
            </div>
  
            <div className="flex justify-end mt-16 mb-12 items-center gap-1 pr-10">
              <button
                onClick={previousPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm border rounded-l-md text-bold${
                  currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'
                }`}
              >
                Previous
              </button>
              
              <span
                className="px-3 py-1 text-sm border-t border-b border-blue-600 text-white bg-blue-500 font-semibold"
                style={{ borderRadius: '4px' }}
              >
                {currentPage}
              </span>
  
              <button
                onClick={nextPage}
                disabled={currentPage >= Math.ceil(filteredRecords.length / recordsPerPage)}
                className={`px-3 py-1 text-sm border rounded-r-md ${
                  currentPage >= Math.ceil(filteredRecords.length / recordsPerPage)
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-100'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
export default StaffRec





