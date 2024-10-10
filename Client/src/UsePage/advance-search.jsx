import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../App';

const AdvanceSearch = () => {
    const options = ['Title', 'Author', 'Accession Number', 'Publisher', 'ISBN/ISSN', 'Category', 'Tags', 'Subject', 'DDC Classification'];
    const operators = ['AND', 'OR', 'NOT'];

    const { addReservedBook } = useContext(AuthContext);

    const [searchCriteria, setSearchCriteria] = useState({
        option1: '',
        expression1: '',
        option2: '',
        expression2: '',
        operator: ''
    });

    const [results, setResults] = useState([]);
    const [suggestions1, setSuggestions1] = useState([]);
    const [suggestions2, setSuggestions2] = useState([]);
    const [error, setError] = useState('');

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setSearchCriteria((prev) => ({ ...prev, [name]: value }));

        if (name === 'expression1' && value.length > 1) {
            try {
                const response = await axios.get(`http://localhost:8081/suggestions?field=${options[searchCriteria.option1]}&query=${value}`);
                setSuggestions1(response.data);
            } catch (err) {
                console.error("Error fetching suggestions:", err);
            }
        }

        if (name === 'expression2' && value.length > 1) {
            try {
                const response = await axios.get(`http://localhost:8081/suggestions?field=${options[searchCriteria.option2]}&query=${value}`);
                setSuggestions2(response.data);
            } catch (err) {
                console.error("Error fetching suggestions:", err);
            }
        }
    };

    const handleSelectSuggestion1 = (suggestion) => {
        setSearchCriteria((prev) => ({
            ...prev,
            expression1: suggestion
        }));
        setSuggestions1([]);
    };

    const handleSelectSuggestion2 = (suggestion) => {
        setSearchCriteria((prev) => ({
            ...prev,
            expression2: suggestion
        }));
        setSuggestions2([]);
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        const { option1, expression1, option2, expression2, operator } = searchCriteria;

        if (!option1 || !expression1 || !operator || !option2 || !expression2) {
            setError('Please select fields, enter expressions, and choose an operator.');
            return;
        }

        const searchData = {
            conditions: [
                { field: options[option1], expression: expression1 },
                { field: options[option2], expression: expression2 }
            ],
            operator: operators[operator]
        };

        try {
            const response = await axios.post('http://localhost:8081/search/book', searchData);
            if (response.data.status) {
                setResults(response.data.data);
                setError('');
            } else {
                setError(response.data.message);
                setResults([]);
            }
        } catch (err) {
            setError('Error searching for books');
            setResults([]);
        }
    };

    const handleClear = () => {
        setSearchCriteria({
            option1: '',
            expression1: '',
            option2: '',
            expression2: '',
            operator: ''
        });
        setResults([]);
        setSuggestions1([]);
        setSuggestions2([]);
        setError('');
    };

    const handleReserveBook = (book) => {
        addReservedBook(book);
    };

    return (
        <div className='w-[100%] h-screen p-[60px] bg-[#0CA1E2] flex flex-col items-center gap-5'>
            <h1 className='font-poppins text-[white] text-[25px] font-bold'>Advance Search</h1>
            <p className='font-poppins text-[white] text-[16px]'>Search the library's holdings for books, digital records, periodicals, and more</p>
            
            <form className='flex flex-col gap-5 items-center mt-1' onSubmit={handleSearch}>
                <div className='flex gap-9'>
                    {/* Search Field Options */}
                    <div className='flex flex-col gap-3'>
                        <h1 className='text-[white] font-montserrat font-semibold text-[17px]'>Search Field</h1>
                        <select
                            className='py-2 pl-2 w-[200px] rounded-lg font-montserrat text-md'
                            name="option1"
                            value={searchCriteria.option1}
                            onChange={handleChange}
                        >
                            <option hidden>Select</option>
                            {options.map((item, index) => (
                                <option value={index} key={item}>{item}</option>
                            ))}
                        </select>
                        <select
                            className='py-2 pl-2 w-[200px] rounded-lg font-montserrat text-md'
                            name="option2"
                            value={searchCriteria.option2}
                            onChange={handleChange}
                        >
                            <option hidden>Select</option>
                            {options.map((item, index) => (
                                <option value={index} key={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <h1 className='text-[white] font-montserrat font-semibold text-[17px]'>Search Expression</h1>
                        <div className='relative'>
                            <input
                                className="py-2 pl-2 w-[300px] rounded-lg font-montserrat text-md"
                                type="text"
                                placeholder="Type Something ..."
                                name="expression1"
                                value={searchCriteria.expression1}
                                onChange={handleChange}
                            />
                            {suggestions1.length > 0 && (
                                <div className="absolute top-[100%] left-0 right-0 bg-white shadow-lg rounded-lg z-10 max-h-40 overflow-y-auto font-montserrat">
                                    {suggestions1.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleSelectSuggestion1(suggestion)}
                                        >
                                            {suggestion}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className='relative'>
                            <input
                                className="py-2 pl-2 w-[300px] rounded-lg font-montserrat text-md"
                                type="text"
                                placeholder="Type Something ..."
                                name="expression2"
                                value={searchCriteria.expression2}
                                onChange={handleChange}
                            />
                            {suggestions2.length > 0 && (
                                <div className="absolute top-[100%] left-0 right-0 bg-white shadow-lg rounded-lg z-10 max-h-40 overflow-y-auto font-montserrat">
                                    {suggestions2.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleSelectSuggestion2(suggestion)}
                                        >
                                            {suggestion}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='flex flex-col gap-3'>
                        <h1 className='text-[white] font-montserrat font-semibold text-[17px]'>Operator</h1>
                        <select
                            className='py-2 pl-2 w-[200px] rounded-lg font-montserrat text-md'
                            name="operator"
                            value={searchCriteria.operator}
                            onChange={handleChange}
                        >
                            <option hidden>Select Operator</option>
                            {operators.map((item, index) => (
                                <option value={index} key={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='flex gap-3'>
                    <button
                        type="submit"
                        className="bg-[#161D6F] text-white py-2 px-5 rounded-lg cursor-pointer font-montserrat text-sm hover:bg-[#161D6F]/70"
                    >
                        Search
                    </button>
                    <button
                        type="button"
                        className="bg-[#161D6F] text-white py-2 px-5 rounded-lg cursor-pointer font-montserrat text-sm hover:bg-[#161D6F]/70"
                        onClick={handleClear}
                    >
                        Clear
                    </button>
                </div>
            </form>

            {error && <p className="text-red-500 font-montserrat mt-4">{error}</p>}

            {results.length > 0 && (
                <div className='mt-5 w-full'>
                    <table className='min-w-full bg-white rounded-lg overflow-hidden shadow-lg'>
                        <thead className='bg-[#161D6F] text-white text-center'>
                            <tr>
                                <th className='py-3 px-5'>Title</th>
                                <th className='py-3 px-5'>Author</th>
                                <th className='py-3 px-5'>Accession Number</th>
                                <th className='py-3 px-5'>Publisher</th>
                                <th className='py-3 px-5'>ISBN/ISSN</th>
                                <th className='py-3 px-5'>Category</th>
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
}

export default AdvanceSearch;
