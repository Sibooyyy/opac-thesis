import Navbar from '../../Components/navbar'
import { TbCategory2 } from "react-icons/tb";
import CategoryInfo from './category-info';
import CategoryRec from './category-rec';
import { useState } from 'react';




const category = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleUpdateCategories = (updatedCategory) => {
    // Update the specific category in the categories list
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.accession_number === updatedCategory.accession_number ? updatedCategory : cat
      )
    );
  }

  return (
    <>
        <Navbar/>
        <div className='flex flex-row pt-8 items-center pl-[250px] border-b font-montserrat font-bold text-[25px] p-5 gap-1'> 
            <TbCategory2/><span>Categories</span>
        </div>
        <div className='h-screen flex justify-between w-[100%] p-[50px] gap-8'>
            <CategoryInfo selectedCategory={selectedCategory}  onUpdateCategories={handleUpdateCategories}/>
            <CategoryRec onEditCategory={handleEditCategory}  categories={categories} setCategories={setCategories} />
        </div>
    </>
  )
}

export default category