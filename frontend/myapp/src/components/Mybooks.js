import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Mybooks.css';

const MyBooks = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [myBooks, setMyBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user._id) {
            axios.get(`http://localhost:5000/users/${user._id}/my-books`)
                .then(response => setMyBooks(response.data))
                .catch(error => console.error('Error fetching my books:', error));
        } else {
            console.error('User ID not found in localStorage');
        }
    }, [user]);

    const handleBookClick = (bookId) => {
        navigate(`/books/${bookId}`, { state: { fromMyBooks: true } });
    };

    const handleRemoveBook = async (bookId) => {
        console.log(`User ID: ${user._id}, Book ID: ${bookId}`);
        try {
            await axios.delete(`http://localhost:5000/users/${user._id}/my-books/${bookId}`);
            setMyBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
        } catch (error) {
            console.error('Error removing the book:', error);
            alert('Failed to remove the book. Please try again later.');
        }
    };

    if (myBooks.length === 0) return <p>No books in your list</p>;

    return (
        <div className="my-books-container">
            {myBooks.map(book => (
                <div key={book._id} className="book-item">
                    {book.image && <img src={`http://localhost:5000${book.image}`} alt={book.title} />}
                    <div className="book-info">
                     <h2>{book.title}</h2>
                         <div className="button-container">
                           <button onClick={() => handleBookClick(book._id)}>View</button>
                           <button className="remove" onClick={() => handleRemoveBook(book._id)}>Remove</button>
                         </div>
                    </div>

                </div>
            ))}
        </div>
    );
};

export default MyBooks;
