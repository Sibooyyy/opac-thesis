import { useState } from "react";


const AdvanceSearch = () => {
    const options = ['Title', 'Author', 'Accession Number', 'ISBN/ISSN', 'Category']
    const operators = ['AND', 'OR', 'NOT']

    const [selectedOption1, setSelectedOption1] = useState('');
    const [selectedOption2, setSelectedOption2] = useState('');

    const handleSelectionOption1 = (e) => setSelectedOption1(e.target.value);
    const handleSelectionOption2 = (e) => setSelectedOption2(e.target.value);

    const filteredOptionsForSecondSelect = options.filter(
        (option) => option !== options[selectedOption1]
    );



  return (
    <div className='w-[100%] h-screen p-[60px] bg-[#0CA1E2] flex flex-col items-center gap-5'>
        <h1 className='font-poppins text-[white] text-[25px] font-bold'>Advance Search</h1>
        <p className='font-poppins text-[white] text-[16px]'>Search the library's holding for books, digital records, periodical, and more</p>
        <form className='flex gap-8 items-center mt-1'>
            <div className='flex flex-col text-center gap-3'>
                <h1 className='text-[white] f font-semibold text-[17px]'>Search Field</h1>
                <select className='py-3 pl-1 w-[220px] rounded-lg font-montserrat text-md'  value={selectedOption1}  onChange={handleSelectionOption1}>
                    <option hidden>Select</option>
                    {options.map((item, index) => (
                        <option value={index} key={item}>{item}</option>
                    ))}
                </select>
                <select className='py-3 pl-1 w-[220px] rounded-lg font-montserrat text-md'  value={selectedOption2} onChange={handleSelectionOption2}>
                    <option hidden>Select</option>
                    {filteredOptionsForSecondSelect.map((item, index) => (
                        <option value={index} key={item}>{item}</option>
                    ))}
                </select>
            </div>
            <div className='flex flex-col text-center gap-3'>
                <h1 className='text-[white] font-montserrat font-semibold text-[17px]'>Search Expression</h1>
                <input className="py-3 pl-2 rounded-lg w-[300px] font-montserrat text-md" type="text" placeholder="Type Something ..." />
                <input className="py-3 pl-2 rounded-lg w-[300px] font-montserrat text-md" type="text" placeholder="Type Something ..." />
            </div>
            <div className='flex flex-col text-center gap-3'>
                <h1 className='text-[white] font-montserrat font-semibold text-[17px]'>Search Expression</h1>
                <select className='py-3 pl-1 w-[220px] rounded-lg font-montserrat text-md'>
                    <option hidden>Select Operator</option>
                    {operators.map((item, index) => (
                        <option value={index} key={item}>{item}</option>
                    ))}
                </select>
                <select className='py-3 pl-1 w-[220px] rounded-lg font-montserrat text-md'>
                    <option hidden>Select Operator</option>
                    {operators.map((item, index) => (
                        <option value={index} key={item}>{item}</option>
                    ))}
                </select>
            </div>
        </form>  
            <div className='flex mt-10 gap-1 self-end'>
                 <button type="submit" className="bg-[#161D6F] text-[white] py-2 w-[90px] rounded-lg cursor-pointer font-montserrat text-[12px] hover:bg-[#161D6F]/70">Search</button>
                 <button type="submit" className="bg-[#161D6F] text-[white] py-2 w-[90px] rounded-lg cursor-pointer font-montserrat text-[12px] hover:bg-[#161D6F]/70">Clear</button>
           </div>  
    </div>
  )
} 

export default AdvanceSearch