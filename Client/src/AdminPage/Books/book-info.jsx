import { useState, useEffect } from 'react';
import axios from 'axios';
import { bookForm } from '../../utils/utils';
import { FaCheckCircle } from 'react-icons/fa'; // Importing the checkmark icon

const BookInfo = ({ selectedBook, onFormSubmit }) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]); 
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(bookForm());
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:8081/get/categories');
        if (res.data.status && Array.isArray(res.data.data)) {
          const activeCategories = res.data.data.filter(cat => cat.status !== 'inactive');
          setCategories(activeCategories);
        } else {
          setError("No categories found");
        }
      } catch (err) {
        setError("Error fetching categories.");
        console.error("Error:", err);
      }
    };

    const fetchTags = async () => {
      try {
        const res = await axios.get('http://localhost:8081/get/tags'); 
        if (res.data.status && Array.isArray(res.data.data)) {
          setTags(res.data.data);
        } else {
          setError("No tags found");
        }
      } catch (err) {
        setError("Error fetching tags.");
        console.error("Error:", err);
      }
    };

    fetchCategories();
    fetchTags();

    if (selectedBook) {
      setFormData({
        ...selectedBook,
        date_published: selectedBook.date_published ? selectedBook.date_published.split('T')[0] : '',
      });
    } else {
      resetForm();
    }
  }, [selectedBook]);

  const resetForm = () => {
    setFormData(bookForm());
    setError(null);
    setShowSuccessModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagChange = (e) => {
    const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, tags: selectedTags });
  };

  const handleAccessionNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateAccessionNumber = () => {
    const uniqueNumber = `ACC-${Date.now()}`;
    setFormData({ ...formData, accession_number: uniqueNumber });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const requiredFields = ['title', 'category', 'isbn_issn', 'author', 'publisher', 'accession_number', 'date_published'];
    const hasEmptyFields = requiredFields.some(field => !formData[field]);

    if (hasEmptyFields) {
      setError({ message: 'Please fill out all fields' });
      return;
    }
    onFormSubmit(formData);
    setSuccessMessage('Book information added successfully!');
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setSuccessMessage('');
      window.location.reload()
    }, 3000);
  };

  return (
    <div className='border-2 border-[#C2FFB8] h-[100%] w-[40%] flex flex-col gap-2 bg-white'>
      <div className='bg-[#C2FFB8] pt-5 pl-4 h-[55px] font-poppins'>
        <h1>Add Book Information</h1>
      </div>
      <form className='pl-[20px] flex flex-col gap-3' onSubmit={handleSubmit}>
        <div className='flex flex-col w-[400px]'>
          <label className='font-poppins text-[17px] font-semibold'>Title</label>
          <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer font-poppins' value={formData.title} onChange={handleChange} type="text" name="title" />
        </div>
        <div className='flex flex-row gap-4'>
          <div className='flex flex-col'>
            <label className='font-poppins text-[17px] font-semibold'>Category</label>
            <select className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer font-poppins' value={formData.category} onChange={handleChange} name="category">
              <option value="">Select a Category</option>
              {categories.map((cat, index) => (
                <option key={cat.id || index} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>
          <div className='flex flex-col'>
            <label className='font-poppins text-[17px] font-semibold'>ISBN/ISSN</label>
            <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer font-poppins' value={formData.isbn_issn} onChange={handleChange} type="text" name="isbn_issn" />
          </div>
        </div>
        <div className='flex flex-col w-[70%]'>
          <label className='font-poppins text-[17px] font-semibold'>Author</label>
          <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer font-poppins' value={formData.author} onChange={handleChange} type="text" name="author" />
        </div>
        <div className='flex flex-col w-[70%]'>
          <label className='font-poppins text-[17px] font-semibold'>Publisher</label>
          <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer font-poppins ' value={formData.publisher} onChange={handleChange} type="text" name="publisher" />
        </div>
        <div className='flex flex-row gap-3'>
          <div className='flex flex-col'>
            <label className='font-poppins text-[17px] font-semibold'>Accession Number</label>
            <div className='flex'>
              <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer font-poppins w-[70%]' value={formData.accession_number} onChange={handleAccessionNumberChange} type="text" name="accession_number" />
              <button type="button" className='bg-[#0CA1E2] text-[white] py-1 px-3 ml-2 rounded-lg cursor-pointer text-[12px]' onClick={generateAccessionNumber}>
                Generate
              </button>
            </div>
          </div>
          <div className='flex flex-col pr-5'>
            <label className='font-poppins text-[17px] font-semibold'>Date Published</label>
            <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' value={formData.date_published} onChange={handleChange} type="date" name="date_published" />
          </div>
        </div>
        <div className='flex flex-col w-[400px]'>
          <label className='font-poppins text-[17px] font-semibold'>Tags</label>
          <select className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' value={formData.tags || []} onChange={handleTagChange} name="tags" multiple>
            {tags.map((tag, index) => (
              <option key={tag.id || index} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex self-end mr-10 mt-5">
          <button className="bg-[#0CA1E2] text-[white] py-3 w-[80px] rounded-lg cursor-pointer font-poppins text-[12px]" type="submit">Add</button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] text-center">
            <FaCheckCircle className="h-12 w-12 text-green-500 mx-auto" /> {/* React Icon used here */}
            <p className="text-gray-700 mt-3">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookInfo;
