import { useState } from 'react';
import axios from 'axios';
import { bookForm } from '../../utils/utils';

const CategoryInfo = ({ formData, setFormData, onFormSubmit }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); 
  };

  const getCurrentTimestamp = () => {
    return new Date().toISOString(); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for category and status
    if (!formData.category) {
      setError('Category name is required.');
      return;
    }

    if (!formData.status) {
      setError('Category status is required.');
      return;
    }

    // Get the current timestamp for the update
    const timestamp = getCurrentTimestamp();

    const url = formData.id 
      ? 'http://localhost:8081/update/status'  // Update if id exists
      : 'http://localhost:8081/add/category';  // Add new category if no id

    axios
      .post(url, { ...formData, date_update: timestamp })  // Include timestamp in the request
      .then((res) => {
        const { status, message } = res.data;
        if (status) {
          setSuccess(message);
          onFormSubmit({ ...formData, date_update: timestamp });
          if (!formData.id) {
            setFormData(bookForm()); 
          }
          setTimeout(() => {
            setSuccess('');
            }, 3000);
        } else {
          setError(message);
        }
      })
      .catch(() => {
        setError('An error occurred while submitting the form.');
      });
  };


  return (
    <div className="border-2 border-[#0CA1E2] w-[30%] h-[50%] flex flex-col gap-3 bg-white">
      <div className="h-[55px] bg-[#0CA1E2] pt-5 pl-4">
        <h1 className="font-poppins text-white text-[15px]">Category Status</h1>
      </div>
      <form className="flex flex-col pl-4 gap-3" onSubmit={handleSubmit}>
        <div className="flex flex-col w-[70%]">
          <label className="font-poppins text-[15px] font-semibold">Category Name</label>
          <input
            type="text"
            name="category" 
            className="p-1 border border-black rounded-md drop-shadow-sm cursor-pointer w-[80%]"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        <h1 className="font-poppins text-[15px] font-semibold">Status</h1>
        <div className="flex gap-2">
          <input
            type="radio"
            id="active"
            name="status" 
            value="active"
            checked={formData.status === 'active'}
            onChange={handleChange}
          />
          <label htmlFor="active">Active</label>
        </div>
        <div className="flex gap-2">
          <input
            type="radio"
            id="inactive"
            name="status" 
            value="inactive"
            checked={formData.status === 'inactive'}
            onChange={handleChange}
          />
          <label htmlFor="inactive">Inactive</label>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded w-[15%]">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CategoryInfo;
