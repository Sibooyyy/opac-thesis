import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FaEdit } from "react-icons/fa";
import { LuDownloadCloud } from "react-icons/lu";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import * as XLSX from 'xlsx'; // Import the xlsx library

const CatRec = ({ onEditClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

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

  // Sorting function
  const sortData = (field) => {
    const sortedData = [...data].sort((a, b) => {
      if (a[field].toLowerCase() < b[field].toLowerCase()) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (a[field].toLowerCase() > b[field].toLowerCase()) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setData(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

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

  // Export to Excel function
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
    XLSX.writeFile(workbook, "Categories.xlsx");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="m-5 w-[80%] h-[550px] mt-16 rounded-2xl border bg-[#F6FBFD] font-montserrat shadow-3xl">
      <div className='flex justify-between h-[70px] items-center p-5 bg-[#292A84] rounded-t-2xl'>
        <h1 className='font-bold text-xl text-white '>Category List</h1>
        <button 
          onClick={exportToExcel} // Call the export function on click
          className='bg-blue-600 text-white w-[150px] h-8 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm font-semibold hover:bg-blue-700'>
          Export Data <LuDownloadCloud />
        </button>
      </div>
      <div className=" w-full sm:w-[30%] mb-3 p-5 mt-3">
        <input
          type="text"
          placeholder="Search a list"
          className="pl-10 pr-2 py-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="w-[95%] mx-auto font-montserrat text-sm sm:text-md cursor-pointer">
        <thead className="text-xs sm:text-sm md:text-md font-semibold h-[45px] text-gray-700 ">
          <tr className='border-b-2 border-gray-500'>
            <th>No</th>
            <th onClick={() => sortData('category')} className="cursor-pointer">
              <span>Category</span>
              {sortOrder === 'asc' ? <FaSortAmountDown className="inline ml-1" /> : <FaSortAmountUp className="inline ml-1" />}
            </th>
            <th onClick={() => sortData('status')} className="cursor-pointer">
              <span>Status</span>
              {sortOrder === 'asc' ? <FaSortAmountDown className="inline ml-1" /> : <FaSortAmountUp className="inline ml-1" />}
            </th>
            <th onClick={() => sortData('date_update')} className="cursor-pointer">
              <span>Date Updated</span>
              {sortOrder === 'asc' ? <FaSortAmountDown className="inline ml-1" /> : <FaSortAmountUp className="inline ml-1" />}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((category, index) => (
            <tr key={index} className="text-center hover:bg-gray-200 ">
              <td className="px-2 py-2 border-b-2">{indexOfFirstRecord + index + 1}</td>
              <td className="px-2 py-2 border-b-2">{category.category}</td>
              <td 
                className={`px-2 py-2 my-4 ${
                  category.status.toLowerCase() === 'active' ? 'bg-green-400 text-black' : 'bg-red-100 text-red-800'
                } rounded-3xl w-[120px] border-b-2 `}
              >
                {category.status}
              </td>
              <td className="px-2 py-2 border-b-2">
                {moment(category.date_update).format("MMM Do YYYY")}
              </td>
              <td className="px-2 py-2 border-b-2">
                <button
                  className="bg-blue-500 text-white rounded-md px-3 py-1 hover:bg-blue-700"
                  onClick={() => onEditClick(category.category, category.status, category.id)}
                  title="Edit Catalog"
                >
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-20 items-center gap-1 pr-10">
        <button
          onClick={previousPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 text-sm border rounded-l-md text-bold${
            currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'
          }`}
        >
          Previous
        </button>
        
        <span
          className="px-3 py-1 text-sm border-t border-b border-blue-600 text-white bg-blue-500 font-semibold"
          style={{ borderRadius: '4px' }}
        >
          {currentPage}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage >= Math.ceil(filteredData.length / recordsPerPage)}
          className={`px-3 py-1 text-sm border rounded-r-md ${
            currentPage >= Math.ceil(filteredData.length / recordsPerPage)
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-600 hover:bg-blue-100'
          }`}
        >
          Next
        </button>
      </div>
    </div>
    
  );
};

export default CatRec;
