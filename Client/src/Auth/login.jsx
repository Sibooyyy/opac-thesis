import Header from "../Components/header";
import candaleria from '../assets/candaleria.png';
import { useState, useContext } from 'react';
import axios from "axios";
import { loginForm } from '../utils/utils';
import { ADMIN, PASSWORD } from '../utils/credential';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { FaSpinner } from 'react-icons/fa';

function Login() {
    const { handleLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState(loginForm());
    const [loading, setLoading] = useState(false);
    const [successPopUp, setSuccessPopUp] = useState(false);
    const [failedPopup, setFailedPopup] = useState(false);
    const [welcomePopup, setWelcomePopup] = useState(false);
    const [error, setError] = useState('');

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
                    navigate('/admin/home');
                }, 3000);
            }, 1000);
        } else {
            const url = 'http://localhost:8081/auth/login';
            axios.post(url, formData)
                .then((res) => {
                    const { status, message, data } = res.data;
                    if (status) {
                        setWelcomePopup(true); 
                        setTimeout(() => {
                            setLoading(false); 
                            setWelcomePopup(false);
                            handleLogin(data);
                            navigate('/home');
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
        <>
            <Header />
            <div
                className="flex justify-center flex-col items-center border-2 w-[40%] max-w-[600px] mx-auto my-16 p-8 rounded-2xl gap-8 shadow-lg bg-white">
                <div>
                    <img
                        src={candaleria}
                        alt="Candelaria"
                    />
                </div>
                <div className="text-center">
                    <h1 className="font-poppins font-bold text-lg text-[#001377]">Library Online Public Catalog</h1>
                </div>
                <form className="flex flex-col gap-4 w-[80%]" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label className="font-montserrat text-md font-semibold">Username</label>
                        <input
                            className="p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none w-full"
                            value={formData.username}
                            onChange={handleChange}
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-montserrat text-md font-semibold">Password</label>
                        <input
                            className="p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none w-full"
                            value={formData.password}
                            onChange={handleChange}
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            className="bg-[#0CA1E2] text-white py-3 px-6 rounded-lg cursor-pointer font-montserrat text-sm flex items-center justify-center gap-2"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <FaSpinner className="animate-spin" /> : "Login"}
                        </button>
                    </div>
                </form>
                {welcomePopup && (
                    <div className="bg-green-500 text-black p-4 rounded-md shadow-md">
                        <p>Welcome, {formData.username === ADMIN ? 'Admin' : 'User'}!</p>
                    </div>
                )}
                {successPopUp && (
                    <div className="bg-green-500 text-black p-2 rounded-md">
                        <p>Login successful</p>
                    </div>
                )}
                {failedPopup && (
                    <div className="bg-red-500 text-black p-2 rounded-md">
                        <p>{error}</p>
                    </div>
                )}
            </div>

        </>
    );
}

export default Login;
