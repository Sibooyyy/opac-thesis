import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaCheckCircle, FaUser } from "react-icons/fa";
import { MdDelete, MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import Navbar from '../../Components/navbar';
import { generateRandomPassword } from '../../utils/utils';

const AccountRecord = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
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
      <Navbar />
      <div className='flex flex-row pt-8 items-center pl-[250px] border-b font-montserrat font-bold text-[25px] p-5 gap-1 bg-white'>
        <FaUser /><span>Account Record</span>
      </div>
      <div className='flex flex-col items-center mt-5 w-full '>
        <div className='flex justify-between items-center w-[80%] mb-3'>
          <div className='flex flex-row items-center gap-3 font-montserrat'>
            <span>Search By</span>
            <input 
              type="text" 
              className='pl-10 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400' 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        <table className='mx-auto table-auto w-[80%] font-montserrat'>
          <thead className='font-poppins text-[14px] border-2 bg-[#F2F2F2] py-2 h-10 '>
            <tr>
              <th className='border border-r-2 px-[40px] py-[10px] w-[5%] whitespace-nowrap'>No</th>
              <th className='border border-r-2 px-[40px] py-[10px] w-[10%] whitespace-nowrap'>First Name</th>
              <th className='border border-r-2 px-[40px] py-[10px] w-[10%] whitespace-nowrap'>Last Name</th>
              <th className='border border-r-2 px-[40px] py-[10px] w-[10%] whitespace-nowrap'>ID Number</th>
              <th className='border border-r-2 px-[40px] py-[10px] w-[10%] whitespace-nowrap'>Email</th>
              <th className='border border-r-2 px-[40px] py-[10px] w-[10%] whitespace-nowrap'>Username</th>
              <th className='border border-r-2 px-[40px] py-[10px] w-[10%] whitespace-nowrap'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className='text-center py-[10px] text-gray-500'>
                  Loading...
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan="7" className='text-center text-red-500 py-4 border'>
                  Error: {error}
                </td>
              </tr>
            )}
            {!loading && !error && currentRecords.length === 0 && (
              <tr>
                <td colSpan="7" className='text-center py-[10px] text-gray-500'>
                  No records found
                </td>
              </tr>
            )}
            {!loading && !error && currentRecords.length > 0 && (
              currentRecords.map((user, index) => (
                <tr key={index} className='text-[14px] text-center bg-white'>
                  <td className='border border-r-2 px-[40px] py-[10px]'>{indexOfFirstRecord + index + 1}</td>
                  <td className='border border-r-2 px-[40px] py-[10px] '>{user.firstname}</td>
                  <td className='border border-r-2 px-[40px] py-[10px] '>{user.lastname}</td>
                  <td className='border border-r-2 px-[40px] py-[10px] '>{user.idNumber}</td>
                  <td className='border border-r-2 px-[40px] py-[10px]'>{user.email}</td>
                  <td className='border border-r-2 px-[40px] py-[10px]'>{user.username}</td>
                  <td className='border border-r-2 px-[40px] py-[10px]'>
                    <div className='flex justify-center gap-2'>
                      <button
                        className='bg-blue-500 text-white rounded-md px-3 py-1 font-montserrat text-[14px] hover:bg-blue-700' title='Reset Password'
                        onClick={() => handlePasswordResetClick(user)}
                      >
                        <FaEdit /> 
                      </button>
                      <button
                        className='bg-red-500 text-white rounded-md px-3 py-1 font-montserrat text-[15px] hover:bg-red-700' title='Delete Account'
                        onClick={() => handleDeleteClick(user.idNumber)}
                      >
                        <MdDelete /> 
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
            disabled={currentPage >= Math.ceil(filteredData.length / recordsPerPage) || currentRecords.length === 0}
            className='disabled:opacity-50 cursor-pointer'
          >
            <MdNavigateNext />
          </button>
        </div>

        {isPasswordPopupVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-montserrat">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] text-center">
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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-montserrat ">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] text-center">
              <p className="text-gray-700">Are you sure you want to delete this account?</p>
              <div className="mt-4 flex justify-center gap-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmDelete}>Delete</button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={cancelDelete}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-montserrat">
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
