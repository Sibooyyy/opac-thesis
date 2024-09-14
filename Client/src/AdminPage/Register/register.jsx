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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value });
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
        <Header/>
        <div className='flex justify-center items-center flex-col border-2 rounded-lg drop-shadow-sm w-[50%] mx-auto my-12 h-[40%] bg-[white]' >
          <div className='mt-5'>
              <img src={candaleria} alt="" />
          </div>
          <div>
              <h1 className='font-poppins font-bold text-3xl text-[#001377] mb-10 mt-3'>Register Form</h1>
          </div>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex gap-10'>
                <div className='flex flex-col gap-1'>
                    <label className='font-montserrat text-[15px] font-semibold'>First Name</label>
                    <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' value={formData.firstname} onChange={handleChange} type="text" name="firstname"/>
                 </div>
                <div className='flex flex-col gap-1'>
                    <label className='font-montserrat text-[15px] font-semibold'>Last Name</label>
                    <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' value={formData.lastname} onChange={handleChange} type="text" name="lastname"/>
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='font-montserrat text-[15px] font-semibold'>ID Number</label>
                    <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' value={formData.idNumber} onChange={handleChange} type="text" name="idNumber"/>
                </div>
            </div>
            <div className='flex gap-10'>
                <div className='flex flex-col gap-1'>
                    <label className='font-montserrat text-[15px] font-semibold'>Contact Number</label>
                    <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' value={formData.contactNumber} onChange={handleChange} type="text" name="contactNumber" />
                 </div>
                <div className='flex flex-col gap-1'>
                    <label className='font-montserrat text-[15px] font-semibold'>Designation</label>
                    <select className='p-1 border w-[190px] border-black rounded-md drop-shadow-sm cursor-pointer' value={formData.designation} onChange={handleChange} name="designation" id="" >
                      <option hidden>Select Designation</option>
                      {designationOptions.map((item)=>(
                        <option value={item} key={item}>{item}</option>
                      ))}
                    </select>
                </div>
            </div>
            <div className='flex gap-10'>
                <div className='flex flex-col gap-1'>
                    <label className='font-montserrat text-[15px] font-semibold'>Username</label>
                    <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' value={formData.username} onChange={handleChange} type="text" name="username" />
                 </div>
                <div className='flex flex-col gap-1'>
                    <label className='font-montserrat text-[15px] font-semibold'>Password</label>
                    <div className='relative'>
                      <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer'
                      type={showPassword? 'text' : 'password'} 
                      value={formData.password} onChange={handleChange}    
                      name="password"/>
                      <span className="absolute right-2 top-1/2 -translate-y-1/2" onClick={handleToggleShowPassword}>
                        {showPassword ? <FaEyeSlash /> : <FaEye/>}
                      </span>
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='font-montserrat text-[15px] font-semibold'>Confirm Password</label>
                    <div className='relative'>
                      <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer'
                      type={showConfirmPassword? 'password' : 'text'} 
                      value={formData.confirm_password} onChange={handleChange}    
                      name="confirm_password" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2" onClick={handleToggleShowConfirmPassword}>
                        {showConfirmPassword ? <FaEye /> : <FaEyeSlash/>}
                      </span>
                    </div>
                </div>
            </div>
            <div className='flex self-end mb-10'>
              <button className='bg-[#0CA1E2] text-white py-3 w-[90px] rounded-lg cursor-pointer font-montserrat text-[12px]'>Register</button>
            </div>
          </form>
          {successPopUp && (
                <div className="bg-green-500 text-white p-2 rounded-md">
                    <p>Register successful</p>
                </div>
            )}
        </div>
    </>
  )
} 

export default register