// src/components/UpdateBook.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateBook.css';

const UpdateBook = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [cover, setCover] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the book details from the backend
        axios.get(`http://localhost:5000/books/${id}`)
            .then(response => {
                const bookData = response.data;
                setBook(bookData);
                setTitle(bookData.title);
                setAuthor(bookData.author);
                setCategory(bookData.category);
                setDescription(bookData.description);
                setCover(bookData.image);
            })
            .catch(error => {
                console.error('Error fetching book details:', error);
                setError('Failed to fetch book details. Please try again later.');
            });
    }, [id]);

    const handleUpdate = (event) => {
        event.preventDefault();
    
        // Validate the ID length
        if (id.length !== 24) {
            setError('Invalid book ID');
            return;
        }
    
        const updatedBook = { title, author, category, description, image: cover };
    
        axios.put(`http://localhost:5000/books/${id}`, updatedBook)
            .then(response => {
                navigate('/admin');
            })
            .catch(error => {
                console.error('Error updating book:', error.response ? error.response.data : error.message);
                setError('Failed to update book. Please try again later.');
            });
    };
    

    return (
        <div className="update-book-container">
            <h2>Update Book</h2>
            {error && <p className="error-message">{error}</p>}
            {book ? (
                <form onSubmit={handleUpdate}>
                    <label>
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Author:
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Category:
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Cover URL:
                        <input
                            type="text"
                            value={cover}
                            onChange={(e) => setCover(e.target.value)}
                        />
                    </label>
                    <button type="submit">Update</button>
                </form>
            ) : (
                <p>Loading book details...</p>
            )}
        </div>
    );
}

export default UpdateBook;
