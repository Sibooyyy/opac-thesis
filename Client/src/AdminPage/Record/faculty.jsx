import Navbar from '../../Components/navbar'
import { FaUser } from "react-icons/fa";

const faculty = () => {
  return (
    <>
        <Navbar/>
        <div className='w-[100%] h-screen'>
          <div className='flex flex-row mt-8 items-center pl-[250px] border-b font-montserrat font-bold text-[25px] p-5 gap-1'> 
                <FaUser/><span>Faculty Record</span>
          </div>
          <div className='flex w-[100%] justify-between items-center mt-10'>
              <table className='mx-auto'>
                <thead className='font-poppins text-[14px] border-2 bg-[#F2F2F2] py-2'>
                  <tr>
                        <th className='border border-r-2 px-[30px] w-[10%]'>No</th>
                        <th className='border border-r-2 px-[30px] w-[15%]'>Name</th>
                        <th className='border border-r-2 px-[30px] '>Designation</th>
                        <th className='border border-r-2 px-[30px] w-[12%]'>Title</th>
                        <th className='border border-r-2 px-[30px] w-[15%]'>Author</th>
                        <th className='border border-r-2 px-[30px] w-[12%]'>ISBN</th>
                        <th className='border border-r-2 px-[30px] w-[17%]'>Booking Date</th>
                        <th className='border border-r-2 px-[30px] w-[15%]'>Pick-up Date</th>
                        <th className='px-[30px]'>Status</th>
                  </tr>
                </thead>
                <tbody>

                </tbody>
              </table>
            </div>
      </div>

    </>
  )
}

export default faculty