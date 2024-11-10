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

    const [loadingRecords, setLoadingRecords] = useState(true);
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [loadingBorrows, setLoadingBorrows] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [criticalError, setCriticalError] = useState(null); 

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

    useEffect(() => {
        fetchData('http://localhost:8081/register/data', setRecord, setLoadingRecords, setCriticalError);
        fetchData('http://localhost:8081/bookinfo/data', setBookList, setLoadingBooks, setCriticalError);
        fetchData('http://localhost:8081/borrowed/data', setBorrowList, setLoadingBorrows, setCriticalError);
        fetchData('http://localhost:8081/category/data', setCategoryList, setLoadingCategories, setCriticalError);
    }, []);

    const dailyBorrowData = Array(30).fill(0).map((_, idx) => ({
        day: idx + 1,
        borrowed: Math.floor(Math.random() * 400) + 50 
    }));

    const chartData = {
        labels: dailyBorrowData.map(item => `Day ${item.day}`),
        datasets: [
            {
                label: 'Daily Visitors',
                data: dailyBorrowData.map(item => item.borrowed),
                backgroundColor: '#4f83cc', 
                barThickness: 30, 
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, 
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, 
                }
            },
            y: {
                grid: {
                    color: '#e5e7eb', 
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 100, 
                }
            }
        }
    };

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
            <div className='flex flex-row pt-8 items-center pl-[250px] border-b font-montserrat font-bold text-[25px] p-5 gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'>
                <MdDashboard /><span>Admin Dashboard</span>
            </div>
            <div className='flex flex-col items-center gap-5 pt-[50px] px-8 bg-gray-100 min-h-screen pb-10'>

                <div className='grid grid-cols-3 gap-6 w-full'>

                    <div className="w-full p-6 rounded-lg bg-white shadow-xl flex items-center justify-between ">
                        <div className="bg-red-500 p-3 rounded-full">
                            <FaUser className="text-white text-[30px]" />
                        </div>
                        <div className="m-auto">
                            <span className="text-gray-600 font-medium text-[20px]">Registered Students</span>
                            <span className="justify-center flex text-[20px] font-bold text-gray-900">
                                {loadingRecords ? 'Loading...' : `${record.length > 0 ? record.length : '0'}`}
                            </span>
                        </div>
                    </div>

                    <div className="w-full p-6 rounded-lg bg-white shadow-xl flex items-center justify-between ">
                        <div className="bg-green-500 p-3 rounded-full">
                            <FaBookOpen className="text-white text-[30px]" />
                        </div>
                        <div className="m-auto">
                            <span className="text-gray-600 font-medium text-[20px]">Books Listed</span>
                            <span className="justify-center flex text-[20px] font-bold text-gray-900">
                                {loadingBooks ? 'Loading...' : `${bookList.length > 0 ? bookList.length : '0'}`}
                            </span>
                        </div>
                    </div>

                    <div className="w-full p-6 rounded-lg bg-white shadow-xl flex items-center justify-between ">
                        <div className="bg-blue-500 p-3 rounded-full">
                            <FaClock className="text-white text-[30px]" />
                        </div>
                        <div className="m-auto">
                            <span className="text-gray-600 font-medium text-[20px]">Times Book Issued</span>
                            <span className="justify-center flex text-[20px] font-bold text-gray-900">
                                {loadingBorrows ? 'Loading...' : `${borrowList.length}`}
                            </span>
                        </div>
                    </div>

                    <div className="w-full p-6 rounded-lg bg-white shadow-xl flex items-center justify-between ">
                        <div className="bg-green-500 p-3 rounded-full">
                            <IoPeople className="text-white text-[30px]" />
                        </div>
                        <div className="m-auto">
                            <span className="text-gray-600 font-medium text-[20px]">Authors Listed</span>
                            <span className="justify-center flex text-[20px] font-bold text-gray-900">
                                {loadingBooks ? 'Loading...' : `${[...new Set(bookList.map(book => book.author))].length}`}
                            </span>
                        </div>
                    </div>

                    <div className="w-full p-6 rounded-lg bg-white shadow-xl flex items-center justify-between ">
                        <div className="bg-blue-500 p-3 rounded-full">
                            <TbCategory2 className="text-white text-[30px]" />
                        </div>
                        <div className="m-auto">
                            <span className="text-gray-600 font-medium text-[20px]">Categories</span>
                            <span className="justify-center flex text-[20px] font-bold text-gray-900">
                                {loadingCategories ? 'Loading...' : `${categoryList.length}`}
                            </span>
                        </div>
                    </div>

                    <div className="w-full p-6 rounded-lg bg-white shadow-xl flex items-center justify-between ">
                        <div className="bg-yellow-500 p-3 rounded-full">
                            <GrReturn className="text-white text-[30px]" />
                        </div>
                        <div className="m-auto">
                            <span className="text-gray-600 font-medium text-[20px]">Books Returned</span>
                            <span className="justify-center flex text-[20px] font-bold text-gray-900">
                                {loadingBorrows ? 'Loading...' : `${borrowList.filter(b => b.status === 'Returned').length}`}
                            </span>
                        </div>
                    </div>
                </div>

                <div className='w-full mt-8 p-10 bg-white shadow-xl rounded-lg'>
                    <h2 className='text-lg font-bold mb-4'>Visitors Analytics</h2>
                    {loadingBorrows ? (
                        <div>Loading Chart...</div>
                    ) : (
                        <div className='h-[400px]'>
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    )}
                </div>

                <button className='bg-blue-600 text-white py-3 px-5 mt-6 rounded shadow-lg hover:bg-blue-700 transition duration-300' onClick={exportToExcel}>
                    Export Data to Excel
                </button>
            </div>
        </>
    );
};

export default AdminHome;
