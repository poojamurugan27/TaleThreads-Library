import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './BookDetail.css';

const BookDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const [book, setBook] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        axios.get(`http://localhost:5000/books/${id}`)
            .then(response => setBook(response.data))
            .catch(error => console.error(error));
    }, [id]);

    const handleAddToMyBooks = async () => {
        try {
            console.log('Adding book to my books:', { userId: user._id, bookId: book._id });
    
            const response = await axios.post('http://localhost:5000/books/add-to-my-books', {
                userId: user._id,
                bookId: book._id
            });
    
            if (response.status === 200) {
                alert('Book added to your list');
            }
        } catch (error) {
            console.error('Error adding book to my books:', error);
            alert('Sign in to add books');
        }
    };
    
    

    if (!book) return <p>Loading...</p>;

    return (
        <div className="book-details-container">
            {book.image && <img className="book-cover" src={`http://localhost:5000${book.image}`} alt={book.title} />}
            <div className="book-details">
                <h1>{book.title}</h1>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Category:</strong> {book.category}</p>
                <p><strong>Description:</strong> {book.description}</p>
                {/* {user && <button onClick={handleAddToMyBooks} className="add-to-my-books-button">Add to My Books</button>} */}
                {!location.state?.fromMyBooks && (
                    <button onClick={handleAddToMyBooks}>Add to My Books</button>
                )}
            </div>
        </div>
    );
}

export default BookDetails;
