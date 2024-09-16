import { useState, useEffect } from "react";
import { fetchData, formatDate } from "../../utils/utils";
import moment from "moment";


const CategoryRec = ({onEditCategory, setCategories, categories }) => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData('http://localhost:8081/book/data', setCategories, setLoading, setError);
  }, []);

  const handleEdit = (item) => {
    onEditCategory(item);
  };

  return (
    <div className='w-[68%]'>
          <table className='w-full'>
            <thead className='font-poppins text-[14px] border-2 h-[45px] bg-[#F2F2F2] py-2'>
              <tr>
                    <th className='border border-r-2'>No</th>
                    <th className='border border-r-2'>Category</th>
                    <th className='border border-r-2'>Status</th>
                    <th className='border border-r-2'>Date Created</th>
                    <th className='border border-r-2'>Date Updated</th>
                    <th className=''>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item, index) => (
                    <tr key={index}>
                    <td className='border border-r-2 px-[10px] font-poppins'>{index + 1}</td>
                    <td className='border border-r-2 px-[40px]'>{item.category || 'No data'}</td>
                    <td className='border border-r-2 px-[40px]'>{item.status || 'No Status'}</td>
                    <td className='border border-r-2 px-[40px]'>{formatDate(item.date_published)}</td>
                    <td className='border border-r-2 px-[20px]'>{formatDate(item.date_update, 'Must Update')}</td>
                    <td className='border border-r-2'>
                        <div className="flex gap-2 text-center pl-1">
                            <span className="border bg-[#003687] text-white rounded-md px-3 font-montserrat text-[15px] cursor-pointer" onClick={() => handleEdit(item)}>Edit</span>
                        </div>
                    </td>
                    </tr>
                ))}
            </tbody>
          </table>
    </div>
  )
}

export default CategoryRec