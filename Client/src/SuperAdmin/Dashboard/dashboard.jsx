import React from "react";
import Navigation from "../../Components/navigation";
import BookCollectionOverview from "../../ChartComponent/AdminChart/pie"; 
import UserRegistrationTrends  from '../../ChartComponent/AdminChart/UserRegistrationTrends';
import Chart from '../../ChartComponent/AdminChart/chart';
import BorrowingPatternsHeatmap from "../../ChartComponent/AdminChart/heatmap";



function Dashboard() {
  return (
    <>   
      <div className="bg-[#EFF6FC] min-h-screen overflow-y-auto">   
        <Navigation/>
        <div className="flex flex-col p-[50px] mx-[150px] mt-[30px] font-montserrat gap-10">
          <div className="text-3xl font-bold">
            <h1 className="text-gray-600">Welcome, <span className="text-[#4EBCFF]">Admin!</span> </h1>
          </div>
          <div className="flex justify-between gap-4 ">
            <div className="border w-full shadow-3xl rounded-lg bg-[#FBFDFF] h-[600px]">
              <h2 className="p-4 text-lg font-semibold text-white mb-4 bg-[#343689]">Book Collection Overview</h2>
              <BookCollectionOverview  />
            </div>
            <div className="border w-full shadow-3xl rounded-lg bg-[#FBFDFF] h-[500px]">
            <h2 className="p-4 text-lg font-semibold text-white mb-4 bg-[#343689]">User Registration Trend</h2>
              <UserRegistrationTrends/>
            </div>
          </div>
          <div className="w-full border shadow-3xl rounded-lg h-[700px] bg-[#FBFDFF]">
            <div>
              <h2 className="p-4 text-lg font-semibold text-white mb-4 bg-[#343689]">Borrwing Chart</h2>
              <Chart/>
            </div>
          </div>
          <div className="w-full border shadow-3xl rounded-lg h-[760px] bg-[#F6FBFD]">
            <div>
            <h2 className="p-4 text-lg font-semibold text-white mb-4 bg-[#343689]">Borrowing Patterns by Category</h2>
              <BorrowingPatternsHeatmap/>
            </div>
          </div>
        </div>
      </div> 
    </>
  );
}

export default Dashboard;
