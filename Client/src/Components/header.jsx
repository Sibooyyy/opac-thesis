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
    <div className='flex justify-between items-center gap-2 bg-[#161D6F] w-[100%]'>
        <div className='w-[25%]'>
            <img src={Logo} alt="" />
        </div>
        <div className='flex items-center mr-[150px]'>
            <li className='list-none text-[white] font-poppins'>Online Public Access Catalog (OPAC)</li>
        </div>
        <div className='flex mr-[100px]'>
            {user ? (
              <button onClick={logout} className='bg-[#0CA1E2] text-[white] py-3 w-[90px] rounded-lg cursor-pointer font-montserrat text-[12px]'>
                Logout
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className='bg-[#0CA1E2] text-[white] py-3 w-[90px] rounded-lg cursor-pointer font-montserrat text-[12px]'>
                Login
              </button>
            )}
        </div>
    </div>
  )
}

export default Header