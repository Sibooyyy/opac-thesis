import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { CiSearch } from "react-icons/ci"

const CategoryRec = ({ onEditClick }) => {
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    axios
      .get('http://localhost:8081/get/categories')
      .then((response) => {
        if (response.data.status) {
          setData(response.data.data);
        } else {
          setError(response.data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const filteredData = data.filter(book =>
    book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / recordsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='w-[70%] font-montserrat'>
      <div className='flex flex-row items-center gap-3 mb-3'>
          <span>Search By</span>
          <div>
            <input 
              type="text" 
              className='pl-10 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400' 
              placeholder="Search..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
      </div>
      <table className='w-full'>
        <thead className='font-poppins text-[14px] border-2 h-[45px] bg-[#F2F2F2] py-2'>
          <tr>
            <th className='border border-r-2'>No</th>
            <th className='border border-r-2'>Category</th>
            <th className='border border-r-2'>Status</th>
            <th className='border border-r-2'>Date Updated</th>
            <th className=''>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((category, index) => (
            <tr key={index} className='text-center bg-white hover:bg-gray-50'>
              <td className='border border-r-2 py-1'>{indexOfFirstRecord + index + 1}</td>
              <td className='border border-r-2 py-1'>{category.category}</td>
              <td className='border border-r-2 py-1'>{category.status}</td>
              <td className='border border-r-2 py-1'>{moment(category.date_update).format("MMM Do YYYY")}</td>
              <td className='border border-r-2 py-1'>
                <div>
                  <span
                    className="bg-blue-500 text-white rounded-md px-3 py-1 font-montserrat text-[15px] hover:bg-blue-700"
                    onClick={() => { onEditClick(category.category, category.status, category.id); }}
                  >
                    Edit
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex flex-row justify-center mt-5 text-[25px] items-center gap-4'>
            <button
            onClick={previousPage}
            disabled={currentPage === 1}
            className='disabled:opacity-50 cursor-pointer'
            >
            <MdNavigateBefore />
            </button>
            <span className='font-poppins text-[18px]'>{currentPage}</span>
            <button
            onClick={nextPage}
            disabled={currentPage >= Math.ceil(filteredData.length / recordsPerPage)}
            className='disabled:opacity-50 cursor-pointer'
            >
            <MdNavigateNext />
            </button>
      </div>
    </div>
  );
};

export default CategoryRec;
