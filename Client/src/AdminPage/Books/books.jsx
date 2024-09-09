import Navbar from '../../Components/navbar'
import BookRecord from './book-record'
import BookInfo from './book-info'
import { FaBookOpen } from "react-icons/fa";



const books = () => {
  return (
    <>
        <Navbar/>
        <div className='flex flex-row mt-8 items-center pl-[250px] border-b font-montserrat font-bold text-[25px] p-5 gap-1'> 
            <FaBookOpen/><span>Books</span>
        </div>
        <div className='h-screen flex justify-between w-[100%] p-[50px] gap-8'>
            <BookInfo/>
            <BookRecord/>
        </div>
    </>

  )
}

export default books