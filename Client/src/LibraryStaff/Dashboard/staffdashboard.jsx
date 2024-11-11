import Navigation from "../../Components/navs"
import Calendar from '../../ChartComponent/StaffChart/calendar'
import DueDate from '../../ChartComponent/StaffChart/duedate'

const staffdashboard = () => {
  return (
    <>
      <div className="bg-[#EFF6FC] min-h-screen">   
        <Navigation/>
        <div className="flex flex-col p-[50px] mx-[150px] mt-[30px] font-montserrat gap-10">
          <div className="text-3xl font-bold">
            <h1 className="text-gray-600">Welcome, <span className="text-[#4EBCFF]">Staff!</span> </h1>
          </div>
          <div className="border w-full shadow-3xl rounded-lg h-[150px] bg-[#FBFDFF] flex flex-row justify-center items-center ">
            <h1>LIBRARY DASHBOARD</h1>
          </div>
          <div className="flex justify-between gap-5 h-[700px]">
            <div className="border w-full shadow-3xl rounded-lg bg-[#FBFDFF] p-4">
              <Calendar/>
            </div>
          </div>
          <div className="w-full border shadow-3xl rounded-lg h-[700px] bg-[#FBFDFF]">
            <div>
              <DueDate/>
            </div>
          </div>
          <div className="w-full border shadow-3xl rounded-lg h-[700px] bg-[#FBFDFF]">
            <div>
            </div>
          </div>
        </div>
      </div> 
    </>
  )
}

export default staffdashboard