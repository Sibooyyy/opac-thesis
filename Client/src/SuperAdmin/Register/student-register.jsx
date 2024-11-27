import Header from '../../Components/navigation';
import candaleria from '../../assets/candaleria.png';
import { useState } from 'react';
import { FaEyeSlash, FaEye, FaCheckCircle } from "react-icons/fa"; // Import the checkmark icon for success message
import { registrationForm } from '../../utils/utils';
import axios from 'axios';

const StudentRegister = () => {
  const designationOptions = ['Faculty', 'Student', 'Staff'];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [formData, setFormData] = useState(registrationForm());
  const [loading, setLoading] = useState(false);
  const [successPopUp, setSuccessPopUp] = useState(false);
  const [error, setError] = useState('');

  const handleToggleShowPassword = () => setShowPassword(!showPassword);
  const handleToggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleErrorTimeout = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstname || !formData.lastname || !formData.idNumber || !formData.contactNumber || !formData.username || !formData.password || !formData.confirm_password || !formData.designation || !formData.email) {
      handleErrorTimeout('All fields are required.');
      return;
    }

    if (isNaN(formData.idNumber)) {
      handleErrorTimeout('ID Number must be numeric.');
      return;
    }

    if (isNaN(formData.contactNumber) || formData.contactNumber.length !== 11) {
      handleErrorTimeout('Contact Number must be numeric and exactly 11 digits.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      handleErrorTimeout('Passwords do not match');
      return;
    }
    if (!formData.email.includes('@')) {
      handleErrorTimeout('Email must contain @.');
      return;
    }

    const emailDomain = formData.email.split('@')[1];
    if (emailDomain !== 'gmail.com' && emailDomain !== 'yahoo.com') {
      handleErrorTimeout('Email must be either @gmail.com or @yahoo.com.');
      return;
    }

    if (formData.designation === 'Faculty' && !formData.department) {
      handleErrorTimeout('Department is required for Faculty.');
      return;
    }

    setLoading(true);
    const url = 'http://localhost:8081/auth/register';
    axios.post(url, formData).then((res) => {
      const { status, message } = res.data;
      if (status) {
        setSuccessPopUp(true);
        setLoading(false);
        console.log(message);
        setTimeout(() => {
          setSuccessPopUp(false);
          setFormData(registrationForm());
        }, 3000);
      } else {
        setError(message);
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    }).catch(error => {
      console.log(error);
      setError('Registration failed. Please try again.');
    });
  };

  return (
    <>
      <div className='bg-[#EFF6FC] min-h-screen'>
        <Header />
        <div className='flex flex-row justify-center items-start border border-gray-200 rounded-lg shadow-3xl w-full max-w-[1200px] mx-auto my-[70px] p-8 bg-white'>
          <div className='flex flex-col justify-center items-center w-[30%] mt-12'>
            <img src={candaleria} alt="Candelaria" className='w-32 h-32' />
            <h1 className='font-montserrat font-bold text-2xl text-[#001377] mt-6'>Client Register Form</h1>
          </div>
          <form className='flex flex-col gap-6 w-[70%] px-4 md:px-8' onSubmit={handleSubmit}>
            <div className='flex flex-wrap gap-4 md:gap-6'>
              <div className='flex flex-col gap-2 w-full md:w-[30%]'>
                <label className='font-montserrat text-md font-semibold'>First Name</label>
                <input className='p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none' value={formData.firstname} onChange={handleChange} type="text" name="firstname" />
              </div>
              <div className='flex flex-col gap-2 w-full md:w-[30%]'>
                <label className='font-montserrat text-md font-semibold'>Last Name</label>
                <input className='p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none' value={formData.lastname} onChange={handleChange} type="text" name="lastname" />
              </div>
              <div className='flex flex-col gap-2 w-full md:w-[30%]'>
                <label className='font-montserrat text-md font-semibold'>ID Number</label>
                <input className='p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none' value={formData.idNumber} onChange={handleChange} type="text" name="idNumber" />
              </div>
            </div>
            <div className='flex flex-wrap gap-4 md:gap-6'>
              <div className='flex flex-col gap-2 w-full md:w-[30%]'>
                <label className='font-montserrat text-md font-semibold'>Contact Number</label>
                <input className='p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none' value={formData.contactNumber} onChange={handleChange} type="text" name="contactNumber" />
              </div>
              <div className='flex flex-col gap-2 w-full md:w-[30%]'>
                <label className='font-montserrat text-md font-semibold'>Designation</label>
                <select className='p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none' value={formData.designation} onChange={handleChange} name="designation">
                  <option hidden>Select Designation</option>
                  {designationOptions.map((item) => (
                    <option value={item} key={item}>{item}</option>
                  ))}
                </select>
              </div>

              {(formData.designation === 'Faculty' || formData.designation === 'Staff') && (
                <div className='flex flex-col gap-2 w-full md:w-[30%]'>
                  <label className='font-montserrat text-md font-semibold'>Position</label>
                  <input
                    className='p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none'
                    value={formData.position || ''}
                    onChange={handleChange}
                    type="text"
                    name="position"
                    placeholder=""
                  />
                </div>
              )}

              <div className='flex flex-col gap-2 w-full md:w-[30%]'>
                <label className='font-montserrat text-md font-semibold'>Email</label>
                <input className='p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none' value={formData.email} onChange={handleChange} type="text" name="email" />
              </div>
            </div>




            <div className='flex flex-wrap gap-4 md:gap-6'>
              <div className='flex flex-col gap-2 w-full md:w-[30%]'>
                <label className='font-montserrat text-md font-semibold'>Username</label>
                <input className='p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none' value={formData.username} onChange={handleChange} type="text" name="username" />
              </div>
              <div className='flex flex-col gap-2 w-full md:w-[30%]'>
                <label className='font-montserrat text-md font-semibold'>Password</label>
                <div className='relative'>
                  <input className='p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none w-full'
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password} onChange={handleChange}
                    name="password" />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={handleToggleShowPassword}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div className='flex flex-col gap-2 w-full md:w-[30%]'>
                <label className='font-montserrat text-md font-semibold'>Confirm Password</label>
                <div className='relative'>
                  <input className='p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none w-full'
                    type={showConfirmPassword ? 'password' : 'text'}
                    value={formData.confirm_password} onChange={handleChange}
                    name="confirm_password" />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={handleToggleShowConfirmPassword}>
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 w-full">{error}</p>}

            {/* Submit Button */}
            <div className='flex justify-end mt-8 w-full'>
              <button
                className="bg-[#0CA1E2] text-white py-3 px-6 rounded-lg cursor-pointer font-montserrat text-sm transition-all duration-200 hover:bg-[#007bb5]"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>

          {/* Success Modal */}
          {successPopUp && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] text-center">
                <FaCheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <p className="text-gray-700 mt-3">Registration successful!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentRegister;
