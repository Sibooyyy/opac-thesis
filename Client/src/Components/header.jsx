import Logo from '../assets/logo.png'
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from '../App'; 





function Header() {
  const navigate = useNavigate()
  const { user, handleLogout } = useContext(AuthContext);

  const logout = () => {
    handleLogout();
    navigate('/home');  
  };
  
 

  return (
    <div className='flex flex-wrap justify-between items-center gap-2 bg-[#161D6F] w-full px-4 py-2'>
        <div className='w-1/4'>
            <img src={Logo} alt="Logo" className='max-w-full h-auto'/>
        </div>
        <div className='flex items-center text-center'>
            <li className='list-none text-white font-poppins text-sm md:text-bas'>Online Public Access Catalog (OPAC)</li>
        </div>
        <div className='flex mr-3'>
            {user ? (
              <button onClick={logout} className='bg-[#0CA1E2] text-white py-2 px-4 md:px-6 rounded-lg cursor-pointer font-montserrat text-xs md:text-sm'>
                Logout
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className='bg-[#0CA1E2] text-white py-2 px-4 md:px-6 rounded-lg cursor-pointer font-montserrat text-xs md:text-sm'>
                Login
              </button>
            )}
        </div>
    </div>
  )
}

export default Header