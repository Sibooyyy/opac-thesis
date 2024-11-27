import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';

const BasicSearch = () => {
    const options = ['Title', 'Author', 'Accession Number', 'Publisher', 'ISBN/ISSN', 'Category', 'Tags', 'Subject', 'DDC Classification'];

    const [searchCriteria, setSearchCriteria] = useState({
        field: '',
        expression: ''
    });
    const [results, setResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');
    const [showTable, setShowTable] = useState(false); // State to manage table visibility
    const { addReservedBook } = useContext(AuthContext);

    // Handle change in search input
    const handleChange = async (e) => {
        const { name, value } = e.target;
        setSearchCriteria((prev) => ({
            ...prev,
            [name]: value
        }));

        if (name === 'expression' && value.length > 1) {
            try {
                const response = await axios.get(`http://localhost:8081/suggestions?field=${searchCriteria.field}&query=${value}`);
                setSuggestions(response.data); 
            } catch (err) {
                console.error("Error fetching suggestions:", err);
            }
        }
    };

    // Handle search form submission
    const handleSearch = async (e) => {
        e.preventDefault();
        const { field, expression } = searchCriteria;
        if (!field || !expression) {
            setError('Please select a search field and enter a search expression.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/search/book', { field, expression });

            if (response.data.status) {
                setResults(response.data.data);
                setError('');
            } else {
                setError(response.data.message);
                setResults([]);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error searching for books');
            setResults([]);
        }
    };

    // Handle clearing of search form
    const handleClear = () => {
        setSearchCriteria({
            field: '',
            expression: ''
        });
        setResults([]);
        setError('');
        setSuggestions([]);
        setShowTable(false); // Hide table when cleared
    };

    // Handle suggestion selection
    const handleSelectSuggestion = (suggestion) => {
        setSearchCriteria((prev) => ({
            ...prev,
            expression: suggestion
        }));
        setSuggestions([]); 
    };

    // Handle reserving a book
    const handleReserveBook = (book) => {
        addReservedBook(book);
    };

    return (   

        <div className='w-[100%] h-[1000px] p-[60px] bg-[#0CA1E2] flex flex-col items-center gap-5'>
            <h1 className='font-poppins text-[white] text-[25px] font-bold'>Basic Search</h1>
            <p className='font-poppins text-[white] text-[16px]'>Search the library's holdings for books, digital records, periodicals, and more</p>

            <form className='flex gap-9 items-center mt-1' onSubmit={handleSearch}>
                <div className='flex flex-col text-center gap-3'>
                    <h1 className='text-[white] font-montserrat font-semibold text-[17px]'>Search Field</h1>
                    <select
                        className='py-3 pl-1 w-[220px] rounded-lg font-montserrat text-md'
                        name="field"
                        value={searchCriteria.field}
                        onChange={handleChange}
                    >
                        <option hidden>Select</option>
                        {options.map((item) => (
                            <option value={item} key={item}>{item}</option>
                        ))}
                    </select>
                </div>

                <div className='flex flex-col text-center gap-3 relative'>
                    <h1 className='text-[white] font-montserrat font-semibold text-[17px]'>Search Expression</h1>
                    <input
                        className="py-3 pl-2 rounded-lg w-[300px] font-montserrat text-md"
                        type="text"
                        placeholder="Type Something ..."
                        name="expression"
                        value={searchCriteria.expression}
                        onChange={handleChange}
                    />
                    {suggestions.length > 0 && (
                        <div className="absolute top-[100%] left-0 right-0 bg-white shadow-lg rounded-lg z-10 max-h-40 overflow-y-auto font-montserrat">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                    onMouseEnter={() => setShowTable(true)} 
                                    onMouseLeave={() => setShowTable(false)} 
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='flex mt-10 gap-1'>
                    <button
                        type="submit"
                        className="bg-[#161D6F] text-[white] py-2 w-[90px] rounded-lg cursor-pointer font-montserrat text-[12px] hover:bg-[#161D6F]/70"
                    >
                        Search
                    </button>
                    <button
                        type="button"
                        className="bg-[#161D6F] text-[white] py-2 w-[90px] rounded-lg cursor-pointer font-montserrat text-[12px] hover:bg-[#161D6F]/70"
                        onClick={handleClear}
                    >
                        Clear
                    </button>
                </div>
            </form>

            {error && <p className="text-red-500 font-montserrat mt-4">{error}</p>}
            {showTable && results.length > 0 && (
                <div className='table-container mt-5 w-full'>
                    <table className='min-w-full bg-white rounded-lg overflow-hidden shadow-lg text-center'>
                        <thead className='bg-[#161D6F] text-white'>
                            <tr>
                                <th className='py-3 px-5'>Title</th>
                                <th className='py-3 px-5'>Author</th>
                                <th className='py-3 px-5'>Accession Number</th>
                                <th className='py-3 px-5'>Publisher</th>
                                <th className='py-3 px-5'>ISBN/ISSN</th>
                                <th className='py-3 px-5'>Category</th>
                                <th className='py-3 px-5'>Book Status</th>
                                <th className='py-3 px-5'>Status</th>
                                <th className='py-3 px-5'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((book, index) => (
                                <tr key={index} className='border-b text-center'>
                                    <td className='py-2 px-5'>{book.title}</td>
                                    <td className='py-2 px-5'>{book.author}</td>
                                    <td className='py-2 px-5'>{book.accession_number}</td>
                                    <td className='py-2 px-5'>{book.publisher}</td>
                                    <td className='py-2 px-5'>{book.isbn_issn}</td>
                                    <td className='py-2 px-5'>{book.category}</td>
                                    {book.status === 'active' && (
                                        <td className='py-2 px-5'>
                                            {book.book_status === 'available' ? (
                                                <span className='bg-green-500 text-white px-3 py-1 rounded'>
                                                    Available
                                                </span>
                                            ) : book.book_status === 'borrowed' ? (
                                                <span className='bg-red-500 text-white px-3 py-1 rounded cursor-not-allowed'>
                                                    Borrowed
                                                </span>
                                            ) : (
                                                <span className='text-gray-500'>Unknown</span>
                                            )}
                                        </td>
                                    )}
                                    {book.status === 'inactive' && (
                                        <td className='py-2 px-5'>
                                            <span className='bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed'>
                                                Inactive
                                            </span>
                                        </td>
                                    )}
                                    <td className='py-2 px-5'>
                                        {book.status === 'active' && book.book_status === 'available' && (
                                            <button className='bg-[#0CA1E2] text-white px-3 py-1 rounded-md hover:bg-[#0A90D2]' onClick={() => handleReserveBook(book)}>
                                                Reserve Book
                                            </button>
                                        )}
                                        {book.status === 'inactive' && (
                                            <span className='text-gray-500'>Cannot Reserve</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BasicSearch;
