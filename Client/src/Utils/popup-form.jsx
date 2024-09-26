import React, { useState, useContext } from "react";
import { AuthContext } from "../App";
import axios from 'axios';

function PopupForm({ closePopup }) {
  const { user, reservedBooks, triggerBookingSuccess, setReservedBooks } = useContext(AuthContext);
  const [pickupDate, setPickupDate] = useState("");

  if (!user) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!pickupDate) {
      alert("Please select a pickup date.");
      return;
    }

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
        alert("Book borrowed successfully!");
        closePopup();
      } else {
        alert("Failed to borrow book.");
      }
    } catch (error) {
      console.error("Error booking the book:", error);
      alert("Error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-white border border-solid border-gray-200 w-[90%] md:w-[60%] lg:w-[40%] text-center p-8 rounded-lg shadow-lg mx-auto">
      <h1 className="font-poppins font-bold text-2xl text-[#161D6F] mb-6">Borrow Book Form</h1>
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
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#0CA1E2] text-white py-2 px-4 md:px-6 rounded-lg cursor-pointer font-poppins text-xs md:text-sm hover:bg-[#0b8dc1]"
          >
            Book
          </button>
        </div>
      </form>
    </div>
  );
}

export default PopupForm;
