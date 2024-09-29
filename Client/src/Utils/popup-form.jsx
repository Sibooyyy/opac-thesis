import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../App";
import axios from 'axios';

function PopupForm({ closePopup }) {
  const { user, reservedBooks, triggerBookingSuccess, setReservedBooks } = useContext(AuthContext);
  const [pickupDate, setPickupDate] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); 

  useEffect(() => {
    const getCurrentDateInGMT8 = () => {
      const options = {
        timeZone: "Asia/Singapore",
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      };
      const formatter = new Intl.DateTimeFormat('en-GB', options);
      const formattedDate = formatter.format(new Date());
      const [day, month, year] = formattedDate.split('/');
      return `${month}-${day}-${year}`;
    };

    setCurrentDate(getCurrentDateInGMT8());
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!pickupDate) {
      alert("Please select a pickup date.");
      return;
    }

    setIsLoading(true); // Start loading animation

    try {
      const response = await axios.post('http://localhost:8081/user/book', {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        designation: user.designation || '',
        idNumber: user.idNumber,
        pickup_date: pickupDate,
        booking_date: new Date().toISOString().split('T')[0],
        contactNumber: user.contactNumber,
        title: reservedBooks.map(book => book.title).join(', '),
        author: reservedBooks.map(book => book.author).join(', '),
        isbn_issn: reservedBooks.map(book => book.isbn_issn).join(', ')
      });
      if (response.data.status) {
        localStorage.setItem(`bookedBooks_${user.id}`, JSON.stringify(reservedBooks));
        setReservedBooks([]);
        localStorage.removeItem(`reservedBooks_${user.id}`);
        triggerBookingSuccess();
        setTimeout(() => {
          setShowSuccessMessage(true); 
          setIsLoading(false); 
          setTimeout(() => {
            setShowSuccessMessage(false); 
            closePopup();
          }, 3000); 
        }, 500);
      } else {
        alert("Failed to borrow book.");
        setIsLoading(false); 
      }
    } catch (error) {
      console.error("Error booking the book:", error);
      alert("Error occurred. Please try again.");
      setIsLoading(false); // Stop loading animation in case of error
    }
  };

  return (
    <div className="bg-white border border-solid border-gray-200 w-[90%] md:w-[60%] lg:w-[40%] text-center p-8 rounded-lg shadow-lg mx-auto relative">
      <h1 className="font-poppins font-bold text-2xl text-[#161D6F] mb-6">Borrow Book Form</h1>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
        </div>
      )}
      
      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Your booking has been successfully processed.</span>
        </div>
      )}
      
      <div className="flex flex-col items-start mb-4">
        <label className="font-poppins font-semibold text-lg">Current Date:</label>
        <p className="mt-1 text-sm text-gray-700">{currentDate}</p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleBooking}>
        <div className="flex flex-col items-start">
          <label className="font-poppins font-semibold text-lg">Name:</label>
          <p className="mt-1 text-sm text-gray-700">{user.firstname} {user.lastname}</p>
        </div>
        <div className="flex flex-col items-start">
          <label className="font-poppins font-semibold text-lg">ID Number:</label>
          <p className="mt-1 text-sm text-gray-700">{user.idNumber}</p>
        </div>
        <div className="flex flex-col items-start">
          <label className="font-poppins font-semibold text-lg">Contact:</label>
          <p className="mt-1 text-sm text-gray-700">{user.contactNumber}</p>
        </div>
        <div className="flex flex-col items-start">
          <label className="font-poppins font-semibold text-lg">Pick-up Date:</label>
          <input
            className="mt-1 p-2 border border-gray-300 rounded-md w-full md:w-3/4 lg:w-1/2 cursor-pointer"
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            required
          />
        </div>

        {reservedBooks.length > 0 ? (
          <div className="mt-5 w-full">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg text-center">
              <thead className="bg-[#161D6F] text-white">
                <tr>
                  <th className="py-3 px-5">No</th>
                  <th className="py-3 px-5">Title</th>
                  <th className="py-3 px-5">Author</th>
                  <th className="py-3 px-5">Category</th>
                </tr>
              </thead>
              <tbody>
                {reservedBooks.map((book, index) => (
                  <tr key={index} className="border-b text-center my-3">
                    <td className="py-2 px-5">{index + 1}</td>
                    <td className="py-2 px-5">{book.title}</td>
                    <td className="py-2 px-5">{book.author}</td>
                    <td className="py-2 px-5">{book.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-700 mt-4">No books reserved yet.</p>
        )}

        <div className="mt-5 p-4 bg-[#EBEBEB] rounded-lg text-left">
          <span className="font-semibold text-red-500">Note:</span>
          <p className="text-sm mt-1">
            If a reserved book is not claimed by the borrowing date, it will automatically become available in the system.
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            type="button"
            className="border py-2 px-4 font-poppins text-xs md:text-sm border-gray-400 rounded-lg hover:bg-gray-100"
            onClick={closePopup}
            disabled={isLoading} 
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#0CA1E2] text-white py-2 px-4 md:px-6 rounded-lg cursor-pointer font-poppins text-xs md:text-sm hover:bg-[#0b8dc1]"
            disabled={isLoading} 
          >
            {isLoading ? 'Booking...' : 'Book'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PopupForm;
