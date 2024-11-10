import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register chart elements with Chart.js
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BookBorrowingActivity = () => {
    const [data, setData] = useState([]);
    const [period, setPeriod] = useState('month');
    const [category, setCategory] = useState('');
    const [designation, setDesignation] = useState('');

    useEffect(() => {
        fetchData();
    }, [period, category, designation]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/borrowed-books-activity', {
                params: { period, category, designation }
            });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Prepare data for stacked bar chart
    const chartData = {
        labels: [...new Set(data.map(entry => entry.period))],
        datasets: [
            {
                label: 'Students',
                data: data.filter(entry => entry.designation === 'Student').map(entry => entry.count),
                backgroundColor: '#4EBCFF'
            },
            {
                label: 'Faculty',
                data: data.filter(entry => entry.designation === 'Faculty').map(entry => entry.count),
                backgroundColor: '#FF6384'
            }
        ]
    };

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Book Borrowing Activity</h2>

            <div className="mb-4">
                <label className="mr-2">
                    Period:
                    <select value={period} onChange={(e) => setPeriod(e.target.value)} className="ml-2 p-1 border rounded">
                        <option value="month">Monthly</option>
                        <option value="week">Weekly</option>
                        <option value="year">Yearly</option>
                    </select>
                </label>

                <label className="mr-2">
                    Category:
                    <input value={category} onChange={(e) => setCategory(e.target.value)} className="ml-2 p-1 border rounded" placeholder="Category" />
                </label>

                <label className="mr-2">
                    User Type:
                    <select value={designation} onChange={(e) => setDesignation(e.target.value)} className="ml-2 p-1 border rounded">
                        <option value="">All</option>
                        <option value="Student">Students</option>
                        <option value="Faculty">Faculty</option>
                    </select>
                </label>
            </div>

            <Bar
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: { mode: 'index', intersect: false }
                    },
                    scales: {
                        x: { stacked: true },
                        y: { stacked: true, beginAtZero: true }
                    }
                }}
            />
        </div>
    );
};

export default BookBorrowingActivity;
