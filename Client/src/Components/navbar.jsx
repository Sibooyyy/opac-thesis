import Header from "./header"
import { useNavigate } from "react-router-dom"
import { useState} from "react"

const HeaderOption = () => {
    
    const navigate = useNavigate()
    const handleClick = (link) => {navigate(link)}
    const [showDropdown, setShowDropdown] = useState(false)
    const [showBorrowUserDropdown, setShowBorrowUserDropdown] = useState(false);
    const handleToggleDropdown = () => setShowDropdown(!showDropdown)
    const handleToggleBorrowUserDropdown = () => {setShowBorrowUserDropdown(!showBorrowUserDropdown);};

  return (
    <>
        <Header/>
        <div className="drop-shadow-md bg-[#F1F1F1] w-full font-poppins uppercase p-8 flex justify-center font-bold">
            <ul className="flex flex-wrap justify-between list-none gap-8 md:gap-16 lg:gap-20">
                <li className="cursor-pointer" onClick={() => handleClick('/admin/home')} >Dashboard</li>
                <li className="relative cursor-pointer" onClick={handleToggleDropdown}>Register Account
                    {showDropdown && (
                        <ul className="absolute bg-white shadow-md p-2 rounded-md w-[170px] flex flex-col gap-2">
                            <li className="text-[14px] cursor-pointer hover:bg-gray-100 p-1" onClick={() => handleClick('/admin/register')}>Add Student</li>
                            <li className="text-[14px] cursor-pointer hover:bg-gray-100 p-1" onClick={() => handleClick('/admin/account/record')}>Account Record</li>
                        </ul>
                    )}
                </li>
                <li className="cursor-pointer" onClick={() => handleClick('/admin/category')}>Categories</li>
                <li className="cursor-pointer" onClick={() => handleClick('/admin/books')}>Books</li>
                <li className="relative cursor-pointer" onClick={handleToggleBorrowUserDropdown}>Borrow User
                    {showBorrowUserDropdown && (
                        <ul className="absolute bg-white shadow-md p-2 rounded-md w-[150px] flex flex-col gap-2">
                            <li className="text-[14px]  cursor-pointer hover:bg-gray-100 p-1" onClick={() => handleClick('/admin/faculty/record')}>Faculty</li>
                            <li className="text-[14px] cursor-pointer hover:bg-gray-100 p-1" onClick={() => handleClick('/admin/student/record')}>Student</li>
                        </ul>
                    )}
                </li>
            </ul>
        </div>
    </>
  )
}

export default HeaderOption