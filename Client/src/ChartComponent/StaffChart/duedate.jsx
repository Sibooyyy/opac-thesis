import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DueBooksTable = () => {
    const [books, setBooks] = useState([]);
    const [designation, setDesignation] = useState('');
    const [title, setTitle] = useState('');
    const [overdueDays, setOverdueDays] = useState('');

    useEffect(() => {
        fetchBooks();
    }, [designation, title, overdueDays]);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/due-books', {
                params: { designation, title, overdueDays }
            });
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className="flex gap-4 mb-10">
                <div>
                    <label>User Type:</label>
                    <select value={designation} onChange={(e) => setDesignation(e.target.value)} className="ml-2 p-1 border rounded">
                        <option value="">All</option>
                        <option value="Student">Student</option>
                        <option value="Faculty">Faculty</option>
                    </select>
                </div>
                
                <div>
                    <label>Book Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="ml-2 p-1 border rounded"
                    />
                </div>

                <div>
                    <label>Overdue Days:</label>
                    <input
                        type="number"
                        value={overdueDays}
                        onChange={(e) => setOverdueDays(e.target.value)}
                        placeholder="Days Overdue"
                        className="ml-2 p-1 border rounded"
                    />
                </div>
            </div>

            <table className="w-[95%] mx-auto font-montserrat text-sm sm:text-md cursor-pointer">
                <thead className='text-xs sm:text-sm md:text-md font-semibold h-[45px] text-gray-700'>
                    <tr className="border-b-2 border-gray-500">
                        <th className="p-2">First Name</th>
                        <th className="p-2">Last Name</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Designation</th>
                        <th className="p-2">Title</th>
                        <th className="p-2">Estimated Date</th>
                        <th className="p-2">Due Status</th>
                        <th className="p-2">Days Overdue</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book, index) => (
                        <tr key={index} className={`text-center hover:bg-gray-200 ${book.due_status === 'Overdue' ? 'bg-red-100' : book.due_status === 'Due Today' ? 'bg-yellow-100' : ''}`}>
                            <td className="border-b-2 p-2">{book.firstname}</td>
                            <td className="border-b-2 p-2">{book.lastname}</td>
                            <td className="border-b-2 p-2">{book.category}</td>
                            <td className="border-b-2 p-2">{book.designation}</td>
                            <td className="border-b-2 p-2">{book.title}</td>
                            <td className="border-b-2 p-2">{new Date(book.estimated_date).toLocaleDateString()}</td>
                            <td className="border-b-2 p-2">{book.due_status}</td>
                            <td className="border-b-2 p-2">{book.overdue_days > 0 ? book.overdue_days : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DueBooksTable;
