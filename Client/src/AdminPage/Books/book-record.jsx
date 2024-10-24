import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa"; 
import { MdDelete } from "react-icons/md";
import { FaEdit, FaEye } from "react-icons/fa";

const BookRecord = ({ books, onEditClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 
  const [deleteBookId, setDeleteBookId] = useState(null); // Use deleteBookId instead of deleteAuthor
  const [successMessage, setSuccessMessage] = useState(''); 
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(''); 

  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    setData(books);
    setLoading(false);
  }, [books]);

  const handleDeleteClick = (bookId) => {
    setDeleteBookId(bookId); // Store the book ID to be deleted
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:8081/book/data/${deleteBookId}`) // Use book ID in the delete request
      .then((response) => {
        setData(data.filter((book) => book.id !== deleteBookId)); // Filter out deleted book by ID
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

  // Filter data based on search term
  const filteredData = data.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn_issn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.ddc_class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.accession_number.toLowerCase().includes(searchTerm.toLowerCase()) 
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
    <div className='w-[70%] font-montserrat '>
      <div className='flex flex-row items-center gap-3 mb-3 font-montserrat'>
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
      <table className='w-full font-montserrat text-[15px]'>
        <thead className='font-poppins text-[15px] border-2 h-[45px] bg-[#F2F2F2] py-2'>
          <tr className="text-center">
            <th className='border border-r-2 w-[80px]'>No</th>
            <th className='border border-r-2 w-[150px]'>Title</th>
            <th className='border border-r-2 w-[150px]'>Category</th>
            <th className='border border-r-2 w-[150px]'>Author</th>
            <th className='border border-r-2 w-[150px]'>Subject</th>
            <th className='border border-r-2 w-[170px]'>DDC Classification</th>
            <th className='border border-r-2 w-[150px]'>Status</th>
            <th className='border border-r-2 w-[150px]'>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((book, index) => (
            <>
              <tr key={book.accession_number} className='text-center hover:bg-gray-100 bg-white'>
                <td className='border border-r-2'>{indexOfFirstRecord + index + 1}</td>
                <td className='border border-r-2'>{book.title}</td>
                <td className='border border-r-2'>{book.category}</td>
                <td className='border border-r-2'>{book.author}</td>
                <td className='border border-r-2'>{book.subject}</td>
                <td className='border border-r-2'>{book.ddc_class}</td>
                <td className='border border-r-2'>{book.status}</td>
                <td className='border border-r-2 py-1'>
                  <div className="flex gap-1 text-center pl-1 pr-1 justify-center">
                    <button 
                      className="bg-green-500 text-white rounded-md px-3 py-1 font-montserrat text-[14px] hover:bg-green-700" 
                      onClick={() => handleViewClick(book)} title="View Book Details">
                      <FaEye />
                    </button>
                    <button 
                      className="bg-blue-500 text-white rounded-md px-3 py-1 font-montserrat text-[14px] hover:bg-blue-700" 
                      onClick={() => onEditClick(book)} title="Edit Book Details" >
                      <FaEdit />
                    </button>
                    <button 
                      className="bg-red-500 text-white rounded-md px-3 py-1 font-montserrat text-[14px] hover:bg-red-700" 
                      onClick={() => handleDeleteClick(book.id)} title="Delete Book">
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            </>
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
      {showModal && selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[600px] max-w-full">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Book Details</h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-left text-gray-700">
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
            <div className="text-center mt-6">
              <button
                onClick={closeModal}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full transition duration-300 ease-in-out"
              >
                Close
              </button>
            </div>
          </div>
      </div>
    )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-montserrat">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] text-center">
            <p className="text-gray-700">Are you sure you want to delete this book?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmDelete}>Delete</button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-montserrat">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] text-center font-montserrat">
            <FaCheckCircle className="h-12 w-12 text-green-500 mx-auto" /> 
            <p className="text-gray-700 mt-3">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRecord;
