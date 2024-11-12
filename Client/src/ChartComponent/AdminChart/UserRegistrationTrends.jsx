import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register scales and elements with Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const UserRegistrationTrends = () => {
    const [data, setData] = useState([]);
    const [userType, setUserType] = useState('student');
    const [period, setPeriod] = useState('month');

    useEffect(() => {
        fetchRegistrationData();
    }, [userType, period]);

    const fetchRegistrationData = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/registration-trends', {
                params: { userType, period }
            });
            const realData = response.data;
            const mockData = [
                { period: '2024-05', count: 10 },
                { period: '2024-06', count: 12 },
                { period: '2024-07', count: 8 },
                { period: '2024-08', count: 15 },
                { period: '2024-09', count: 10 },
                { period: '2024-10', count: 13 }
            ];
            const combinedData = [...mockData, ...realData];
            setData(combinedData);
        } catch (error) {
            console.error("Error fetching registration data:", error);
        }
    };

    const chartData = {
        labels: data.map(entry => entry.period),
        datasets: [{
            label: `Registrations - ${userType.charAt(0).toUpperCase() + userType.slice(1)}s`,
            data: data.map(entry => entry.count),
            borderColor: '#4EBCFF',
            fill: false,
            tension: 0.1
        }]
    };

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className="mb-10">
                <label className="mr-2">
                    User Type:
                    <select value={userType} onChange={(e) => setUserType(e.target.value)} className="ml-2 p-1 border rounded">
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="librarian">Librarian</option>
                    </select>
                </label>

                <label className="mr-2">
                    Period:
                    <select value={period} onChange={(e) => setPeriod(e.target.value)} className="ml-2 p-1 border rounded">
                        <option value="month">Monthly</option>
                        <option value="week">Weekly</option>
                        <option value="year">Yearly</option>
                    </select>
                </label>
            </div>
            <div style={{ width: '500px', height: '500px', margin: '0 auto' }}>       
                <Line data={chartData} />
            </div>
        </div>
    );
};

export default UserRegistrationTrends;
