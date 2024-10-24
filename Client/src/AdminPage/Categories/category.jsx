import Navbar from '../../Components/navbar'
import { TbCategory2 } from "react-icons/tb";
import CategoryInfo from './category-info';
import CategoryRec from './category-rec';
import { bookForm } from '../../utils/utils';
import { useState } from'react';



const category = () => {
  const [formData, setFormData] = useState(bookForm());
  const [categories, setCategories] = useState([]);

  const handleEditClick = (category, status, id) => {
    setFormData({ category, status, id  });
  };

  const handleFormSubmit = (updatedCategory) => {
    if (updatedCategory.id) {
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        )
      );
    } else {
      setCategories([...categories, updatedCategory]);
    }
  };



  return (
    <>
        <Navbar/>
        <div className='flex flex-row pt-8 items-center pl-[250px] border-b font-montserrat font-bold text-[25px] p-5 gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'> 
            <TbCategory2/><span>Categories</span>
        </div>
        <div className='h-screen flex justify-between w-[100%] p-[30px] gap-8'>
            <CategoryInfo formData={formData} setFormData={setFormData} onFormSubmit={handleFormSubmit} />
            <CategoryRec  categories={categories} onEditClick={handleEditClick} />
        </div>
    </>
  )
}

export default category