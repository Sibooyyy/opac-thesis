import { useState } from "react"
import axios from 'axios'
import moment from "moment"
import { FaBook } from "react-icons/fa";



const BasicSearch = () => {
    const options = ['Title', 'Author', 'Accession Number', 'Publisher', 'ISBN/ISSN', 'Category']
    const [selectedField, setSelectedField] = useState('');
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState([]); 
    const [message, setMessage] = useState('');   
   
   
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedField || !searchText) {
            alert("Both field and search text are required.");
            return;
        }
        axios.get('http://localhost:8081/search/book', {
            params: {
                field: selectedField.toLowerCase().replace(/\s+/g, '_'),  
                expression: searchText
            }
        })
        .then(response => {
            if (response.data.status) {
                setResults(response.data.data);  
                setMessage('');
            } else {
                setMessage(response.data.message); 
                setResults([]);
            }
        })
        .catch(error => {
            console.error("There was an error fetching the data!", error);
            setMessage("Error fetching data");
        });
    };

    const handleDelete = (e) => {
        setSelectedField('');
        setSearchText('');
        setMessage(''), 
        setResults(''),
        h1('')
    }


  return (
    <div className='w-[100%] h-screen p-[60px] bg-[#0CA1E2] flex flex-col items-center gap-5'>
        <h1 className='font-poppins text-[white] text-[25px] font-bold'>Basic Search</h1>
        <p className='font-poppins text-[white] text-[16px]'>Search the library's holding for books, digital records, periodical, and more</p>
        <form className='flex gap-9 items-center mt-1' onSubmit={handleSubmit}>
            <div className='flex flex-col text-center gap-3'>
                <h1 className='text-[white] font-montserrat font-semibold text-[17px]'>Search Field</h1>
                <select className='py-3 pl-1 w-[220px] rounded-lg font-montserrat text-md' value={selectedField}  onChange={(e) => setSelectedField(e.target.value)}>
                    <option hidden>Select</option>
                    {options.map((item) => (
                        <option value={item} key={item}>{item}</option>
                    ))}
                </select>
            </div>
            <div className='flex flex-col text-center gap-3'>
                <h1 className='text-[white] font-montserrat font-semibold text-[17px]'>Search Expression</h1>
                <input className="py-3 pl-2 rounded-lg w-[300px] font-montserrat text-md" type="text" name='searchText ' value={searchText} onChange={(e) => setSearchText(e.target.value)}  placeholder="Type Something ..."/>
            </div>
            <div className='flex mt-10 gap-1'>
                 <button type="submit" className="bg-[#161D6F] text-[white] py-2 w-[90px] rounded-lg cursor-pointer font-montserrat text-[12px] hover:bg-[#161D6F]/70">Search</button>
                 <button type="button" onClick={handleDelete} className="bg-[#161D6F] text-[white] py-2 w-[90px] rounded-lg cursor-pointer font-montserrat text-[12px] hover:bg-[#161D6F]/70">Clear</button>
            </div>
        </form>
        <div className='mt-10'>
                {message && <p className="text-[white]">{message}</p>}
                {results.length > 0 && (
                    <table className="mt-[30px]">
                        <thead className="bg-[white] font-poppins h-[50px]">
                            <tr>
                                <th className="px-5">Type</th>
                                <th className="px-5">Title</th>
                                <th className="px-5">Author</th>
                                <th className="px-5">Status</th>
                                <th className="px-5">Category</th>
                                <th className="px-5">Accession Number</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#E3FFFF]">
                            {results.map((book, index) => (
                                <tr key={index}>
                                    <td className="px-5"><FaBook/></td>
                                    <td className="px-5">{book.title}</td>
                                    <td className="px-5">{book.author}</td>
                                    <td className="px-5">{book.category}</td>
                                    <td className="px-5">{book.accession_number}</td>
                                    <button>Borrow Book</button>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
    </div>
  )
} 

export default BasicSearch
