import React from 'react'
import Header from '../Components/header'
import Catalog from './catalog.jsx'
import BasicSearch from './basic-search.jsx'

const basic = () => {
  return (
    <>
        <Header/>
        <div className='flex justify-between w-[100%] h-[100%] p-[50px] gap-8'>
            <Catalog/>
            <BasicSearch/>
        </div>
    </>
  )
}

export default basic