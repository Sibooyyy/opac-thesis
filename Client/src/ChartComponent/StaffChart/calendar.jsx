import React, { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import axios from 'axios';
import { format, subMonths, eachDayOfInterval } from 'date-fns';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import './calendar.css';

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
            const realData = formatData(response.data);

            const mockData = generateMockData();

            const combinedData = [...mockData, ...realData];
            setData(combinedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const generateMockData = () => {
        const endDate = new Date();
        const startDate = subMonths(endDate, 5);
        const days = eachDayOfInterval({ start: startDate, end: endDate });

        return days.map(day => ({
            date: format(day, 'yyyy-MM-dd'),
            count: Math.floor(Math.random() * 20) + 1 // Random count between 1 and 20
        }));
    };

    const formatData = (data) => {
        return data.map(entry => ({
            date: format(new Date(entry.pickup_date), 'yyyy-MM-dd'), 
            count: entry.borrow_count
        }));
    };

    const getMonthClass = (date) => {
        const month = new Date(date).getMonth();
        return `month-${month + 1}`;
    };

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className="mb-10">
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

            <div style={{ width: '650px', height: '550px' }}> 
                <CalendarHeatmap
                    startDate={subMonths(new Date(), 5)}
                    endDate={new Date()}
                    values={data}
                    classForValue={(value) => {
                        if (!value || value.count === 0) {
                            return 'color-empty';
                        }
                        const intensityClass = 
                            value.count < 5 ? 'color-scale-1' :
                            value.count < 10 ? 'color-scale-2' :
                            value.count < 20 ? 'color-scale-3' : 'color-scale-4';
                        
                        const monthClass = getMonthClass(value.date);
                        return `${intensityClass} ${monthClass}`;
                    }}
                    tooltipDataAttrs={(value) => {
                        return {
                            'data-tooltip-id': 'borrowing-tooltip',
                            'data-tooltip-content': value ? `${value.date}: ${value.count} borrowings` : 'No borrowings'
                        };
                    }}
                />
                <ReactTooltip id="borrowing-tooltip" />
            </div>
        </div>
    );
};

export default BorrowingPatternsCalendar;
