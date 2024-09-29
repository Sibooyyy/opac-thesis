import Logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from '../App'; 
import { FaUserCircle } from 'react-icons/fa';



function Header() {
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference for the dropdown

  const logout = () => {
    handleLogout();
    navigate('/home');  
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close the dropdown if clicked outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='flex flex-wrap justify-between items-center gap-2 bg-[#161D6F] w-full px-4 py-2'>
      <div className='w-1/4'>
        <img src={Logo} alt="Logo" className='max-w-full h-auto'/>
      </div>
      <div className='flex items-center text-center'>
        <li className='list-none text-white font-poppins text-md md:text-bas pr-[300px]'>Online Public Access Catalog (OPAC)</li>
      </div>
      <div className='relative flex items-center mr-3' ref={dropdownRef}> {/* Ref added here */}
        {user ? (
          <div className='relative'>
            <FaUserCircle 
              onClick={toggleDropdown}  
              className='text-white text-2xl cursor-pointer mr-7 text-[35px]'
            />
            {isDropdownOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50'>
                <ul className='py-2'>
                  <li 
                    className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                    onClick={logout}>
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')} 
            className='bg-[#0CA1E2] text-white py-2 px-4 md:px-6 rounded-lg cursor-pointer font-montserrat text-xs md:text-sm'>
            Login
          </button>
        )}
      </div>
    </div>
  )
}

export default Header;
