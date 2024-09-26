import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment";



const BookRecord = ({ books, onEditClick  }) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(books); // No filtering, show all books with their statuses
  }, [books]);

const handleDelete = (author) => {
  if (window.confirm(`Are you sure you want to delete book with ${author}?`)) {
    axios.delete(`http://localhost:8081/book/data/${author}`)
      .then(response => {
        console.log(response.data);
        setData(data.filter(book => book.author !== author)); 
      })
      .catch(error => {
        console.error(error);
      });
  }
};
    

  return (
    <div className='w-[68%]'>
        <table className='w-full'>
          <thead className='font-poppins text-[14px] border-2 h-[45px] bg-[#F2F2F2] py-2'>
              <tr>
                  <th className='border border-r-2'>No</th>
                  <th className='border border-r-2 w-[150px]'>Title</th>
                  <th className='border border-r-2 w-[150px]'>Category</th>
                  <th className='border border-r-2 w-[150px]'>ISBN/ISSN</th>
                  <th className='border border-r-2 w-[150px]'>Author</th>
                  <th className='border border-r-2 w-[150px]' >Publisher</th>
                  <th className='border border-r-2 w-[150px]' >Accession Number</th>
                  <th className='border border-r-2 w-[150px]' >Date Published</th>
                  <th className='border border-r-2 w-[150px]' >Status</th>
                  <th className=''>Action</th>
              </tr>
          </thead>
          <tbody>
            {data.map((book, index) => (
              <tr key={book.accession_number} className='text-center'>
                <td className='border border-r-2'>{index + 1}</td>
                <td className='border border-r-2'>{book.title}</td>
                <td className='border border-r-2'>{book.category}</td>
                <td className='border border-r-2'>{book.isbn_issn}</td>
                <td className='border border-r-2'>{book.author}</td>
                <td className='border border-r-2'>{book.publisher}</td>
                <td className='border border-r-2'>{book.accession_number}</td>
                <td className='border border-r-2'>{moment(book.date_published).format("MMM Do YYYY")}</td>
                <td className='border border-r-2'>{book.status}</td>
                <td className='border border-r-2'>
                  <div className="flex gap-2 text-center pl-1">
                    <span className="border bg-[#003687] text-white rounded-md px-3 font-montserrat text-[15px] cursor-pointer" onClick={() => onEditClick(book)}>Edit</span>
                    <span className="border bg-[#CC0000] text-white rounded-md px-3 font-montserrat text-[15px] cursor-pointer" onClick={() => handleDelete(book.author)}>Delete</span>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
        </table>
    </div>
  )
}

export default BookRecord

