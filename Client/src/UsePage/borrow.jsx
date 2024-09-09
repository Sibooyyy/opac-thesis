import React from 'react'
import Header from '../Components/header'
import Catalog from './catalog'
import Borrowing from './borrowing'

const borrow = () => {
  return (
    <>
        <Header/>
        <div className='flex justify-between w-[100%] h-[100%] p-[50px] gap-8'>
            <Catalog/>
            <Borrowing/>
        </div>
    </>
  )
}

export default borrow