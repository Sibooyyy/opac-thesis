import axios from "axios";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import moment from 'moment';



const BookRecord = () => {
    
  

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8081/book/data')
          .then(response => {
            if (response.data.status) {
              setData(response.data.data);
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

    const handleDelete = (author) => {
      if (window.confirm(`Are you sure you want to delete book with ${author}?`)) {
        axios.delete(`http://localhost:8081/book/data/${author}`)
          .then(response => {
            console.log(response.data);
            setData(data.filter(item => item.author !== author)); 
            setUpdate(!update);
          })
          .catch(error => {
            console.error(error);
          });
      }
    };


  return (
    <div className='w-[68%]'>
        <table className='w-full'>
          <thead className='font-poppins text-[14px] border-2 h-[45px] bg-[#F2F2F2] py-2'>
              <tr>
                  <th className='border border-r-2'>No</th>
                  <th className='border border-r-2 w-[150px]'>Title</th>
                  <th className='border border-r-2 w-[150px]'>Category</th>
                  <th className='border border-r-2 w-[150px]'>ISBN/ISSN</th>
                  <th className='border border-r-2 w-[150px]'>Author</th>
                  <th className='border border-r-2 w-[150px]' >Publisher</th>
                  <th className='border border-r-2 w-[150px]' >Date Published</th>
                  <th className=''>Action</th>
              </tr>
          </thead>
          <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                        <td className='border border-r-2 px-[10px] font-poppins'>{index + 1}</td>
                        <td className='border border-r-2 px-[40px]'>{item.title}</td>
                        <td className='border border-r-2 px-[40px]'>{item.category}</td>
                        <td className='border border-r-2 px-[40px]'>{item.isbn_issn}</td>
                        <td className='border border-r-2 px-[20px]'>{item.author}</td>
                        <td className='border border-r-2 px-[20px]'>{item.accession_number}</td>
                        <td className='border border-r-2 px-[20px]'>{moment(item.date_published).format('MM-DD-YYYY')}</td>
                        <td className='border border-r-2'>
                            <div className="flex gap-2 text-center pl-1">
                                <span className="border bg-[#003687] text-white rounded-md px-3 font-montserrat text-[15px] cursor-pointer">Edit</span>
                                <span className="border bg-[#CC0000] text-white rounded-md px-3 font-montserrat text-[15px] cursor-pointer" onClick={() => handleDelete(item.author)}>Delete</span>
                            </div>
                        </td>
                        </tr>
                    ))}
                </tbody>
        </table>
    </div>
  )
}

export default BookRecord

