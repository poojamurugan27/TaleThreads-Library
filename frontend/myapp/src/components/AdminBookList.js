import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminBookList.css';

const AdminBookList = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the list of books from the backend
        axios.get('http://localhost:5000/books')
            .then(response => {
                console.log('Books data:', response.data);
                setBooks(response.data);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                setError('Failed to fetch books. Please try again later.');
            });
    }, []);

    const handleAddBooks = () => {
        navigate('/add-book');
    };

    const handleLogout = () => {
        localStorage.removeItem('admin'); // Remove admin data from localStorage
        navigate('/'); // Navigate to the home page
    };

    const handleDelete = (id) => {
        // Delete the book with the specified ID
        axios.delete(`http://localhost:5000/books/${id}`)
            .then(response => {
                // Update the list of books after deletion
                setBooks(books.filter(book => book._id !== id));
            })
            .catch(error => {
                console.error('Error deleting book:', error);
                setError('Failed to delete the book. Please try again later.');
            });
    };

    const handleUpdate = (id) => {
        // Navigate to the update book page
        navigate(`/update-book/${id}`);
    };

    return (
        <div className="admin-book-list-container">
            <div className="admin-page-buttons-container">
                <button className="admin-page-button" onClick={handleAddBooks}>
                    Add Books
                </button>
                <button className="admin-page-button logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <h2>Added Books</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="book-grid">
                {books.map(book => (
                    <div key={book._id} className="book-item">
                        {book.image && <img src={`http://localhost:5000${book.image}`} alt={book.title} />}
                        <div className="book-info">
                            <h3>{book.title}</h3>
                        </div>
                        <div className="book-actions">
                            <button onClick={() => handleUpdate(book._id)}>Update</button>
                            <button onClick={() => handleDelete(book._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminBookList;
