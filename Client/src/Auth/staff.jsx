import { IoMdArrowBack } from "react-icons/io";
import Logo from '../assets/candaleria.png';
import { useState, useContext } from 'react';
import axios from "axios";
import { loginForm } from '../utils/utils';
import { ADMIN, PASSWORD } from '../utils/credential';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { FaSpinner } from 'react-icons/fa';
import BackgroundImage from '../assets/output.png';

const Login = () => {
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(loginForm());
  const [loading, setLoading] = useState(false);
  const [failedPopup, setFailedPopup] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [error, setError] = useState('');

  const handleClick = (link) => {
      navigate(link);
    };
  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
      setError(''); 
      setFailedPopup(false); 
  }

  const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.username || !formData.password) {
          alert("Please fill all fields!");
          return;
      }
      setLoading(true); 

      if (formData.username === ADMIN && formData.password === PASSWORD) {
          setTimeout(() => {
              setWelcomePopup(true); 
              setTimeout(() => {
                  setLoading(false); 
                  setWelcomePopup(false);
                  handleLogin(formData);
                  navigate('/admin/home/dashboard');
              }, 3000);
          }, 1000);
      } else {
        const url = 'http://localhost:8081/auth/login/staff';
            axios.post(url, formData)
                .then((res) => {
                    const { status, message, data } = res.data;
                    if (status) {
                        setWelcomePopup(true); 
                        setTimeout(() => {
                            setLoading(false); 
                            setWelcomePopup(false);
                            handleLogin(data);
                            navigate('/home/dashboard');
                        }, 3000);
                    } else {
                        setFailedPopup(true);
                        setError(message);
                        setLoading(false); 
                    }
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
    <div style={{ backgroundImage: `url(${BackgroundImage})` }}
    className="bg-[#EFF6FC] min-h-screen flex justify-center items-center overflow-y-auto">
      <div className="flex flex-col justify-center mx-4 h-[470px] sm:mx-8 md:mx-auto w-full sm:w-[80%] md:w-[80%] lg:w-[40%] max-w-lg border shadow-3xl rounded-lg p-6 bg-[#FBFDFF] font-montserrat">
        

        <div className="flex justify-between w-full mb-6 cursor-pointer">
          <div className="flex items-center gap-1 hover:text-blue-300 text-[#292A84] text-[17px]" onClick={() => handleClick("/home")}>
            <IoMdArrowBack /> Back to Homepage
          </div>
          <div className="hover:text-blue-300 text-[#292A84] text-[17px]" onClick={() => handleClick("/login")}>
            Login As User 
          </div>
        </div>


        <div className="flex flex-col justify-center items-center gap-2 w-full mb-6">
          <img src={Logo} alt="Logo" className="w-24 h-24" />
          <h1 className="text-[#292A84] font-bold text-2xl text-center">Library Staff</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-row gap-2">
              <label className="font-md text-lg">Username</label>
              <input type="text" className="border-2 w-[80%] rounded-md cursor-pointer border-black py-1 px-2  text-[15px]"                          
                value={formData.username}
                onChange={handleChange}
                name="username" />
            </div>
            <div className="flex flex-row gap-2">
              <label className="font-md text-lg">Password</label>
              <input type="password" className="border-2 w-[80%] rounded-md cursor-pointer border-black text-[15px] py-1 px-2"                           
                value={formData.password}
                onChange={handleChange}
                name="password" />
            </div>
            <button className="w-full bg-[#4EBCFF] h-[40px] text-white rounded-md hover:text-blue-500 mt-4 mb-2 flex justify-center items-center"                            
                    type="submit"
                    disabled={loading}
                    >
                    {loading ? <FaSpinner className="animate-spin text-xl" /> : "Login"}
            </button>
          </div>
        </form>
        {failedPopup && (
          <div className="mt-4 text-red-500 text-center font-semibold">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
