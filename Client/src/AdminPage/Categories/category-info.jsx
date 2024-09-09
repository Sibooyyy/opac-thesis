import React from 'react'

const CategoryInfo = () => {
  return (
    <>
        <div className='border-2 border-[#0CA1E2] w-[30%] h-[50%] flex flex-col gap-3'>
            <div className='h-[55px] bg-[#0CA1E2] pt-5 pl-4 '>
                <h1 className='font-poppins text-white text-[15px]'>Category Information</h1>
            </div>
            <form className='flex flex-col pl-4 gap-3'>
                <div className='flex flex-col w-[70%]'>
                    <label className='font-poppins text-[15px] font-semibold'>Category Name</label>
                    <input type="text" className='p-1 border border-black rounded-md drop-shadow-sm cursor-pointer'/>
                </div>
                <div>
                    <h1 className='font-poppins text-[15px] font-semibold'>Status</h1>
                    <div className='flex gap-2'>
                        <input type="radio" id="active" name="status" value="active" />
                        <label>Active</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type="radio" id="active" name="status" value="active" />
                        <label>Inactive</label>
                    </div>
                </div>
            </form>
            <div className='flex self-end mr-5'>
                <button className='bg-[#0CA1E2] text-white py-3 w-[90px] rounded-lg cursor-pointer font-montserrat text-[12px]' type='submit'>Submit</button>
            </div>
        </div>
    </>
  )
}

export default CategoryInfo