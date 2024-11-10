import { useState, useContext } from "react";
import { FaAngleDown, FaAngleRight, FaRegUserCircle, FaPowerOff } from "react-icons/fa";
import Logo from "../assets/candaleria.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../App'; 
import { CiBellOn } from "react-icons/ci";

const Navs = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false); 
  const navigate = useNavigate();
  const { handleLogout } = useContext(AuthContext);

  const handleClick = (link) => {
    navigate(link);
  };

  const logout = () => {
    handleLogout();
    navigate('/home');  
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen((prev) => !prev); 
  };

  return (
    <div className="flex flex-col md:flex-row items-center bg-[#F6F8F9] border-b-2 shadow-3xl rounded-lg gap-4 md:gap-8 w-full p-4 font-montserrat text-lg font-medium cursor-pointer">
      <div className="flex gap-2 items-center cursor-pointer" onClick={() => handleClick('/home/dashboard')}>
        <img src={Logo} alt="Logo" className="h-10 w-10 md:h-16 md:w-16 rounded-full" /> 
        <span className="hidden md:block">Library Staff</span>
      </div>
      <div className="flex flex-1 justify-center items-center mt-2 md:mt-0">
        <ul className="flex flex-col md:flex-row gap-4 md:gap-10 items-center text-center text-sm md:text-lg">
          <li className="hover:text-blue-500 transition duration-300" onClick={() => handleClick('/home/dashboard')}>Dashboard</li>
          <li className="relative">
            <div
              className="flex items-center gap-1 hover:text-blue-500 transition duration-300"
              onClick={toggleDropdown}
            >
              Manage Borrowing User <FaAngleDown />
            </div>
            {isDropdownOpen && (
              <ul className="absolute bg-white border rounded shadow-lg mt-2 p-2 w-40 md:w-48 text-sm z-10">
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                  onClick={() => handleClick('/home/student/borrowing')}
                >
                  Student
                </li>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center text-[15px]"
                  onClick={() => handleClick('/home/faculty/borrowing')}
                >
                  Faculty
                </li>
              </ul>
            )}
          </li>
          <li className="hover:text-blue-500 transition duration-300" onClick={() => handleClick('/home/staff/category')}>Category</li>
          <li className="hover:text-blue-500 transition duration-300" onClick={() => handleClick('/home/staff/book')}>Books</li>
        </ul>
        <div className="relative flex gap-4 items-center mt-2 md:mt-0 md:absolute md:right-8">
          <button className="hover:text-blue-500 transition duration-300"><CiBellOn size={24}/></button>
          <button className="hover:text-blue-500 transition duration-300" onClick={toggleUserDropdown}>
            <FaRegUserCircle size={24} />
          </button>
          {isUserDropdownOpen && (
            <ul className="absolute bg-white border rounded shadow-lg mt-2 md:mt-[100px] p-2 right-0 w-32 md:w-40 z-10">
              <li
                className="p-2 hover:bg-gray-200 cursor-pointer text-sm md:text-[15px] flex items-center gap-2"
                onClick={logout}
              >
                <FaPowerOff /> Sign Out
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navs;
