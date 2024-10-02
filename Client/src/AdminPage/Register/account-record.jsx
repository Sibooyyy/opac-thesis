import Navbar from '../../Components/navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FaUser, FaCheckCircle } from "react-icons/fa"; // Importing icons

const AccountRecord = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIdNumber, setDeleteIdNumber] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    axios.get('http://localhost:8081/account/data')
      .then(response => {
        if (response.data.status) {
          setData(response.data.data);
        } else {
          setError(response.data.message);
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDeleteClick = (idNumber) => {
    setDeleteIdNumber(idNumber);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:8081/account/data/${deleteIdNumber}`)
      .then(response => {
        setData(data.filter(item => item.idNumber !== deleteIdNumber));
        setShowDeleteConfirm(false);
        setSuccessMessage('Account deleted successfully!');
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          setSuccessMessage('');
          window.location.reload();
        }, 3000);
      })
      .catch(error => {
        console.error(error);
        setError('Error deleting the account');
      });
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteIdNumber(null);
  };
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);

  const nextPage = () => {
    if (currentPage < Math.ceil(data.length / recordsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Navbar />
      <div className='flex flex-row pt-8 items-center pl-[250px] border-b font-montserrat font-bold text-[25px] p-5 gap-1 bg-white'>
        <FaUser /><span>Account Record</span>
      </div>
      <div className='flex flex-col w-[100%] items-center mt-10 font-montserrat h-screen'>
        <table className='mx-auto table-auto w-[80%]'>
          <thead className='font-poppins text-[14px] border-2 bg-[#F2F2F2] py-2 h-10'>
            <tr>
              <th className='border border-r-2 px-[40px] py-[10px] w-[10%] whitespace-nowrap'>No</th>
              <th className='border border-r-2 px-[40px] py-[10px] w-[15%] whitespace-nowrap'>First Name</th>
              <th className='border border-r-2 px-[40px] py-[10px] whitespace-nowrap'>Last Name</th>
              <th className='border border-r-2 px-[40px] py-[10px] w-[12%] whitespace-nowrap'>ID Number</th>
              <th className='border border-r-2 px-[40px] py-[10px] w-[15%] whitespace-nowrap'>Contact</th>
              <th className='border border-r-2 px-[40px] py-[10px] w-[12%] whitespace-nowrap'>Designation</th>
              <th className='border border-r-2 px-[40px] py-[10px] w-[17%] whitespace-nowrap'>Username</th>
              <th className='px-[40px] py-[10px] whitespace-nowrap'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="8" className='text-center py-[10px] text-gray-500'>
                  Loading...
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan="8" className='text-center text-red-500 py-4 border'>
                  Error: {error}
                </td>
              </tr>
            )}
            {!loading && !error && currentRecords.length === 0 && (
              <tr>
                <td colSpan="8" className='text-center py-[10px] text-gray-500'>
                  No records found
                </td>
              </tr>
            )}
            {!loading && !error && currentRecords.length > 0 && (
              currentRecords.map((item, index) => (
                <tr key={index} className='text-[14px] text-center bg-white'>
                  <td className='border border-r-2 px-[40px] py-[10px] whitespace-nowrap'>{indexOfFirstRecord + index + 1}</td>
                  <td className='border border-r-2 px-[40px] py-[10px] whitespace-nowrap'>{item.firstname}</td>
                  <td className='border border-r-2 px-[40px] py-[10px] whitespace-nowrap'>{item.lastname}</td>
                  <td className='border border-r-2 px-[40px] py-[10px] whitespace-nowrap'>{item.idNumber}</td>
                  <td className='border border-r-2 px-[40px] py-[10px] whitespace-nowrap'>{item.contactNumber}</td>
                  <td className='border border-r-2 px-[40px] py-[10px] whitespace-nowrap'>{item.designation}</td>
                  <td className='border border-r-2 px-[40px] py-[10px] whitespace-nowrap'>{item.username}</td>
                  <td className='px-[40px] py-[10px] border border-r-2'>
                    <div className='flex justify-center'>
                      <button
                        className='border bg-[#CC0000] text-white rounded-md px-3 font-montserrat text-[15px] cursor-pointer'
                        onClick={() => handleDeleteClick(item.idNumber)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className='flex flex-row justify-center mt-5 text-[25px] items-center gap-4'>
          <button
            onClick={previousPage}
            disabled={currentPage === 1 || currentRecords.length === 0}
            className='disabled:opacity-50 cursor-pointer'
          >
            <MdNavigateBefore />
          </button>
          <span className='font-poppins text-[16px]'>{currentPage}</span>
          <button
            onClick={nextPage}
            disabled={currentPage >= Math.ceil(data.length / recordsPerPage) || currentRecords.length === 0}
            className='disabled:opacity-50 cursor-pointer'
          >
            <MdNavigateNext />
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] text-center">
              <p className="text-gray-700">Are you sure you want to delete this account?</p>
              <div className="mt-4 flex justify-center gap-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmDelete}>Delete</button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={cancelDelete}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] text-center">
              <FaCheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-gray-700 mt-3">{successMessage}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AccountRecord;
