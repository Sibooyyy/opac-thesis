import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { bookForm } from '../../Utils/utils'



const BookInfo = () => {


    const [formData, setFormData] = useState(bookForm());
    const [errors, setErrors] = useState({});
    const [success, successPopUp] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        const { title, category, isbn_issn, author, publisher, accession_number, date_published } = formData;
        if (!title || !category || !isbn_issn || !author || !publisher || !accession_number || !date_published) {
            setErrors({ message: "Please fill out all fields" });
            return;
        }
        handleAddBook();
    }
    const handleAddBook = () => {
        setLoading(true);
        const url = 'http://localhost:8081/add/book';
        axios.post(url, formData).then((res) => {
            const { status, message } = res.data;
            if (status) {
                successPopUp(true);
                setLoading(false);
                updateBookList();
            } else {
              setErrors({ message });
              setLoading(false);
            }
          })
          .catch((error) => {
            setErrors(error);
            setLoading(false);
          });
      };

  return (
        <div className='border-2 border-[#C2FFB8] h-[80%] w-[40%] flex flex-col gap-2'> 
            <div className='bg-[#C2FFB8] pt-5 pl-4 h-[55px]'>
              <h1>Book Information</h1>
            </div>
            <form className='pl-[20px] flex flex-col gap-3' onSubmit={handleSubmit}>
              <div className='flex flex-col w-[400px]'>
                  <label className='font-poppins text-[17px] font-semibold'>Title</label>
                  <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' value={formData.title} onChange={handleChange} type="text" name="title"/>
              </div>
              <div className='flex flex-row gap-4'>
                  <div className='flex flex-col'>
                      <label className='font-poppins text-[17px] font-semibold'>Category</label>
                      <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' value={formData.category} onChange={handleChange} type="text" name="category" />
                  </div>
                  <div className='flex flex-col'>
                      <label className='font-poppins text-[17px] font-semibold'>ISBN/ISSN</label>
                      <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' value={formData.isbn_issn} onChange={handleChange} type="text" name="isbn_issn" />
                  </div>
              </div>
              <div className='flex flex-col w-[400px]'>
                  <label className='font-poppins text-[17px] font-semibold'>Author</label>
                  <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' value={formData.author} onChange={handleChange} type="text" name="author" />
              </div>
              <div className='flex flex-col w-[400px]'>
                  <label className='font-poppins text-[17px] font-semibold'>Publisher</label>
                  <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' value={formData.publisher} onChange={handleChange} type="text" name="publisher" id="" />
              </div>
              <div className='flex flex-row gap-3'>
                  <div className='flex flex-col'>
                      <label className='font-poppins text-[17px] font-semibold'>Accession Number</label>
                      <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' value={formData.accession_number} onChange={handleChange} type="text" name="accession_number" id="" />
                  </div>
                  <div className='flex flex-col'>
                      <label className='font-poppins text-[17px] font-semibold'>Date Published</label>
                      <input className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer' value={formData.date_published} onChange={handleChange} type="date" name="date_published" id="" />
                  </div>
              </div>
              <div className="flex self-end mr-10 mt-5">
            <button className="bg-[#0CA1E2] text-[white] py-3 w-[90px] rounded-lg cursor-pointer font-montserrat text-[12px]" type="submit">Add</button>
                </div>
            </form>
                {success ? (
                <div className="text-green-600">
                    <p>Book added successfully!</p>
                </div>
                ) : (
                <div className="text-red-600">
                    {errors.message && <p>{errors.message}</p>}
                </div>
                )}
        </div>
  )
}

export default BookInfo