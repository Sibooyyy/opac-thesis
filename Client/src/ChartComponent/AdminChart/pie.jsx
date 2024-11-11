import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

Chart.register(ArcElement, Tooltip, Legend);

const BookCollectionOverview = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [genre, setGenre] = useState('');
    const [publicationYear, setPublicationYear] = useState('');
    const [author, setAuthor] = useState('');

    useEffect(() => {
        fetchBooks();
    }, [genre, publicationYear, author]);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/books', { 
                params: { genre, publicationYear, author }
            });
            setBooks(response.data);

            // Get categories and count for chart data
            const categoryCount = response.data.reduce((acc, book) => {
                acc[book.category] = (acc[book.category] || 0) + 1;
                return acc;
            }, {});

            setCategories(Object.entries(categoryCount));
        } catch (error) {
            console.error("Error fetching books", error);
        }
    };

    const chartData = {
        labels: categories.map(([category]) => category),
        datasets: [{
            data: categories.map(([, count]) => count),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8AC926', '#FF9F1C']
        }]
    };

    return (
        <div>
            <div className="mb-4">
                <label className="mr-2">
                    Genre:
                    <input value={genre} onChange={(e) => setGenre(e.target.value)} className="ml-2 p-1 border rounded" />
                </label>
                <label className="mr-2">
                    Publication Year:
                    <input value={publicationYear} onChange={(e) => setPublicationYear(e.target.value)} className="ml-2 p-1 border rounded" />
                </label>
                <label className="mr-2">
                    Author:
                    <input value={author} onChange={(e) => setAuthor(e.target.value)} className="ml-2 p-1 border rounded" />
                </label>
            </div>
            <Pie data={chartData} />
        </div>
    );
};

export default BookCollectionOverview;
