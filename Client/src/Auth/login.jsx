import Header from "../Components/header";
import candaleria from '../assets/candaleria.png'
import { useState, useContext  } from'react';
import axios from "axios";
import { loginForm } from '../utils/utils';
import { ADMIN, PASSWORD } from '../utils/credential';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

function login() {
  
  const { handleLogin } = useContext(AuthContext);  
  const navigate = useNavigate();
  const [formData, setFormData] = useState(loginForm());
  const [loading, setLoading] = useState(false);
  const [successPopUp, setSuccessPopUp] = useState(false);
  const [failedPopup, setFailedPopup] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
        alert("Please fill all fields!");
        return;
    }
    if (formData.username === ADMIN && formData.password === PASSWORD) {
        setSuccessPopUp(true);
        setTimeout(() => {
          handleLogin(formData); 
          navigate ('/admin/home');
        }, 3000)
    } else {
        setLoading(true);
        const url = 'http://localhost:8081/auth/login';
        axios.post(url, formData)
            .then((res) => {
                const { status, message, data } = res.data;
                if (status) {
                    setSuccessPopUp(true);
                    setTimeout(() => {
                    handleLogin(data);
                    navigate('/home');
                    }, 3000)
                } else {
                    setFailedPopup(true);
                    setError(message);
                }
                setLoading(false);
            })
            .catch((error) => {
                setFailedPopup(true);
                setError("No Username or Password found!");
                setLoading(false);
                console.log(error);
            });
    }
}

  return (
    <>
        <Header/>
        <div className="flex justify-center flex-col items-center border-2 w-[40%] mx-auto my-[100px] rounded-2xl gap-10 drop-shadow-sm ">
            <div className="mt-5">
              <img src={candaleria} alt="" />
            </div>
            <div>
              <h1 className="font-poppins font-bold text-3xl text-[#001377]">Library Online Public Catalog</h1>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex gap-3 items-center">
                  <label className="font-montserrat text-[17px] font-medium">Username</label>
                  <input className="p-1 border border-black rounded-md drop-shadow-sm cursor-pointer" value={formData.username} onChange={handleChange} type="text" name="username" placeholder="Enter your username"   />
                </div>
                <div className="flex gap-3 items-center">
                  <label className="font-montserrat text-[17px] font-medium">Password</label>
                  <input className="p-1 border border-black rounded-md drop-shadow-sm cursor-pointer" value={formData.password} onChange={handleChange} type="password" name="password" placeholder="Enter your password" />
                </div>
                <div className="flex justify-center mt-1 pb-[40px]">
                  <button className="bg-[#0CA1E2] text-[white] py-3 w-[90px] rounded-lg cursor-pointer font-montserrat text-[12px]" type="submit">Login</button>
                </div>
            </form>
            {successPopUp && (
                <div className="bg-green-500 text-[black] p-2 rounded-md">
                    <p>Login successful</p>
                </div>
            )}
            {failedPopup && (
                <div className="bg-red-500 text-[black] p-2 rounded-md">
                    <p>{error}</p>
                </div>
            )}
        </div>
    </>
  )
}

export default login