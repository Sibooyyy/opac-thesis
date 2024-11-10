import Navbar from '../../Components/navs'
import CategoryInfo from './CategoryInfo';
import CategoryRec from './cat-rec';
import { bookForm } from '../../utils/utils';
import { useState } from'react';


const Category = () => {
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
    
    <div className='bg-[#EFF6FC] min-h-screen '>
    <Navbar/>
          <div className='flex justify-between w-[100%] p-[30px] gap-4'>
              <CategoryInfo formData={formData} setFormData={setFormData} onFormSubmit={handleFormSubmit} />
              <CategoryRec  categories={categories} onEditClick={handleEditClick} />
          </div>
    </div>
    </>

  )
}

export default Category