import Header from '../Components/header'
import Catalog from './catalog'
import ViewProfile from './view-profile'

function profile() {
  return (
    <>
        <Header/>
        <div className='flex justify-between w-[100%] h-[100%] p-[50px] gap-8'>
        <Catalog/>
        <ViewProfile/>
        </div>
    </>
  )
}

export default profile


