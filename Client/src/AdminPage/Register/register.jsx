import Header from '../../Components/navbar'
import candaleria from '../../assets/candaleria.png'
import { useState } from 'react'
import { FaEyeSlash, FaEye  } from "react-icons/fa";
import { registrationForm } from '../../utils/utils';
import axios from 'axios';



const register = () => {
  const designationOptions = ['Faculty', 'Student']

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const handleToggleShowPassword = () => setShowPassword(!showPassword);
  const handleToggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const [formData, setFormData] = useState(registrationForm());
  const [loading, setLoading] = useState(false);
  const [successPopUp, setSuccessPopUp] = useState(false);
  const [error, setError] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value });
    setError('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirm_password) {
      alert('Passwords do not match');
      return;
  }
  setLoading(true);
  const url = 'http://localhost:8081/auth/register';
  axios.post(url, formData).then((res) => {
    const {status, message} = res.data;
    if(status) {
      setSuccessPopUp(true);
      setLoading(false);
      console.log(message);
    }
  }).catch(error => {
    console.log(error);
    setLoading(false);
  })
}



return (
  <>
    <Header />
    <div className='flex justify-center items-center flex-col border border-gray-200 rounded-lg shadow-lg w-full max-w-[800px] mx-auto my-[70px] p-8 bg-white'>
      {/* Image Section */}
      <div className='mb-5'>
        <img src={candaleria} alt="Candelaria" className='w-32 h-32 mx-auto' />
      </div>
      
      {/* Title Section */}
      <div>
        <h1 className='font-poppins font-bold text-3xl text-[#001377] mb-6 mt-3'>Register Form</h1>
      </div>
      
      {/* Form Section */}
      <form className='flex flex-col gap-6 w-full px-4 md:px-8' onSubmit={handleSubmit}>
        
        {/* First Row */}
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

        {/* Second Row */}
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
        </div>

        {/* Third Row */}
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

        {/* Submit Button */}
        <div className='flex justify-end mt-8'>
          <button className='bg-[#0CA1E2] text-white py-3 px-6 rounded-lg cursor-pointer font-montserrat text-sm transition-all duration-200 hover:bg-[#007bb5]'>Register</button>
        </div>
      </form>

      {/* Success Popup */}
      {successPopUp && (
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md mt-4">
          <p>Registration successful!</p>
        </div>
      )}
    </div>
  </>
  );
} 

export default register