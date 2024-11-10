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
            setData(response.data);
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
        <div>
            <h2 className="text-lg font-semibold text-gray-600 mb-2">User Registration Trends</h2>
            
            <div className="mb-4">
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

            <Line data={chartData} />
        </div>
    );
};

export default UserRegistrationTrends;
