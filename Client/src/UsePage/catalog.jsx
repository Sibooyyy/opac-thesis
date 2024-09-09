import { useNavigate } from "react-router-dom"

const catalog = () => {
  const navigate = useNavigate()

  const handleClick = (link) => {
    navigate(link)
  }

  return (
    <div className="h-[100%]">
        <div className="w-[250px] p-3 flex flex-col gap-2 bg-white border-2 border-[#0CA1E2] rounded-[5px]">
            <div>
                <h1 className="text-[#161D6F] font-poppins font-bold text-[18px] border-b border-b-gray-400 border-solid">Online Catalog</h1>
                <ul className="ml-4 mt-1">
                    <li onClick={()=> handleClick("/home")} className=" text-zinc-500 cursor-pointer font-poppins">Basic Search</li>
                    <li onClick={() => handleClick("/home/advance")} className=" text-zinc-500 cursor-pointer font-poppins">Advance Search</li>
                </ul>
            </div>
            <div>
                <h1 className="text-[#161D6F] font-poppins font-bold text-[18px] border-b border-b-gray-400 border-solid">My Borrow Book</h1>
                <ul className="ml-4 mt-1">
                    <li onClick={() => handleClick("/home/borrow")} className=" text-zinc-500 cursor-pointer font-poppins">View Borrow Book</li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default catalog