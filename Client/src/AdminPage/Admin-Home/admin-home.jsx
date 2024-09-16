import HeaderOption from '../../Components/navbar'
import { FaBookOpen , FaClock, FaUser  } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import { TbCategory2 } from "react-icons/tb";
import { GrReturn } from "react-icons/gr";
import { useState, useEffect } from'react'
import axios from 'axios';




const AdminHome = () => {

  const [record, setRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/register/data')
      .then(response => {
        if (response.data.status) {
          setRecord(response.data.data);
        } else {
          setError(response.data.message);
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <>
        <HeaderOption/>
        <div className='flex flex-row mt-8 items-center pl-[250px] border-b font-montserrat font-bold text-[25px] p-5 gap-1'>
            <MdDashboard/><span>Dashboard</span>
        </div>
        <div className='flex flex-col items-center gap-5 h-screen mt-[50px]'>
            <div className='flex flex-row gap-10 h-[200px] '>
                  <div className='w-[200px] border-[2px] rounded-lg border-[#17A300] flex items-center justify-center flex-col gap-8 bg-white'>
                    <FaBookOpen className='text-[#17A300] text-[40px]'/><span className='text-[#17A300] text-[17px]'></span><span className='text-[#17A300] text-md font-montserrat'>Books Listed</span>
                  </div>
                  <div className='w-[200px] border-[2px] rounded-lg border-[#003687] flex items-center justify-center flex-col gap-8 bg-white'>
                    <FaClock className='text-[#003687] text-[40px]'/><span className='text-[#003687] text-md font-montserrat'>Times Book Issued</span>
                  </div>
                  <div className='w-[200px] border-[2px] rounded-lg border-[#CC0000] flex items-center justify-center flex-col gap-8 bg-white'>
                    <FaUser className='text-[#CC0000] text-[40px]'/><span className='text-[#CC0000] text-[17px]'>{record.length}</span><span className='text-[#CC0000] text-md font-montserrat'>Registered Account</span>
                  </div>
              </div>
              <div className='flex flex-row gap-10 h-[200px] ]'>
                    <div className='w-[200px] border-[2px] rounded-lg border-[#17A300] flex items-center justify-center flex-col gap-8 '>
                      <IoPeople className='text-[#17A300] text-[40px]'/><span className='text-[#17A300] text-[17px]'></span><span className='text-[#17A300] text-md font-montserrat'>Author Listed</span>
                    </div>
                    <div className='w-[200px] border-[2px] rounded-lg border-[#003687] flex items-center justify-center flex-col gap-8'>
                      <TbCategory2 className='text-[#003687] text-[40px]'/><span className='text-[#003687] text-md font-montserrat'>Listed Categories</span>
                    </div>
                    <div className='w-[200px] border-[2px] rounded-lg border-[#FFB800] flex items-center justify-center flex-col gap-8'>
                      <GrReturn className='text-[#FFB800] text-[40px]'/><span className='text-[#FFB800] text-md font-montserrat'>Return Book</span>
                    </div>
              </div>
        </div>

    </>
  )
}

export default AdminHome