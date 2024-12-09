import { useState, useContext } from "react";
import { FaAngleDown, FaAngleRight, FaRegUserCircle, FaPowerOff } from "react-icons/fa";
import Logo from "../assets/candaleria.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../App'; 

const Navigation = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null); 
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
    setActiveSubmenu(null); 
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen((prev) => !prev); 
  };

  const toggleSubmenu = (submenu) => {
    setActiveSubmenu((prev) => (prev === submenu ? null : submenu));
  };

  return (
    <div className="flex flex-col md:flex-row items-center bg-[#292A84] text-white shadow-lg  gap-4 md:gap-8 w-full p-4 font-montserrat text-lg font-medium cursor-pointer ">
      <div className="flex gap-2 items-center cursor-pointer" onClick={() => handleClick('/admin/home/dashboard')}>
        <img src={Logo} alt="Logo" className="h-12 w-12 md:h-10 md:w-10 rounded-full" /> 
        <span className="hidden md:block text-sm md:text-[18px]">Admin</span>
      </div>
      <div className="flex flex-1 justify-center items-center mt-2 md:mt-0">
        <ul className="flex flex-col md:flex-row gap-4 md:gap-14 items-center text-center text-sm md:text-[16px]">
          <li className="hover:text-blue-500 transition duration-300" onClick={() => handleClick('/admin/home/dashboard')}>Dashboard</li>
          <li className="relative">
            <div
              className="flex items-center gap-1 hover:text-blue-500 transition duration-300"
              onClick={toggleDropdown}
            >
              Account Record <FaAngleDown />
            </div>
            {isDropdownOpen && (
              <ul className="absolute bg-white border rounded shadow-lg mt-2 p-2 w-40 md:w-48 text-sm z-10 text-black">
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSubmenu('addAccount')}
                >
                  Add Account <FaAngleRight />
                  {activeSubmenu === 'addAccount' && (
                    <ul className="absolute left-full top-0 ml-1 w-36 md:w-40 bg-white border rounded shadow-lg text-xs md:text-sm ">
                      <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer " onClick={() => handleClick('/admin/register/client')}>Add Client Account</li>
                      <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleClick('/admin/register/staff')}>Add Library Staff Account</li>
                    </ul>
                  )}
                </li>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSubmenu('registerTable')}
                >
                  Register Table <FaAngleRight />
                  {activeSubmenu === 'registerTable' && (
                    <ul className="absolute left-full top-0 ml-1 w-36 md:w-40 bg-white border rounded shadow-lg text-xs md:text-sm">
                      <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleClick('/admin/home/client/table')}>Client Registered</li>
                      <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleClick('/admin/home/staff/table')}>Library Staff Registered</li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
          <li className="hover:text-blue-500 transition duration-300" onClick={() => handleClick('/admin/home/category')}>Category</li>
          <li className="hover:text-blue-500 transition duration-300" onClick={() => handleClick('/admin/home/books')}>Books</li>
        </ul>
        <div className="relative flex gap-4 items-center mt-2 md:mt-0 md:absolute md:right-8">
          <button className="hover:text-blue-500 transition duration-300" onClick={toggleUserDropdown}>
            <FaRegUserCircle size={24} />
          </button>
          {isUserDropdownOpen && (
            <ul className="absolute bg-white border rounded shadow-lg mt-2 md:mt-[100px] p-2 right-0 w-32 md:w-40 z-10 text-black">
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

export default Navigation;
