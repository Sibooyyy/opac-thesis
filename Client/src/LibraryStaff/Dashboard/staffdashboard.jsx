import Navigation from "../../Components/navs"
import HeatMap from '../../ChartComponent/StaffChart/calendar'
import DueDate from '../../ChartComponent/StaffChart/duedate'

const staffdashboard = () => {
  return (
    <>
      <div className=" bg-[#EFF6FC] min-h-screen overflow-hidden">   
        <Navigation/>
        <div className="flex flex-col p-[50px] mx-[150px] mt-[30px] font-montserrat gap-10">
          <div className="text-3xl font-bold">
            <h1 className="text-gray-600">Welcome, <span className="text-[#4EBCFF]">Staff!</span> </h1>
          </div>
          <div className="flex justify-between gap-5 h-[450px]">
            <div className="border w-[70%] shadow-3xl rounded-lg bg-[#FBFDFF] m-4"> 
              <h2 className="p-4 text-lg font-semibold text-gray-600 mb-4 bg-[#EDF3F7]">Daily and Weekly Borrowing Patterns</h2>
              <HeatMap/>
            </div>
          </div>
          <div className="w-full border shadow-3xl rounded-lg h-[700px] bg-[#F6FBFD]">
            <div> 
              <h2 className="p-4 text-lg font-semibold text-gray-600 mb-4 bg-[#EDF3F7]">Due Dates and Overdue Books</h2>
              <DueDate/>
            </div>
          </div>


        </div>
      </div> 
    </>
  )
}

export default staffdashboard