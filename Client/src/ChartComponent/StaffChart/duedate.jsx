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
        <div>
            <h2 className="text-lg font-semibold text-gray-600 mb-4">Due Dates and Overdue Books</h2>
            
            <div className="flex gap-4 mb-4">
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

            <table className="min-w-full border">
                <thead>
                    <tr className="bg-gray-200 text-gray-600">
                        <th className="border p-2">First Name</th>
                        <th className="border p-2">Last Name</th>
                        <th className="border p-2">Category</th>
                        <th className="border p-2">Designation</th>
                        <th className="border p-2">Title</th>
                        <th className="border p-2">Estimated Date</th>
                        <th className="border p-2">Due Status</th>
                        <th className="border p-2">Days Overdue</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book, index) => (
                        <tr key={index} className={`text-center ${book.due_status === 'Overdue' ? 'bg-red-100' : book.due_status === 'Due Today' ? 'bg-yellow-100' : ''}`}>
                            <td className="border p-2">{book.firstname}</td>
                            <td className="border p-2">{book.lastname}</td>
                            <td className="border p-2">{book.category}</td>
                            <td className="border p-2">{book.designation}</td>
                            <td className="border p-2">{book.title}</td>
                            <td className="border p-2">{new Date(book.estimated_date).toLocaleDateString()}</td>
                            <td className="border p-2">{book.due_status}</td>
                            <td className="border p-2">{book.overdue_days > 0 ? book.overdue_days : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DueBooksTable;
