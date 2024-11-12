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
    const [genres, setGenres] = useState([]);
    const [years, setYears] = useState([]);
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        fetchBooks();
        fetchFilters();
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

    const fetchFilters = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/books/filters');
            setGenres(response.data.genres || []);
            setYears(response.data.years || []);
            setAuthors(response.data.authors || []);
        } catch (error) {
            console.error("Error fetching filters", error);
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
        <div className='flex flex-col justify-center items-center'>
            <div className="mb-4">
                <label className="mr-2">
                    Genre:
                    <select value={genre} onChange={(e) => setGenre(e.target.value)} className="ml-2 p-1 border rounded">
                        <option value="">All</option>
                        {genres.map((g, index) => (
                            <option key={index} value={g}>{g}</option>
                        ))}
                    </select>
                </label>
                <label className="mr-2">
                    Publication Year:
                    <select value={publicationYear} onChange={(e) => setPublicationYear(e.target.value)} className="ml-2 p-1 border rounded">
                        <option value="">All</option>
                        {years.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </select>
                </label>
                <label className="mr-2">
                    Author:
                    <select value={author} onChange={(e) => setAuthor(e.target.value)} className="ml-2 p-1 border rounded">
                        <option value="">All</option>
                        {authors.map((a, index) => (
                            <option key={index} value={a}>{a}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div style={{ width: '400px', height: '400px', margin: '0 auto' }}>
                <Pie data={chartData} />
            </div>
        </div>
    );
};

export default BookCollectionOverview;
