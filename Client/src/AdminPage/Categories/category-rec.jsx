import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FaEdit, FaAngleDown } from "react-icons/fa";
import { LuDownloadCloud } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";

const CategoryRec = ({ onEditClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className='p-6 w-full sm:w-[70%] mx-auto border bg-white rounded-lg shadow-lg font-montserrat'>
      <div className="flex flex-wrap justify-between items-center gap-4 bg-[#EDF3F7]">
        <h1 className="font-bold text-2xl text-gray-700">Category List</h1>
        <button className="bg-blue-600 text-white w-[100px] h-8 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm font-semibold hover:bg-blue-700">
          Export <LuDownloadCloud />
        </button>
      </div>

      <div className="flex flex-wrap items-center mt-5 gap-4 justify-between">
        <div className="relative w-full sm:w-[25%]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <CiSearch />
          </span>
          <input
            type="text"
            placeholder="Search a list"
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4 text-md w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center cursor-pointer text-gray-600 hover:text-blue-600">
            Filter By <FaAngleDown className="ml-1" />
          </div>
          <div className="flex items-center cursor-pointer text-gray-600 hover:text-blue-600">
            Sort By <FaAngleDown className="ml-1" />
          </div>
        </div>
      </div>

      <table className='mt-8 text-sm table-auto w-full border-collapse'>
        <thead className='border-b-2 border-gray-300 text-gray-600 font-semibold'>
          <tr>
            <th className='px-4 py-3'>No</th>
            <th className='px-4 py-3'>Category</th>
            <th className='px-4 py-3'>Status</th>
            <th className='px-4 py-3'>Date Updated</th>
            <th className='px-4 py-3'>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((category, index) => (
            <tr key={index} className='text-center bg-white hover:bg-gray-100'>
              <td className='border px-4 py-2'>{indexOfFirstRecord + index + 1}</td>
              <td className='border px-4 py-2'>{category.category}</td>
              <td className='border px-4 py-2 capitalize'>{category.status}</td>
              <td className='border px-4 py-2'>{moment(category.date_update).format("MMM Do YYYY")}</td>
              <td className='border px-4 py-2'>
                <button
                  className="bg-blue-500 text-white rounded-md px-3 py-1 hover:bg-blue-700"
                  onClick={() => { onEditClick(category.category, category.status, category.id); }}
                  title="Edit Category"
                >
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex justify-center mt-6 text-lg items-center gap-4'>
        <button
          onClick={previousPage}
          disabled={currentPage === 1}
          className='disabled:opacity-50 cursor-pointer'
        >
          <MdNavigateBefore />
        </button>
        <span className='font-semibold'>{currentPage}</span>
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
