import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from '../App'; 

const catalog = () => {
  const navigate = useNavigate()
  const handleClick = (link) => {navigate(link)}
  const { isLoggedIn, reservedBooks  } = useContext(AuthContext);


  return (
    <div className="h-[100%]">
        <div className="w-[250px] p-3 flex flex-col gap-2 bg-white border-2 border-[#0CA1E2] rounded-[5px]">
            <div>
                <h1 className="text-[#161D6F] font-poppins font-bold text-[18px] border-b border-b-gray-400 border-solid">Online Catalog</h1>
                <ul className="ml-4 mt-1">
                    <li onClick={()=> handleClick("/home")} className=" text-zinc-500 cursor-pointer font-poppins">Basic Search</li>
                    <li onClick={() => handleClick("/home/advance")} className=" text-zinc-500 cursor-pointer font-poppins">Advance Search</li>
                </ul>
            </div>
            <div>
                <h1 className="text-[#161D6F] font-poppins font-bold text-[18px] border-b border-b-gray-400 border-solid">My Borrow Book</h1>
                <ul className="ml-4 mt-1">
                    <li onClick={() => handleClick("/home/borrow")} className=" text-zinc-500 cursor-pointer font-poppins">View Borrow Book
                     {reservedBooks.length > 0 && <span className="bg-red-500 text-white rounded-full px-2 ml-2">{reservedBooks.length}</span>}
                    </li>
                </ul>
            </div>
            {isLoggedIn && (
                <div>
                    <h1 className="text-[#161D6F] font-poppins font-bold text-[18px] border-b border-b-gray-400 border-solid">My Profile</h1>
                    <ul className="ml-4 mt-1">
                    <li onClick={() => handleClick("/home/profile")} className=" text-zinc-500 cursor-pointer font-poppins">View Profile</li>
                    </ul>
                </div>
                )}
        </div>
    </div>
  )
}

export default catalog