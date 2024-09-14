import Navbar from '../../Components/navbar'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { MdDelete } from "react-icons/md";



const AccountRecord = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8081/account/data')
          .then(response => {
            if (response.data.status) {
              setData(response.data.data);
            } else {
              setError(response.data.message);
            }
            setLoading(false);
          })
          .catch(error => {
            setError(error.message);
            setLoading(false);
          });
      }, []);

      const handleDelete = (idNumber) => {
        if (window.confirm(`Are you sure you want to delete student with ID ${idNumber}?`))
        axios.delete(`http://localhost:8081/account/data/${idNumber}`)
          .then(response => {
            console.log(response.data);
            setData(data.filter(item => item.idNumber !== idNumber));
          })
          .catch(error => {
            console.error(error);
          });
      };
      
  return (
    <>
        <Navbar/>
        <div className='flex w-[100%] mt-[60px]'>
              <table className='mx-auto'>
                <thead className='w-[100%] font-poppins text-[14px] border-2 bg-[#F2F2F2] py-2'>
                  <tr>
                        <th className='border border-r-2 px-[10px] w-[10%]'>No</th>
                        <th className='border border-r-2 px-[40px] w-[30%]'>First Name</th>
                        <th className='border border-r-2 px-[40px] w-[30%]'>Last Name</th>
                        <th className='border border-r-2 px-[40px]'>ID Number</th>
                        <th className='border border-r-2 px-[20px] '>Contact</th>
                        <th className='border border-r-2 px-[20px] w-[1%]'>Designation</th>
                        <th className='border border-r-2 px-[20px] w-[12%]'>Username</th>
                        <th className='px-[30px]'>Status</th>
                  </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                        <td className='border border-r-2 px-[10px] font-poppins'>{index + 1}</td>
                        <td className='border border-r-2 px-[40px]'>{item.firstname}</td>
                        <td className='border border-r-2 px-[40px]'>{item.lastname}</td>
                        <td className='border border-r-2 px-[40px]'>{item.idNumber}</td>
                        <td className='border border-r-2 px-[20px]'>{item.contactNumber}</td>
                        <td className='border border-r-2 px-[20px]'>{item.designation}</td>
                        <td className='border border-r-2 px-[20px]'>{item.username}</td>
                        <td className='px-[30px] border border-r-2'><button onClick={() =>handleDelete(item.idNumber)}><MdDelete/></button></td>
                        </tr>
                    ))}
                </tbody>
              </table>
        </div>
    </>
  )
}

export default AccountRecord