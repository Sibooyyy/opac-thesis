import { useState, useEffect } from 'react';
import Navbar from '../../Components/navigation';
import BooksRecords from './book-rec.jsx';
import BookInfos from './book-infos.jsx';
import { FaBookOpen } from "react-icons/fa";
import axios from 'axios';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8081/book/data')
      .then(response => {
        if (response.data.status) {
          setBooks(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error fetching books', error);
      });
  }, [update]);

  const handleEditClick = (book) => {
    setSelectedBook(book);
  };

  const handleFormSubmit = (updatedBook) => {
    const endpoint = selectedBook ? 'http://localhost:8081/edit/books' : 'http://localhost:8081/add/book';
  
    axios.post(endpoint, updatedBook)
      .then(response => {
        if (response.data.status) {
          if (selectedBook) {
            setBooks((prevBooks) =>
              prevBooks.map((book) =>
                book.accession_number === updatedBook.accession_number ? updatedBook : book
              )
            );
          } else {
            setBooks((prevBooks) => [...prevBooks, updatedBook]);
          }
          setUpdate(!update);
        }
      })
      .catch(error => {
        console.error('Error submitting book data', error);
      });
  
    setSelectedBook(null);
  };

  const handleDeleteSuccess = () => {
    setUpdate(!update);
  };

  return (
    <>
      
      <div className='bg-[#EFF6FC] min-h-screen '>
        <Navbar />
        <div div className='flex justify-between w-[100%] p-[30px] gap-4'>
        <BookInfos selectedBook={selectedBook} onFormSubmit={handleFormSubmit} />
        <BooksRecords books={books} onEditClick={handleEditClick} onDeleteSuccess={handleDeleteSuccess} />
        </div>
      </div>
    </>
  );
};


export default Books;
