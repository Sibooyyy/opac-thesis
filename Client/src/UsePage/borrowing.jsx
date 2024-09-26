import { useContext, useState } from 'react';
import { AuthContext } from '../App'; 
import PopupForm from '../utils/popup-form';

const Borrow = () => {
    const { reservedBooks, removeReservedBook  } = useContext(AuthContext);
    const [showPopup, setShowPopup] = useState(false);

    const deleteBook = (bookId) => {
      removeReservedBook(bookId); // Use removeReservedBook function from context
  };
  const openPopup = () => {
    setShowPopup(true); // Set the state to show the popup
};
  const closePopup = () => {
    setShowPopup(false); // Set the state to hide the popup
};

    return (
        <div className='w-[100%] h-screen p-[60px] bg-[#0CA1E2] flex flex-col items-center'>
            <h1 className='font-poppins text-[white] text-[25px] font-bold'>Borrow Book</h1>
            {reservedBooks.length > 0 ? (
                <table className='min-w-full bg-white rounded-lg overflow-hidden shadow-lg text-center mt-5'>
                    <thead className='bg-[#161D6F] text-white'>
                        <tr>
                            <th className='py-3 px-5'>Title</th>
                            <th className='py-3 px-5'>Author</th>
                            <th className='py-3 px-5'>Accession Number</th>
                            <th className='py-3 px-5'>Publisher</th>
                            <th className='py-3 px-5'>ISBN/ISSN</th>
                            <th className='py-3 px-5'>Category</th>
                            <th className='py-3 px-1'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservedBooks.map((book, index) => (
                            <tr key={index} className='border-b text-center'>
                                <td className='py-2 px-5'>{book.title}</td>
                                <td className='py-2 px-5'>{book.author}</td>
                                <td className='py-2 px-5'>{book.accession_number}</td>
                                <td className='py-2 px-5'>{book.publisher}</td>
                                <td className='py-2 px-5'>{book.isbn_issn}</td>
                                <td className='py-2 px-5'>{book.category}</td>
                                <td className='py-2 px-1'>
                                    <button
                                        className='bg-red-500 text-white p-1 rounded mr-2'
                                        onClick={() => deleteBook(book.id)} 
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className='bg-green-500 text-white p-1 rounded'
                                        onClick={openPopup}
                                    >
                                        Borrow Book
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className='text-white mt-5'></p>
            )}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <PopupForm closePopup={closePopup} />
                </div>
            )}
        </div>
    );
};

export default Borrow;
