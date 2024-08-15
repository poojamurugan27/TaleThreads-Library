import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './BookList.css';

const BookList = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/books')
            .then(response => setBooks(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="book-list-container">
            <div className="book-grid">
                {books.map(book => (
                    <Link to={`/books/${book._id}`} key={book._id} className="book-item">
                        <div className="book-card">
                            {book.image && <img src={`http://localhost:5000${book.image}`} alt={book.title} />}
                            <p className="book-title">{book.title}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default BookList;
