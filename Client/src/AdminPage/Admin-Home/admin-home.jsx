import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; 
import { FaBookOpen, FaClock, FaUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import { TbCategory2 } from "react-icons/tb";
import { GrReturn } from "react-icons/gr";
import HeaderOption from '../../Components/navbar';
import * as XLSX from 'xlsx';

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminHome = () => {
    const [record, setRecord] = useState([]);
    const [bookList, setBookList] = useState([]);
    const [borrowList, setBorrowList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);

    // Separate loading and error states for each fetch
    const [loadingRecords, setLoadingRecords] = useState(true);
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [loadingBorrows, setLoadingBorrows] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [criticalError, setCriticalError] = useState(null); // handle errors

    // Helper function for fetching data
    const fetchData = async (url, setData, setLoading, setError) => {
        try {
            const response = await axios.get(url);
            if (response.data.status) {
                setData(response.data.data);
            }
        } catch (error) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch registered accounts
    useEffect(() => {
        fetchData('http://localhost:8081/register/data', setRecord, setLoadingRecords, setCriticalError);
        fetchData('http://localhost:8081/bookinfo/data', setBookList, setLoadingBooks, setCriticalError);
        fetchData('http://localhost:8081/borrowed/data', setBorrowList, setLoadingBorrows, setCriticalError);
        fetchData('http://localhost:8081/category/data', setCategoryList, setLoadingCategories, setCriticalError);
    }, []);

    // Prepare dynamic chart data based on the fetch result
    const chartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
                label: 'Books Borrowed',
                data: borrowList.map(item => item.borrowedCount),  // Map actual borrow data
                backgroundColor: '#17A300',
            },
            {
                label: 'Books Returned',
                data: borrowList.map(item => item.returnedCount), // Map actual return data
                backgroundColor: '#FFB800',
            },
        ],
    };

    // Export data to Excel
    const exportToExcel = () => {
        const wsUsers = XLSX.utils.json_to_sheet(record);
        const wsBooks = XLSX.utils.json_to_sheet(bookList);
        const wsBorrows = XLSX.utils.json_to_sheet(borrowList);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, wsUsers, "Users");
        XLSX.utils.book_append_sheet(wb, wsBooks, "Books");
        XLSX.utils.book_append_sheet(wb, wsBorrows, "Borrows");

        XLSX.writeFile(wb, "LibraryAnalytics.xlsx");
    };

    return (
        <>
            <HeaderOption />
            <div className='flex flex-row pt-8 items-center pl-[250px] border-b font-montserrat font-bold text-[25px] p-5 gap-1 bg-white'>
                <MdDashboard /><span>Dashboard</span>
            </div>
            <div className='flex flex-col items-center gap-5 h-screen mt-[50px]'>

                <div className='flex flex-row gap-10 h-[200px]'>
                    <div className="w-[200px] border-[2px] rounded-lg border-red-500 flex items-center justify-center flex-col gap-4 bg-white shadow-lg p-5">
                        <FaUser className="text-red-500 text-[40px]" />
                        {loadingRecords ? (
                            <span className="text-red-500 text-lg">Loading...</span>
                        ) : (
                            <span className="text-red-500 text-[30px] font-bold">
                                {record.length > 0 ? record.length : "0"}
                            </span>
                        )}
                        <span className="text-red-500 text-lg font-montserrat text-nowrap">Registered Students</span>
                    </div>
                    <div className="w-[200px] border-[2px] rounded-lg border-green-500 flex items-center justify-center flex-col gap-4 bg-white shadow-lg p-5">
                        <FaBookOpen className="text-green-500 text-[40px]" />
                        {loadingBooks ? (
                            <span className="text-green-500 text-lg">Loading...</span>
                        ) : (
                            <span className="text-green-500 text-[30px] font-bold">
                                {bookList.length > 0 ? bookList.length : "0"}
                            </span>
                        )}
                        <span className="text-green-500 text-lg font-montserrat">Books Listed</span>
                    </div>
                    <div className="w-[200px] border-[2px] rounded-lg border-blue-500 flex items-center justify-center flex-col gap-4 bg-white shadow-lg p-5">
                        <FaClock className="text-blue-500 text-[40px]" />
                        {loadingBorrows ? (
                            <span className="text-blue-500 text-lg">Loading...</span>
                        ) : (
                            <span className="text-blue-500 text-[30px] font-bold">
                                {borrowList.length > 0 ? borrowList.length : "0"}
                            </span>
                        )}
                        <span className="text-blue-500 text-lg font-montserrat text-nowrap">Times Book Issued</span>
                    </div>
                </div>
                <div className='flex flex-row gap-10 h-[200px]'>
                    <div className="w-[200px] border-[2px] rounded-lg border-green-500 flex items-center justify-center flex-col gap-4 bg-white shadow-lg p-5">
                        <IoPeople className="text-green-500 text-[40px]" />
                        {loadingBooks ? (
                            <span className="text-green-500 text-lg">Loading...</span>
                        ) : (
                            <span className="text-green-500 text-[30px] font-bold">
                                {bookList.length > 0 ? [...new Set(bookList.map(book => book.author))].length : "0"}
                            </span>
                        )}
                        <span className="text-green-500 text-lg font-montserrat">Authors Listed</span>
                    </div>
                    <div className="w-[200px] border-[2px] rounded-lg border-blue-500 flex items-center justify-center flex-col gap-4 bg-white shadow-lg p-5">
                        <TbCategory2 className="text-blue-500 text-[40px]" />
                        {loadingCategories ? (
                            <span className="text-blue-500 text-lg">Loading...</span>
                        ) : (
                            <span className="text-blue-500 text-[30px] font-bold">
                                {categoryList.length > 0 ? categoryList.length : "0"}
                            </span>
                        )}
                        <span className="text-blue-500 text-lg font-montserrat">Categories</span>
                    </div>
                    <div className="w-[200px] border-[2px] rounded-lg border-yellow-500 flex items-center justify-center flex-col gap-4 bg-white shadow-lg p-5">
                        <GrReturn className="text-yellow-500 text-[40px]" />
                        {loadingBorrows ? (
                            <span className="text-yellow-500 text-lg">Loading...</span>
                        ) : (
                            <span className="text-yellow-500 text-[30px] font-bold">
                                {borrowList.length > 0 ? borrowList.filter(b => b.status === 'Returned').length : "0"}
                            </span>
                        )}
                        <span className="text-yellow-500 text-lg font-montserrat">Books Returned</span>
                    </div>
                </div>
                <div className='w-[60%] p-10 bg-white'>
                    <h2 className='text-lg font-bold mb-4'>Library Analytics</h2>
                    {loadingBorrows ? (
                        <div>Loading Chart...</div>
                    ) : (
                        <Bar data={chartData} />
                    )}
                </div>
                <button className='bg-blue-500 text-white py-2 px-4 rounded' onClick={exportToExcel}>
                    Export Data to Excel
                </button>
            </div>
        </>
    );
};

export default AdminHome;
