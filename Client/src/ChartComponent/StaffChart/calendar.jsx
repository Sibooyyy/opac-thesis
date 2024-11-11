import React, { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import axios from 'axios';
import { format } from 'date-fns';

const BorrowingPatternsCalendar = () => {
    const [data, setData] = useState([]);
    const [day, setDay] = useState('');
    const [timeRange, setTimeRange] = useState('0-23');
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchData();
    }, [day, timeRange, category]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/borrowing-patterns/calendar', {
                params: { day, timeRange, category }
            });

            console.log("API Response:", response.data); // Debugging: Log API response
            setData(formatData(response.data));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };



    const formatData = (data) => {
        return data.map(entry => ({
            date: format(new Date(entry.pickup_date), 'yyyy-MM-dd'), // Use pickup_date directly
            count: entry.borrow_count
        }));
    };
    

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Daily and Weekly Borrowing Patterns</h2>

            <div className="mb-4">
                <label className="mr-2">
                    Day:
                    <select value={day} onChange={(e) => setDay(e.target.value)} className="ml-2 p-1 border rounded">
                        <option value="">All</option>
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                    </select>
                </label>

                <label className="mr-2">
                    Time Range:
                    <input
                        type="text"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        placeholder="0-23"
                        className="ml-2 p-1 border rounded"
                    />
                </label>

                <label className="mr-2">
                    Category:
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Category"
                        className="ml-2 p-1 border rounded"
                    />
                </label>
            </div>

            <CalendarHeatmap
                startDate={new Date('2024-01-01')}
                endDate={new Date('2024-12-31')}
                values={data}
                classForValue={(value) => {
                    if (!value || value.count === 0) {
                        return 'color-empty';
                    }
                    if (value.count < 5) {
                        return 'color-scale-1';
                    } else if (value.count < 10) {
                        return 'color-scale-2';
                    } else if (value.count < 20) {
                        return 'color-scale-3';
                    } else {
                        return 'color-scale-4';
                    }
                }}
                tooltipDataAttrs={(value) => {
                    return {
                        'data-tip': value ? `${value.date}: ${value.count} borrowings` : 'No borrowings'
                    };
                }}
            />
        </div>
    );
};

export default BorrowingPatternsCalendar;
