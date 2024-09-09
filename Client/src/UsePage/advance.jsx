import Header from "../Components/header"
import AdvanceSearch from "./advance-search"
import Catalog from "./catalog"

const Advance = () => {
  return (
    <>
        <Header/>
        <div className='flex justify-between w-[100%] h-[100%] p-[50px] gap-8'>
            <Catalog/>
            <AdvanceSearch/>
        </div>
    </>
  )
}

export default Advance