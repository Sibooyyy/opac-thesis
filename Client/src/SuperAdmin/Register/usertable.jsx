import { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from "../../Components/navigation";
import { LuDownloadCloud } from "react-icons/lu";
import {  FaEdit, FaCheckCircle } from "react-icons/fa";
import { MdDelete,  } from "react-icons/md";
import { generateRandomPassword } from '../../utils/utils';


const UserTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isPasswordPopupVisible, setIsPasswordPopupVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [isPosting, setIsPosting] = useState(false); 
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [passwordError, setPasswordError] = useState(""); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIdNumber, setDeleteIdNumber] = useState(null);

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

  const handlePasswordResetClick = (user) => {
    setCurrentUser(user);
    setNewPassword("");
    setPasswordError("");
    setIsPasswordPopupVisible(true);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordError("");
  };

  const handleGeneratePasswordClick = () => {
    const generatedPassword = generateRandomPassword();
    setNewPassword(generatedPassword);
    setPasswordError("");
  };

  const handlePasswordResetSubmit = () => {
    if (!newPassword) {
      setPasswordError("Password is required!");
      return;
    }

    setIsPosting(true);
    const passwordToUse = newPassword;

    axios.post('http://localhost:8081/admin/reset-password', {
      id: currentUser.idNumber,
      password: passwordToUse
    })
    .then(response => {
      setIsPosting(false);
      if (response.data.status) {
        setSuccessMessage(`Password reset successfully! New password: ${passwordToUse}`);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          setSuccessMessage('');
          setIsPasswordPopupVisible(false);
        }, 3000);
      } else {
        setError('Failed to reset password');
      }
    })
    .catch(error => {
      setIsPosting(false);
      setError('Error resetting password');
      console.error(error);
    });
  };

  const handleDeleteClick = (idNumber) => {
    setDeleteIdNumber(idNumber);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:8081/account/data/${deleteIdNumber}`)
      .then(response => {
        setData(data.filter(item => item.idNumber !== deleteIdNumber));
        setShowDeleteConfirm(false);
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

  const filteredData = data.filter(user =>
    user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / recordsPerPage)) {
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
    <div className='bg-[#EFF6FC] min-h-screen overflow-y-auto'>
      <Navigation />
      <div className="m-5 w-full sm:w-[90%] mb-10 mt-16 shadow-3xl mx-auto border bg-[#F6FBFD] rounded-md  font-montserrat ">
        <div className="flex justify-between h-[70px] items-center p-5 bg-[#EDF3F7]">
          <h1 className="font-bold text-xl sm:text-2xl text-gray-600">Client List</h1>
          <button className="bg-blue-600 text-white w-[150px] h-8 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm font-semibold hover:bg-blue-700">
            Export Data <LuDownloadCloud />
          </button>
        </div>

        <div className=" w-full sm:w-[30%] mb-3 p-5 mt-3">
        <input
          type="text"
          placeholder="Search a list"
          className="pl-10 pr-2 py-2 border rounded-md w-[60%] focus:outline-none focus:border-blue-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
        <div className='h-[400px]'>
        <table className="w-[95%] mx-auto font-montserrat text-sm sm:text-md cursor-pointer">
          <thead className='text-xs sm:text-sm md:text-md font-semibold h-[45px] text-gray-700'>
            <tr className="border-b-2 border-gray-500">
              <th className="px-10 py-4">No</th>
              <th className="px-10 py-4">First Name</th>
              <th className="px-10 py-4">Last Name</th>
              <th className="hidden sm:table-cell px-4 py-4">ID Number</th>
              <th className="hidden sm:table-cell px-4 py-4">Designation</th>
              <th className="px-10 py-4">Email</th>
              <th className="hidden md:table-cell px-4 py-4">Username</th>
              <th className="px-10 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">Loading...</td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan="8" className="text-center text-red-500 py-4">Error: {error}</td>
              </tr>
            )}
            {!loading && !error && currentRecords.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">No records found</td>
              </tr>
            )}
            {!loading && !error && currentRecords.length > 0 && (
              currentRecords.map((user, index) => (
                <tr key={index} className="text-center hover:bg-gray-200 ">
                  <td className=" px-4 py-2 border-b-2">{indexOfFirstRecord + index + 1}</td>
                  <td className=" px-4 py-2 border-b-2">{user.firstname}</td>
                  <td className=" px-4 py-2 border-b-2">{user.lastname}</td>
                  <td className=" px-4 py-2 border-b-2">{user.idNumber}</td>
                  <td className="px-4 py-2 border-b-2">{user.designation}</td>
                  <td className="px-4 py-2 border-b-2">{user.email}</td>
                  <td className=" px-4 py-2 border-b-2">{user.username}</td>
                  <td className=" px-4 py-2 border-b-2">
                    <div className="flex justify-center gap-2">
                      <button className="bg-blue-500 text-white rounded-md px-3 py-1" title='Reset Password' onClick={() => handlePasswordResetClick(user)}><FaEdit/></button>
                      <button className="bg-red-500 text-white rounded-md px-3 py-1" title='Delete User' onClick={() => handleDeleteClick(user.idNumber)}><MdDelete/></button>
                    </div>
                  </td>
                </tr>
              ))
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
          disabled={currentPage >= Math.ceil(filteredData.length / recordsPerPage)}
          className={`px-3 py-1 text-sm border rounded-r-md ${
            currentPage >= Math.ceil(filteredData.length / recordsPerPage)
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-600 hover:bg-blue-100'
          }`}
        >
          Next
        </button>
      </div>

        

        {isPasswordPopupVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-montserrat">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
              <h2 className="text-lg font-bold mb-4">Reset Password for {currentUser.firstname} {currentUser.lastname}</h2>
              <div className="mb-4">
                <input
                  type="text"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className={`border-2 px-4 py-2 w-full rounded-md ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter new password"
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                )}
              </div>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={handleGeneratePasswordClick}
              >
                Generate Random Password
              </button>
              {isPosting ? (
                <div className="flex space-x-2 justify-center items-center">
                  <span className="sr-only">Loading...</span>
                  <div className="h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-3 w-3 bg-black rounded-full animate-bounce"></div>
                </div>
              ) : (
                <div className="flex justify-center gap-4">
                  <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handlePasswordResetSubmit}>Reset Password</button>
                  <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsPasswordPopupVisible(false)}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-montserrat">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
              <p className="text-gray-700">Are you sure you want to delete this account?</p>
              <div className="mt-4 flex justify-center gap-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmDelete}>Delete</button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={cancelDelete}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-montserrat">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
              <FaCheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-gray-700 mt-3">{successMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default UserTable;
