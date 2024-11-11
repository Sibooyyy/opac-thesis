import React from "react";
import Navigation from "../../Components/navigation";
import { FaRegUser } from "react-icons/fa";
import BookCollectionOverview from "../../ChartComponent/AdminChart/pie"; 
import UserRegistrationTrends  from '../../ChartComponent/AdminChart/UserRegistrationTrends';
import Chart from '../../ChartComponent/AdminChart/chart';
import BorrowingPatternsHeatmap from "../../ChartComponent/AdminChart/heatmap";


function Dashboard() {
  return (
    <>   
      <div className="bg-[#EFF6FC] min-h-screen">   
        <Navigation/>
        <div className="flex flex-col p-[50px] mx-[150px] mt-[30px] font-montserrat gap-10">
          <div className="text-3xl font-bold">
            <h1 className="text-gray-600">Welcome, <span className="text-[#4EBCFF]">Admin!</span> </h1>
          </div>
          <div className="border w-full shadow-3xl rounded-lg h-[150px] bg-[#FBFDFF] flex flex-row justify-center items-center ">
            <div className="border w-[50%] flex items-center gap-1 rounded-md h-[50px] bg-[#EDF3F7]">
              <FaRegUser/> <span>Student</span>
            </div>
            <div className="border w-[50%] flex items-center gap-1 rounded-md h-[50px] bg-[#EDF3F7]">
              <FaRegUser/> <span>Faculty</span>
            </div>
            <div className="border w-[50%] flex items-center gap-1 rounded-md h-[50px] bg-[#EDF3F7]">
              <FaRegUser/> <span>Staff</span>
            </div>
          </div>
          <div className="flex justify-between gap-5 h-[700px]">
            <div className="border w-full shadow-3xl rounded-lg bg-[#FBFDFF] p-4">
              <h2 className="text-lg font-semibold text-gray-600 mb-2">Book Collection Overview</h2>
              <BookCollectionOverview size={20} />
            </div>
            <div className="border w-full shadow-3xl rounded-lg bg-[#FBFDFF]">
              <UserRegistrationTrends/>
            </div>
          </div>
          <div className="w-full border shadow-3xl rounded-lg h-[700px] bg-[#FBFDFF]">
            <div>
              <Chart/>
            </div>
          </div>
          <div className="w-full border shadow-3xl rounded-lg h-[700px] bg-[#FBFDFF]">
            <div>
              <BorrowingPatternsHeatmap/>
            </div>
          </div>
        </div>
      </div> 
    </>
  );
}

export default Dashboard;
