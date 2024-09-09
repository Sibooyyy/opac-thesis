import Navbar from '../../Components/navbar'
import { TbCategory2 } from "react-icons/tb";
import CategoryInfo from './category-info';
import CategoryRec from './category-rec';




const category = () => {
  return (
    <>
        <Navbar/>
        <div className='flex flex-row mt-8 items-center pl-[250px] border-b font-montserrat font-bold text-[25px] p-5 gap-1'> 
            <TbCategory2/><span>Categories</span>
        </div>
        <div className='h-screen flex justify-between w-[100%] p-[50px] gap-8'>
            <CategoryInfo/>
            <CategoryRec/>
        </div>
    </>
  )
}

export default category