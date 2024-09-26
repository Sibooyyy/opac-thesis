import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const CategoryRec = ({ onEditClick }) => {
    const [data, setData] = useState([]);  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      axios.get('http://localhost:8081/get/categories')
          .then(response => {
              if (response.data.status) {
                  setData(response.data.data);  
              } else {
                  setError(response.data.message);  
              }
              setLoading(false);
          })
          .catch(error => {
              setError(error.message);  
              setLoading(false);
          });
  }, []);

    return (
        <div className='w-[68%]'>
            <table className='w-full'>
                <thead className='font-poppins text-[14px] border-2 h-[45px] bg-[#F2F2F2] py-2'>
                    <tr>
                        <th className='border border-r-2'>No</th>
                        <th className='border border-r-2'>Category</th>
                        <th className='border border-r-2'>Status</th>
                        <th className='border border-r-2'>Date Updated</th>
                        <th className=''>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((category, index) => (
                        <tr key={index} className='text-center'>
                            <td className='border border-r-2'>{index + 1}</td>
                            <td className='border border-r-2'>{category.category}</td>
                            <td className='border border-r-2'>{category.status}</td>
                            <td className='border border-r-2'>{moment(category.date_update).format("MMM Do YYYY")}</td>
                            <td className='border border-r-2'>
                            <div className="">
                                <span className="border bg-[#003687] text-white rounded-md px-3 font-montserrat text-[15px] cursor-pointer"  onClick={() => {onEditClick(category.category, category.status, category.id);}} >Edit</span>
                            </div>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CategoryRec;
