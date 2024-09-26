import { AuthContext } from "../App";
import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import moment from "moment";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

function ViewProfile() {
    const { user, updateUser } = useContext(AuthContext);  
    const [records, setRecords] = useState([]);
    const [borrowHistory, setBorrowHistory] = useState([]);
    const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(true);
    const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(true);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
    const [isBorrowHistoryModalOpen, setIsBorrowHistoryModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [editFormData, setEditFormData] = useState({
        firstname: user.firstname,
        lastname: user.lastname,
        contactNumber: user.contactNumber,
        designation: user.designation
    });
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState('');
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    useEffect(() => {
        const fetchRecords = async () => {
            if (!user) {
                setRecords([]);
                setBorrowHistory([]);
                return;
            }
            try {
                const response = await axios.post('http://localhost:8081/user/booked', {
                    idNumber: user.idNumber,
                });
                if (response.data.status) {
                    const allRecords = response.data.data;
                    const currentRecords = allRecords.filter(record => record.status.toLowerCase() !== 'returned');
                    const returnedRecords = allRecords.filter(record => record.status.toLowerCase() === 'returned');
                    
                    setRecords(currentRecords);
                    setBorrowHistory(returnedRecords);
                } else {
                    console.error("No data found");
                    setRecords([]); 
                    setBorrowHistory([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setRecords([]); 
                setBorrowHistory([]);
            }
        };
        fetchRecords();
    }, [user]);

    const toggleAccountInfo = () => {
        setIsAccountInfoOpen(!isAccountInfoOpen);
    };

    const togglePersonalInfo = () => {
        setIsPersonalInfoOpen(!isPersonalInfoOpen);
    };

    const openChangePasswordModal = () => {
        setIsChangePasswordModalOpen(true);
    };

    const closeChangePasswordModal = () => {
        setIsChangePasswordModalOpen(false);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setPasswordSuccess('');
    };

    const toggleNewPasswordVisibility = () => {
        setIsNewPasswordVisible(!isNewPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const handlePasswordChange = async () => {  
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:8081/user/update/password', {
                id: user.id,
                password: newPassword,
            });

            if (response.data.status) {
                setPasswordSuccess("Password updated successfully!");
                setTimeout(() => {
                    closeChangePasswordModal();
                }, 2000);
            } else {
                setPasswordError("Failed to update password. Please try again.");
            }
        } catch (error) {
            setPasswordError("Error updating password. Please try again.");
        }
    };

    const openEditInfoModal = () => {
        setEditFormData({
            firstname: user.firstname,
            lastname: user.lastname,
            contactNumber: user.contactNumber,
            designation: user.designation
        });
        setEditError('');
        setEditSuccess('');
        setIsEditInfoModalOpen(true);
    };

    const closeEditInfoModal = () => {
        setIsEditInfoModalOpen(false);
        setEditError('');
        setEditSuccess('');
    };

    const handleEditInfoChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleEditInfoSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8081/user/update/details', {
                id: user.id,
                ...editFormData,
            });

            if (response.data.status) {
                const updatedUser = { ...user, ...editFormData };
                updateUser(updatedUser);
                setEditSuccess("Information updated successfully!");
                setTimeout(() => {
                    closeEditInfoModal();
                }, 2000);
            } else {
                setEditError("Failed to update information. Please try again.");
            }
        } catch (error) {
            setEditError("Error updating information. Please try again.");
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-green-500 text-white'; 
            case 'not yet claimed':
                return 'bg-yellow-500 text-black'; 
            case 'overdue':
                return 'bg-red-500 text-white'; 
            case 'returned':
                return 'bg-blue-500 text-white'; 
            default:
                return 'bg-gray-300 text-black'; 
        }
    };

    const openBorrowHistoryModal = () => {
        setIsBorrowHistoryModalOpen(true);
    };

    const closeBorrowHistoryModal = () => {
        setIsBorrowHistoryModalOpen(false);
    };

    return (
        <div className='w-[100%] h-full p-[30px] bg-[#0CA1E2] flex flex-col items-center font-poppins gap-5'>
            <h1 className='text-white text-[30px] font-bold mb-4'>My Profile</h1>
            {/* Account Information Section */}
            <div className="w-full bg-white rounded-lg shadow-lg mb-5">
                <div
                    className="bg-[#161D6F] text-white px-5 py-3 flex justify-between items-center cursor-pointer"
                    onClick={toggleAccountInfo}
                >
                    <h2 className="font-montserrat text-md font-semibold">ACCOUNT INFORMATION</h2>
                    <span>{isAccountInfoOpen ? '−' : '+'}</span>
                </div>
                {isAccountInfoOpen && (
                    <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="font-montserrat text-md font-semibold">Username</label>
                                <input
                                    type="text"
                                    value={user.username}
                                    readOnly
                                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>
                        </div>
                        <div className="mt-4"> 
                            <p className="text-blue-500 cursor-pointer font-montserrat text-md font-semibold" onClick={openChangePasswordModal}>Change Password</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Personal Information Section */}
            <div className="w-full bg-white rounded-lg shadow-lg mb-5">
                <div
                    className="bg-[#161D6F] text-white px-5 py-3 flex justify-between items-center cursor-pointer"
                    onClick={togglePersonalInfo}
                >
                    <h2 className="font-montserrat text-md font-semibold">PERSONAL INFORMATION</h2>
                    <span>{isPersonalInfoOpen ? '−' : '+'}</span>
                </div>
                {isPersonalInfoOpen && (
                    <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="font-montserrat text-md font-semibold">First Name *</label>
                                <input
                                    type="text"
                                    value={user.firstname}
                                    readOnly
                                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>
                            <div>
                                <label className="font-montserrat text-md font-semibold">Designation</label>
                                <input
                                    type="text"
                                    value={user.designation || ''}
                                    readOnly
                                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>
                            <div>
                                <label className="font-montserrat text-md font-semibold">Last Name *</label>
                                <input
                                    type="text"
                                    value={user.lastname}
                                    readOnly
                                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>
                            <div>
                                <label className="font-montserrat text-md font-semibold">ID Number</label>
                                <input
                                    type="text"
                                    value={user.idNumber || ''}
                                    readOnly
                                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>
                            <div>
                                <label className="font-montserrat text-md font-semibold">Contact No.</label>
                                <input
                                    type="text"
                                    value={user.contactNumber}
                                    readOnly
                                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <button
                                    className="text-blue-500 cursor-pointer font-montserrat text-md font-semibold"
                                    onClick={openEditInfoModal}
                                >
                                    Edit Information
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Open Borrow History Modal Button */}
            <div className="w-full flex flex-col gap-2">
                <div className="flex justify-end">
                    <span
                        className="px-4 py-2 font-montserrat text-md font-semibold cursor-pointer text-white rounded-lg"
                        onClick={openBorrowHistoryModal}
                    >
                        View Borrow History
                    </span>
                </div>
                <div className='w-full'>
                    {records.length > 0 ? (
                        <table className='min-w-full bg-white rounded-lg overflow-hidden shadow-lg text-center mt-2'>
                            <thead className='bg-[#161D6F] text-white font-montserrat text-md font-semibold'>
                                <tr>
                                    <th className='py-3 px-5'>Title</th>
                                    <th className='py-3 px-5'>Author</th>
                                    <th className='py-3 px-5'>Pick-Up Date</th>
                                    <th className='py-3 px-5'>Booking Date</th>
                                    <th className='py-3 px-5'>ISBN/ISSN</th>
                                    <th className='py-3 px-5'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record, index) => (
                                    <tr key={index} className='border-b text-center my-3'>
                                        <td className='py-2 px-5'>{record.title}</td>
                                        <td className='py-2 px-5'>{record.author}</td>
                                        <td className='py-2 px-5'>{moment(record.pickup_date).format("MMM Do YYYY")}</td>
                                        <td className='py-2 px-5'>{moment(record.booking_date).format("MMM Do YYYY")}</td>
                                        <td className='py-2 px-5'>{record.isbn_issn}</td>
                                        <td className='py-2 px-5 flex justify-center'>
                                            <div className={`px-3 py-1 w-[120px] text-center rounded-lg ${getStatusColor(record.status)}`}>
                                                {record.status}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-white">No Current Reserve.</p>
                    )}
                </div>
            </div>

            {/* Borrow History Modal */}
            {isBorrowHistoryModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[60%] max-h-[80%] overflow-y-auto relative">
                    <h2 className="font-montserrat text-lg font-semibold mb-4">Borrow History</h2>
                    <button
                        className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white rounded-lg"
                        onClick={closeBorrowHistoryModal}
                    >
                        Close
                    </button>
                    {borrowHistory.length > 0 ? (
                        <table className='min-w-full bg-white rounded-lg overflow-hidden shadow-lg text-center'>
                            <thead className='bg-[#161D6F] text-white font-montserrat text-md font-semibold'>
                                <tr>
                                    <th className='py-3 px-5'>No</th>
                                    <th className='py-3 px-5'>Title</th>
                                    <th className='py-3 px-5'>Author</th>
                                    <th className='py-3 px-5'>Pick-Up Date</th>
                                    <th className='py-3 px-5'>Booking Date</th>
                                    <th className='py-3 px-5'>ISBN/ISSN</th>
                                    <th className='py-3 px-5'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowHistory.map((record, index) => (
                                    <tr key={index} className='border-b text-center my-3'>
                                        <td className='py-2 px-5'>{index + 1}</td>
                                        <td className='py-2 px-5'>{record.title}</td>
                                        <td className='py-2 px-5'>{record.author}</td>
                                        <td className='py-2 px-5'>{moment(record.pickup_date).format("MMM Do YYYY")}</td>
                                        <td className='py-2 px-5'>{moment(record.booking_date).format("MMM Do YYYY")}</td>
                                        <td className='py-2 px-5'>{record.isbn_issn}</td>
                                        <td className='py-2 px-5 flex justify-center'>
                                            <div className={`px-3 py-1 w-[120px] text-center rounded-lg ${getStatusColor(record.status)}`}>
                                                {record.status}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center">No borrow history available.</p>
                    )}
                </div>
            </div>
        )}
            {/* Change Password Modal */}
            {isChangePasswordModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[40%]">
                        <h2 className="font-montserrat text-md font-semibold mb-4">Change Password</h2>
                        <div className="relative">
                            <label className="font-montserrat text-md font-semibold">New Password</label>
                            <input
                                type={isNewPasswordVisible ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                            />
                            <div
                                    className="absolute right-3 top-10 cursor-pointer"
                                    onClick={toggleNewPasswordVisibility}
                                >
                                    {isNewPasswordVisible ? (
                                        <FaEyeSlash className="text-gray-600" />
                                    ) : (
                                        <FaEye className="text-gray-600" />
                                    )}
                            </div>
                            </div>
                        <div className="mt-4 relative">
                            <label className="font-montserrat text-md font-semibold">Confirm Password</label>
                            <input
                                type={isConfirmPasswordVisible ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                            />
                            <div
                                className="absolute right-3 top-10 cursor-pointer"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {isConfirmPasswordVisible ? (
                                    <FaEyeSlash className="text-gray-600" />
                                ) : (
                                    <FaEye className="text-gray-600" />
                                )}
                            </div>
                        </div>
                        {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
                        {passwordSuccess && <p className="text-green-500 mt-2">{passwordSuccess}</p>}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={closeChangePasswordModal}
                                className="mr-2 px-4 py-2 bg-gray-400 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordChange}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Information Modal */}
            {isEditInfoModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[40%]">
                        <h2 className="font-montserrat text-md font-semibold mb-4">Edit Personal Information</h2>
                        <div>
                            <label className="font-montserrat text-md font-semibold">First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                value={editFormData.firstname}
                                onChange={handleEditInfoChange}
                                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="font-montserrat text-md font-semibold">Last Name</label>
                            <input
                                type="text"
                                name="lastname"
                                value={editFormData.lastname}
                                onChange={handleEditInfoChange}
                                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="font-montserrat text-md font-semibold">Contact No.</label>
                            <input
                                type="text"
                                name="contactNumber"
                                value={editFormData.contactNumber}
                                onChange={handleEditInfoChange}
                                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                            />
                        </div>
                        {editError && <p className="text-red-500 mt-2">{editError}</p>}
                        {editSuccess && <p className="text-green-500 mt-2">{editSuccess}</p>}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={closeEditInfoModal}
                                className="mr-2 px-4 py-2 bg-gray-400 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditInfoSubmit}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewProfile;
