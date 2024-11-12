import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { Chart } from 'react-chartjs-2';
import axios from 'axios';

// Register Chart.js plugins
ChartJS.register(MatrixController, MatrixElement, CategoryScale, LinearScale, Tooltip, Legend);

const BorrowingPatternsHeatmap = () => {
    const [data, setData] = useState([]);
    const [timeGrouping, setTimeGrouping] = useState('day');
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        fetchData();
    }, [timeGrouping, category, title]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/borrowing-patterns', {
                params: { timeGrouping, category, title }
            });
            const realData = response.data;

            // Generate mock data for the past 6 months
            const mockData = generateMockData();

            // Combine real data with mock data
            const combinedData = [...mockData, ...realData];
            setData(combinedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const generateMockData = () => {
        const months = ['2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10'];
        const categories = ['Fiction', 'Science', 'History', 'Art', 'Technology'];
        const mockData = [];

        months.forEach(month => {
            categories.forEach(category => {
                mockData.push({
                    time_period: month,
                    category: category,
                    borrow_count: Math.floor(Math.random() * 50) + 1 // Random borrow count between 1 and 50
                });
            });
        });

        return mockData;
    };

    const chartData = {
        datasets: [
            {
                label: 'Borrowing Patterns',
                data: data.map(entry => ({
                    x: entry.time_period,
                    y: entry.category,
                    v: entry.borrow_count,
                })),
                backgroundColor(context) {
                    const value = context.dataset.data[context.dataIndex]?.v || 0;
                    return `rgba(30, 144, 255, ${value / 50})`; // Adjust alpha based on value (max 50)
                },
                width: ({ chart }) => (chart.chartArea || {}).width / 7,
                height: ({ chart }) => (chart.chartArea || {}).height / 20, // Reduced height for each matrix element
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    title: (context) => `Time: ${context[0].raw.x}`,
                    label: (context) => `Category: ${context.raw.y}, Borrows: ${context.raw.v}`
                }
            },
        },
        scales: {
            x: {
                type: 'category',
                labels: Array.from(new Set(data.map(entry => entry.time_period))),
                title: { display: true, text: timeGrouping === 'day' ? 'Day of the Week' : 'Month' }
            },
            y: {
                type: 'category',
                labels: Array.from(new Set(data.map(entry => entry.category))),
                title: { display: true, text: 'Category' }
            }
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className="mb-10">
                <label className="mr-2">
                    Time Grouping:
                    <select value={timeGrouping} onChange={(e) => setTimeGrouping(e.target.value)} className="ml-2 p-1 border rounded">
                        <option value="day">Day of the Week</option>
                        <option value="month">Month</option>
                    </select>
                </label>

                <label className="mr-2">
                    Category:
                    <input value={category} onChange={(e) => setCategory(e.target.value)} className="ml-2 p-1 border rounded" placeholder="Category" />
                </label>

                <label className="mr-2">
                    Title:
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className="ml-2 p-1 border rounded" placeholder="Title" />
                </label>
            </div>

            <div style={{ width: '1150px', height: '550px' }}> 
            <Chart type="matrix" data={chartData} options={options} />
            </div>
        </div>
    );
};

export default BorrowingPatternsHeatmap;
