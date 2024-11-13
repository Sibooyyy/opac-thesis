import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment";
import { FaCheckCircle, FaEdit, FaEye, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa"; 
import { MdDelete } from "react-icons/md";
import { LuDownloadCloud } from "react-icons/lu";
import * as XLSX from 'xlsx'; // Import the xlsx library

const BookRecord = ({ books, onEditClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const recordsPerPage = 3;

  useEffect(() => {
    setData(books);
    setLoading(false);
  }, [books]);

  const handleDeleteClick = (bookId) => {
    setDeleteBookId(bookId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:8081/book/data/${deleteBookId}`)
      .then((response) => {
        setData(data.filter((book) => book.id !== deleteBookId));
        setShowDeleteConfirm(false);
        setSuccessMessage('Book deleted successfully!');
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          setSuccessMessage('');
          window.location.reload();
        }, 3000);
      })
      .catch((error) => {
        setError('Error deleting the book');
        console.error(error);
      });
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteBookId(null);
  };

  const handleViewClick = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key) {
      const isAscending = sortConfig.direction === "asc" ? 1 : -1;
      return a[sortConfig.key].localeCompare(b[sortConfig.key]) * isAscending;
    }
    return 0;
  });

  const filteredData = sortedData.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn_issn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.ddc_class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.accession_number.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Export to Excel function
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Books");
    XLSX.writeFile(workbook, "Books.xlsx");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="m-5 w-[80%] h-[800px] mt-16 rounded-2xl border bg-[#F6FBFD] font-montserrat shadow-3xl">
      <div className="flex justify-between h-[70px] items-center p-5 bg-[#EDF3F7] rounded-t-2xl">
        <h1 className="font-bold text-xl text-gray-900">Book List</h1>
        <button
          onClick={exportToExcel} // Call the export function on click
          className="bg-blue-600 text-white w-[150px] h-8 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm font-semibold hover:bg-blue-700"
        >
          Export Data <LuDownloadCloud />
        </button>
      </div>
      <div className="w-full sm:w-[30%] mb-3 p-5 mt-3">
        <input
          type="text"
          placeholder="Search a list"
          className="pl-10 pr-2 py-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="w-[95%] mx-auto font-montserrat text-sm sm:text-md cursor-pointer">
        <thead className="text-xs sm:text-sm md:text-md font-semibold h-[45px] text-gray-700">
          <tr className="border-b-2 border-gray-500">
            <th className="px-2 py-2 text-center">No</th>
            <th className="px-2 py-2 text-center cursor-pointer" onClick={() => handleSort("title")}>
              <div className="inline-flex items-center gap-1">
                Title {sortConfig.key === "title" ? (sortConfig.direction === "asc" ? <FaSortAmountDown /> : <FaSortAmountUp />) : <FaSortAmountDown />}
              </div>
            </th>
            <th className="px-2 py-2 text-center cursor-pointer" onClick={() => handleSort("category")}>
              <div className="inline-flex items-center gap-1">
                Category {sortConfig.key === "category" ? (sortConfig.direction === "asc" ? <FaSortAmountDown /> : <FaSortAmountUp />) : <FaSortAmountDown />}
              </div>
            </th>
            <th className="px-2 py-2 text-center cursor-pointer" onClick={() => handleSort("author")}>
              <div className="inline-flex items-center gap-1">
                Author {sortConfig.key === "author" ? (sortConfig.direction === "asc" ? <FaSortAmountDown /> : <FaSortAmountUp />) : <FaSortAmountDown />}
              </div>
            </th>
            <th className="px-2 py-2 text-center cursor-pointer" onClick={() => handleSort("accession_number")}>
              <div className="inline-flex items-center gap-1">
                Accession Number {sortConfig.key === "accession_number" ? (sortConfig.direction === "asc" ? <FaSortAmountDown /> : <FaSortAmountUp />) : <FaSortAmountDown />}
              </div>
            </th>
            <th className="px-2 py-2 text-center">Status</th>
            <th className="px-2 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((book, index) => (
            <tr key={book.accession_number} className="text-center hover:bg-gray-200">
              <td className="px-2 py-2 border-b-2 text-center">{indexOfFirstRecord + index + 1}</td>
              <td className="px-2 py-2 border-b-2 text-center">{book.title}</td>
              <td className="px-2 py-2 border-b-2 text-center">{book.category}</td>
              <td className="px-2 py-2 border-b-2 text-center">{book.author}</td>
              <td className="px-2 py-2 border-b-2 text-center">{book.accession_number}</td>
              <td
                className={`px-2 py-2 my-4 text-center ${
                  book.status.toLowerCase() === "active" ? "bg-green-400 text-black" : "bg-red-100 text-red-800"
                } rounded-3xl w-[120px] border-b-2`}
              >
                {book.status}
              </td>
              <td className="px-2 py-2 border-b-2 text-center">
                <div className="flex gap-1 justify-center">
                  <button
                    className="bg-green-500 text-white rounded-md px-2 py-1 hover:bg-green-700"
                    onClick={() => handleViewClick(book)}
                    title="View Book Details"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="bg-blue-500 text-white rounded-md px-2 py-1 hover:bg-blue-700"
                    onClick={() => onEditClick(book)}
                    title="Edit Book Details"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white rounded-md px-2 py-1 hover:bg-red-700"
                    onClick={() => handleDeleteClick(book.id)}
                    title="Delete Book"
                  >
                    <MdDelete />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-end mt-[400px] items-center gap-1 pr-10">
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

      {/* Modals for View, Delete, and Success Notifications */}
      {showModal && selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Book Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-left text-gray-700">
              <div className="font-medium">Title:</div>
              <div className="text-gray-900">{selectedBook.title}</div>
              <div className="font-medium">Category:</div>
              <div className="text-gray-900">{selectedBook.category}</div>
              <div className="font-medium">ISBN/ISSN:</div>
              <div className="text-gray-900">{selectedBook.isbn_issn}</div>
              <div className="font-medium">Author:</div>
              <div className="text-gray-900">{selectedBook.author}</div>
              <div className="font-medium">Subject:</div>
              <div className="text-gray-900">{selectedBook.subject}</div>
              <div className="font-medium">DDC Classification:</div>
              <div className="text-gray-900">{selectedBook.ddc_class}</div>
              <div className="font-medium">Accession Number:</div>
              <div className="text-gray-900">{selectedBook.accession_number}</div>
              <div className="font-medium">Publisher:</div>
              <div className="text-gray-900">{selectedBook.publisher}</div>
              <div className="font-medium">Tags:</div>
              <div className="text-gray-900">{selectedBook.mark_tags}</div>
              <div className="font-medium">Date Published:</div>
              <div className="text-gray-900">
                {moment(selectedBook.date_published).format("MMM Do, YYYY")}
              </div>
            </div>
            <div className="text-center mt-4">
              <button
                onClick={closeModal}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4 text-center">
            <p className="text-gray-700">Are you sure you want to delete this book?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmDelete}>Delete</button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4 text-center">
            <FaCheckCircle className="h-10 w-10 text-green-500 mx-auto" />
            <p className="text-gray-700 mt-3">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRecord;
