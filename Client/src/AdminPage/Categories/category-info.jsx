import { useState, useEffect } from "react";
import axios from "axios";
import moment from 'moment';
import { bookForm } from "../../utils/utils";

const CategoryInfo = ({ selectedCategory, onUpdateCategories  }) => {
    const [formData, setFormData] = useState(bookForm());
    const [status, setStatus] = useState('');


  useEffect(() => {
      if (selectedCategory) {
        setFormData({
          category: selectedCategory.category || '',
          status: selectedCategory.status || '',
        });
        setStatus(selectedCategory.status || '');
      }
  }, [selectedCategory]);
    
  const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
  const handleSubmit = (e) => {
        e.preventDefault();
        
  const updatedData = {
        accession_number: selectedCategory?.accession_number || '',
        category: formData.category,
        status,
        date_update: moment().format('YYYY-MM-DD HH:mm:ss'),
      };

  axios.post('http://localhost:8081/update/status', updatedData)
      .then(response => {
        onUpdateCategories(updatedData); 
        setFormData(bookForm()); 
        setStatus(''); 
        alert(response.data.status ? 'Status updated successfully' : 'Failed to update status');
      })
      .catch(() => {
        alert('Error updating status');
      });
  };
  


  return (
    <>
        <div className='border-2 border-[#0CA1E2] w-[30%] h-[50%] flex flex-col gap-3 bg-white'>
            <div className='h-[55px] bg-[#0CA1E2] pt-5 pl-4 '>
                <h1 className='font-poppins text-white text-[15px]'>Category Status</h1>
            </div>
            <form className='flex flex-col pl-4 gap-3' onSubmit={handleSubmit}>
                <div className='flex flex-col w-[70%]'>
                    <label className='font-poppins text-[15px] font-semibold'>Category Name</label>
                    <input type="text" className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer'  name="category" value={formData.category} onChange={handleChange} />
                </div>
                <div>
                    <h1 className='font-poppins text-[15px] font-semibold'>Status</h1>
                    <div className='flex gap-2'>
                        <input type="radio" id="active" name="status" value="active" checked={status === 'active'} onChange={() => setStatus('active')} />
                        <label>Active</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type="radio" id="active" name="status" value="inactive"  checked={status === 'inactive'}   onChange={() => setStatus('inactive')}/>
                        <label>Inactive</label>
                    </div>
                </div>
                <div className='flex self-end mr-5'>
                <button className='bg-[#0CA1E2] text-white py-3 w-[90px] rounded-lg cursor-pointer font-montserrat text-[12px]' type='submit'>Submit</button>
                 </div>
            </form>
        </div>
    </>
  )
}

export default CategoryInfo