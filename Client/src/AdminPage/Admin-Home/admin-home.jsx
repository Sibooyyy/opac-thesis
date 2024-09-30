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

    const [criticalError, setCriticalError] = useState(null);

    // Fetch registered accounts
    useEffect(() => {
        axios.get('http://localhost:8081/register/data')
            .then(response => {
                if (response.data.status) {
                    setRecord(response.data.data);
                }
                setLoadingRecords(false);
            })
            .catch(error => {
                setCriticalError('Error fetching registered users');
                setLoadingRecords(false);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8081/bookinfo/data')
            .then(response => {
                if (response.data.status) {
                    setBookList(response.data.data);
                }
                setLoadingBooks(false);
            })
            .catch(error => {
                setCriticalError('Error fetching books');
                setLoadingBooks(false);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8081/borrowed/data')
            .then(response => {
                if (response.data.status) {
                    setBorrowList(response.data.data);
                }
                setLoadingBorrows(false);
            })
            .catch(error => {
                setCriticalError('Error fetching borrowed books');
                setLoadingBorrows(false);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8081/category/data')
            .then(response => {
                if (response.data.status) {
                    setCategoryList(response.data.data);
                }
                setLoadingCategories(false);
            })
            .catch(error => {
                setCriticalError('Error fetching categories');
                setLoadingCategories(false);
            });
    }, []);

    const chartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Books Borrowed',
                data: [30, 45, 60, 40, 70, 50],
                backgroundColor: '#17A300',
            },
            {
                label: 'Books Returned',
                data: [20, 35, 55, 30, 65, 45],
                backgroundColor: '#FFB800',
            },
        ],
    };

    // Export data to Excel
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(record);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Library Data");
        XLSX.writeFile(wb, "LibraryAnalytics.xlsx");
    };

    return (
        <>
            <HeaderOption />
            <div className='flex flex-row mt-8 items-center pl-[250px] border-b font-montserrat font-bold text-[25px] p-5 gap-1'>
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
                                {record.length > 0 ? record.length : ""}
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
                                {bookList.length > 0 ? bookList.length : ""}
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
                                {borrowList.length > 0 ? borrowList.length : ""}
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
                                {bookList.length > 0 ? [...new Set(bookList.map(book => book.author))].length : ""}
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
                                {categoryList.length > 0 ? categoryList.length : ""}
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
                                {borrowList.length > 0 ? borrowList.filter(b => b.returned === true).length : ""}
                            </span>
                        )}
                        <span className="text-yellow-500 text-lg font-montserrat">Books Returned</span>
                    </div>
                </div>
                <div className='w-[60%] p-10'>
                    <h2 className='text-lg font-bold mb-4'>Library Analytics</h2>
                    <Bar data={chartData} />
                </div>
            </div>
        </>
    );
};

export default AdminHome;
