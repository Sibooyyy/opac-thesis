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
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Prepare data for heatmap
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
                    return `rgba(30, 144, 255, ${value / 10})`; // Adjust alpha based on value
                },
                width: ({ chart }) => (chart.chartArea || {}).width / 7,
                height: ({ chart }) => (chart.chartArea || {}).height / 12,
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
        <div>
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Borrowing Patterns by Category</h2>

            <div className="mb-4">
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

            <Chart type="matrix" data={chartData} options={options} />
        </div>
    );
};

export default BorrowingPatternsHeatmap;
