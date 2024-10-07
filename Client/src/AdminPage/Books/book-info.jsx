import { useState, useEffect } from 'react';
import axios from 'axios';
import { bookForm } from '../../utils/utils';
import { FaCheckCircle } from 'react-icons/fa'; 

const BookInfo = ({ selectedBook, onFormSubmit }) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [newTag, setNewTag] = useState(""); 
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(bookForm());
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [successMessage, setSuccessMessage] = useState('');

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
        const res = await axios.get('http://localhost:8081/get/tag');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const requiredFields = ['title', 'category', 'isbn_issn', 'author', 'publisher', 'accession_number', 'date_published', 'status'];
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
      resetForm();
      setSuccessMessage('');
    }, 3000);
    window.scrollTo({ top: 0, behavior:'smooth' });
  }; 

  const addNewTag = async () => {
    if (newTag.trim()) {
      try {
        const res = await axios.post('http://localhost:8081/add/tag', { mark_tags: newTag });
        if (res.data.status) {
          setTags(prevTags => [...prevTags, { mark_tags: newTag }]);
          setFormData({ ...formData, mark_tags: [...(formData.mark_tags || []), newTag] });
          setNewTag(''); 
        } else {
          alert('Failed to add tag');
        }
      } catch (error) {
        console.error('Error adding tag:', error);
      }
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    resetForm();
  }

  const handleTagChange = (e) => {
    const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, mark_tags: selectedTags }); 
  };

  const handleAccessionNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateAccessionNumber = () => {
    const uniqueNumber = `ACC-${Date.now()}`;
    setFormData({ ...formData, accession_number: uniqueNumber });
  };

  const filteredTags = tags.filter(tag => tag.mark_tags.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
        <div className='border-2 border-[#C2FFB8] h-[900px] w-[35%] flex flex-col gap-1 bg-white'>
          <div className='bg-[#C2FFB8] pt-5 pl-4 h-[55px] font-poppins'>
            <h1>Add Book Information</h1>
          </div>
          <form className='pl-[10px] flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='flex flex-col w-[400px]'>
              <label className='font-poppins text-[17px] font-semibold'>Title</label>
              <input 
                className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer font-poppins' 
                value={formData.title} 
                onChange={handleChange} 
                type="text" 
                name="title" 
                required 
              />
            </div>
            <div className='flex flex-col w-[70%]'>
              <label className='font-poppins text-[17px] font-semibold'>Author</label>
              <input 
                className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer font-poppins' 
                value={formData.author} 
                onChange={handleChange} 
                type="text" 
                name="author" 
                required 
              />
            </div>
            <div className='flex flex-col w-[70%]'>
              <label className='font-poppins text-[17px] font-semibold'>Subject</label>
              <input 
                className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer font-poppins' 
                value={formData.subject} 
                onChange={handleChange} 
                type="text" 
                name="subject" 
                required 
              />
            </div>
            <div className='flex flex-col w-[70%]'>
              <label className='font-poppins text-[17px] font-semibold'>DDC Classification</label>
              <input 
                className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer font-poppins' 
                value={formData.ddc_class} 
                onChange={handleChange} 
                type="text" 
                name="ddc_class" 
                required 
              />
            </div>
            <div className='flex flex-col w-[70%]'>
              <label className='font-poppins text-[17px] font-semibold'>Publisher</label>
              <input 
                className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer font-poppins' 
                value={formData.publisher} 
                onChange={handleChange} 
                type="text" 
                name="publisher" 
                required 
              />
            </div>
            <div className='flex flex-row gap-3'>
              <div className='flex flex-col'>
                <label className='font-poppins text-[17px] font-semibold'>Location</label>
                <select 
                  className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer font-poppins' 
                  value={formData.category} 
                  onChange={handleChange} 
                  name="category" 
                  required 
                >
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
                <input 
                  className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer font-poppins' 
                  value={formData.isbn_issn} 
                  onChange={handleChange} 
                  type="text" 
                  name="isbn_issn" 
                  required 
                />
              </div>
            </div>
            <div className='flex flex-row gap-2'>
              <div className='flex flex-col'>
                <label className='font-poppins text-[17px] font-semibold'>Accession Number</label>
                <div className='flex'>
                  <input 
                    className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer font-poppins w-[70%]' 
                    value={formData.accession_number} 
                    onChange={handleAccessionNumberChange} 
                    type="text" 
                    name="accession_number" 
                    required 
                  />
                  <button 
                    type="button" 
                    className='bg-[#0CA1E2] text-[white] py-1 px-3 ml-2 rounded-lg cursor-pointer text-[12px]' 
                    onClick={generateAccessionNumber}
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div className='flex flex-col pr-5'>
                <label className='font-poppins text-[17px] font-semibold'>Date Published</label>
                <input 
                  className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' 
                  value={formData.date_published} 
                  onChange={handleChange} 
                  type="date" 
                  name="date_published" 
                  required 
                />
              </div>
            </div>

            {/* Status Radio Buttons */}
            <div className='flex flex-col w-[400px]'>
              <label className='font-poppins text-[17px] font-semibold'>Status</label>
              <div className='flex gap-1 font-poppins'>
                <label>
                  <input 
                    type="radio" 
                    name="status" 
                    value="active" 
                    checked={formData.status === 'active'} 
                    onChange={handleChange} 
                    required 
                  />
                  Active
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="status" 
                    value="inactive" 
                    checked={formData.status === 'inactive'} 
                    onChange={handleChange} 
                    required 
                  />
                  Inactive
                </label>
              </div>
            </div>

            {/* Tags */}
            <div className='flex flex-col w-[400px]'>
              <label className='font-poppins text-[17px] font-semibold'>Tags</label>
              <input 
                className='p-1 mb-2 border border-black rounded-md drop-shadow-sm cursor-pointer' 
                type='text' 
                placeholder='Search tags...' 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              <select 
                className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' 
                value={formData.mark_tags || []} 
                onChange={handleTagChange} 
                name="mark_tags" 
                multiple
              >
                {filteredTags.map((tag, index) => (
                  <option key={`${tag.id}-${index}`} value={tag.mark_tags}>
                    {tag.mark_tags}
                  </option>
                ))}
              </select>
              <div className='mt-2'>
                <input 
                  className='p-1 mb-2 border border-black rounded-md drop-shadow-sm cursor-pointer' 
                  type='text' 
                  placeholder='New tag...' 
                  value={newTag} 
                  onChange={(e) => setNewTag(e.target.value)} 
                />
                <button 
                  type='button' 
                  className='bg-[#0CA1E2] text-[white] py-1 px-3 ml-2 rounded-lg cursor-pointer text-[12px]' 
                  onClick={addNewTag}
                >
                  Add New Tag
                </button>
              </div>
            </div>

            <div className="flex gap-2 self-end mr-10 mt-3">
              <button className="bg-[#0CA1E2] text-[white] py-2 w-[75px] rounded-lg cursor-pointer font-poppins text-[14px]" type="submit">Submit</button>
              <button className="bg-gray-500 text-[white] py-2 w-[75px] rounded-lg cursor-pointer font-poppins text-[14px]" type="submit" onClick={handleClear}>Clear</button>
            </div>
          </form>

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] text-center">
                <FaCheckCircle className="h-12 w-12 text-green-500 mx-auto" /> 
                <p className="text-gray-700 mt-3">{successMessage}</p>
              </div>
            </div>
          )}
        </div>
  );
}

export default BookInfo;
