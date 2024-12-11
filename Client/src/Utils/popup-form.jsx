import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../App";
import axios from 'axios';

function PopupForm({ closePopup }) {
  const { user, reservedBooks, triggerBookingSuccess, setReservedBooks } = useContext(AuthContext);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); 

  useEffect(() => {
    const getCurrentDateInGMT8 = () => {
      const now = new Date();
      const options = { timeZone: "Asia/Singapore" };
      const localTime = new Date(
        now.toLocaleString("en-US", options)
      );
      const year = localTime.getFullYear();
      const month = String(localTime.getMonth() + 1).padStart(2, "0");
      const day = String(localTime.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`; // Proper format for min attribute
    };
  
    setCurrentDate(getCurrentDateInGMT8());
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!pickupDate) {
      alert("Please select a pickup date.");
      return;
    }

    setIsLoading(true); 
    try {
      const response = await axios.post('http://localhost:8081/user/book', {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        designation: user.designation || '',
        idNumber: user.idNumber,
        pickup_date: pickupDate,
        booking_date: new Date().toISOString().split('T')[0],
        estimated_date: returnDate,
        contactNumber: user.contactNumber,
        title: reservedBooks.map(book => book.title).join(', '),
        category: reservedBooks.map(book => book.category).join(', '),
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
      setIsLoading(false); 
    }
  };

  return (
    <div className="bg-white border border-solid border-gray-200 w-[90%] md:w-[60%] lg:w-[40%] text-center p-4 rounded-lg shadow-lg mx-auto relative text-sm">
      <h1 className="font-poppins font-bold text-xl text-[#161D6F] mb-4">Borrow Book Form</h1>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full border-blue-500 border-t-transparent"></div>
        </div>
      )}
      
      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Your booking has been successfully processed.</span>
        </div>
      )}
      
      <div className="flex flex-col items-start mb-2">
        <label className="font-poppins font-semibold">Current Date:</label>
        <p className="mt-1 text-xs text-gray-700">{currentDate}</p>
      </div>
      <form className="flex flex-col gap-3 " onSubmit={handleBooking}>
        <div className="flex flex-col items-start">
          <label className="font-poppins font-semibold">Name:</label>
          <p className="mt-1 text-xs text-gray-700">{user.firstname} {user.lastname}</p>
        </div>
        <div className="flex flex-col items-start">
          <label className="font-poppins font-semibold">ID Number:</label>
          <p className="mt-1 text-xs text-gray-700">{user.idNumber}</p>
        </div>
        <div className="flex flex-col items-start">
          <label className="font-poppins font-semibold">Contact:</label>
          <p className="mt-1 text-xs text-gray-700">{user.contactNumber}</p>
        </div>
        <div className="flex flex-col items-start">
          <label className="font-poppins font-semibold">Pick-up Date:</label>
          <input
            className="mt-1 p-1 border border-gray-300 rounded-md w-full md:w-3/4 lg:w-1/2 cursor-pointer"
            type="date"
            value={pickupDate}
            min={currentDate}
            onChange={(e) => {
              setPickupDate(e.target.value);
              setReturnDate(""); // Reset return date if pickup date changes
            }}
            required
          />
          <label className="font-poppins font-semibold">Estimated Book Returned Date:</label>
          <input
            className="mt-1 p-1 border border-gray-300 rounded-md w-full md:w-3/4 lg:w-1/2 cursor-pointer"
            type="date"
            value={returnDate}
            min={pickupDate || currentDate} // Start from the pickup date
            max={
              user.designation === "Student" && pickupDate
                ? new Date(
                    new Date(pickupDate).setDate(new Date(pickupDate).getDate() + 3)
                  )
                    .toISOString()
                    .split("T")[0]
                : undefined // No max limit for faculty or staff
            }
            onChange={(e) => setReturnDate(e.target.value)}
            required
          />
        </div>

        {reservedBooks.length > 0 ? (
          <div className="mt-3 w-full">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow text-center text-xs">
              <thead className="bg-[#161D6F] text-white">
                <tr>
                  <th className="py-2 px-4">No</th>
                  <th className="py-2 px-4">Title</th>
                  <th className="py-2 px-4">Author</th>
                  <th className="py-2 px-4">Category</th>
                </tr>
              </thead>
              <tbody>
                {reservedBooks.map((book, index) => (
                  <tr key={index} className="border-b text-center">
                    <td className="py-1 px-4">{index + 1}</td>
                    <td className="py-1 px-4">{book.title}</td>
                    <td className="py-1 px-4">{book.author}</td>
                    <td className="py-1 px-4">{book.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-700 mt-2">No books reserved yet.</p>
        )}

        <div className="mt-3 p-3 bg-[#EBEBEB] rounded-lg text-left text-xs">
          <span className="font-semibold text-red-500">Note:</span>
          <p className="mt-1">
            If a reserved book is not claimed by the borrowing date, it will automatically become available in the system.
          </p>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          <button
            type="button"
            className="border py-2 px-4 font-poppins text-xs border-gray-400 rounded-lg hover:bg-gray-100"
            onClick={closePopup}
            disabled={isLoading} 
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#0CA1E2] text-white py-2 px-4 rounded-lg cursor-pointer font-poppins text-xs hover:bg-[#0b8dc1]"
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
