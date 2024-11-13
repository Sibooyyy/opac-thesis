import { useState } from 'react';
import axios from 'axios';
import { bookForm } from '../../utils/utils';

const CatInfo = ({ formData, setFormData, onFormSubmit }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInactiveConfirm, setShowInactiveConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const getCurrentTimestamp = () => {
    return new Date().toISOString();
  };

  const handleReset = () => {
    setFormData(bookForm()); 
    setError('');            
    setSuccess('');       
    setShowErrorModal(false);
    setShowSuccessModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category) {
      setError('Category name is required.');
      setShowErrorModal(true); 
      return;
    }

    if (!formData.status) {
      setError('Category status is required.');
      setShowErrorModal(true); 
      return;
    }
    if (formData.status === 'inactive') {
      setShowInactiveConfirm(true);
      return;
    }
    submitForm();
  };

  const submitForm = () => {
    const timestamp = getCurrentTimestamp();

    const url = formData.id
      ? 'http://localhost:8081/update/status'
      : 'http://localhost:8081/add/category';

    axios
      .post(url, { ...formData, date_update: timestamp })
      .then((res) => {
        const { status, message } = res.data;
        if (status) {
          setSuccess(message);
          onFormSubmit({ ...formData, date_update: timestamp });
          if (!formData.id) {
            setFormData(bookForm());
          }
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
            setSuccess('');
          }, 5000);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setError(message);
          setShowErrorModal(true); 
        }
      })
      .catch(() => {
        setError('An error occurred while submitting the form.');
        setShowErrorModal(true); 
      });
  };

  const confirmInactive = () => {
    setShowInactiveConfirm(false);
    submitForm();
  };

  const cancelInactive = () => {
    setShowInactiveConfirm(false);
  };
  return (
    <div className="border-2 border-[#0CA1E2] w-[40%] h-[400px] flex flex-col gap-1 bg-white mt-[7%] shadow-3xl rounded-md">
    <div className="h-[55px] bg-[#0CA1E2] pt-4 pl-3">
      <h1 className="font-montserrat text-white text-[15px]">Category Form</h1>
    </div>
    <form className="flex flex-col pl-3 gap-2 pt-3 font-montserrat" onSubmit={handleSubmit}>
      <div className="flex flex-col w-[70%]">
        <label className="font-montserrat text-[17px] font-md">Category Name</label>
        <input
          type="text"
          name="category"
          className="p-1 border border-black rounded-md drop-shadow-sm cursor-pointer w-[100%] font-montserrat"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>
      <h1 className="font-montserrat text-[17px] font-md pt-3">Status</h1>
      <div className="flex gap-1">
        <input
          type="radio"
          id="active"
          name="status"
          value="active"
          checked={formData.status === 'active'}
          onChange={handleChange}
          required
        />
        <label htmlFor="active">Active</label>
      </div>
      <div className="flex gap-1">
        <input
          type="radio"
          id="inactive"
          name="status"
          value="inactive"
          checked={formData.status === 'inactive'}
          onChange={handleChange}
          required
        />
        <label htmlFor="inactive">Inactive</label>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="mt-3 p-2 bg-[#0CA1E2] hover:bg-blue-500 text-white rounded-lg w-[75px] text-[14px]">
          Submit
        </button>
        <button type="reset" className="mt-3 p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg w-[75px] text-[14px]" onClick={handleReset}>
          Clear
        </button>
      </div>
    </form>

    {/* Success Modal */}
    {showSuccessModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-montserrat">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] text-center">
          <h2 className="text-2xl font-semibold text-green-500 mb-2">Success!</h2>
          <p className="text-gray-700">{success}</p>
        </div>
      </div>
    )}
    {/* Inactive Status Confirmation Modal */}
    {showInactiveConfirm && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-montserrat">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] text-center">
          <p className="text-gray-700">Are you sure you want to set the status to Inactive?</p>
          <div className="mt-4 flex justify-center gap-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmInactive}>
              Confirm
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={cancelInactive}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}

export default CatInfo