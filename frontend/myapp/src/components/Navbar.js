import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const NavBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false); // State to control the popup display
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleSearch = async (event) => {
        event.preventDefault();
        if (!searchQuery.trim()) {
            setError('Search query cannot be empty');
            setShowError(true);
            return;
        }
        try {
            const response = await axios.get(`http://localhost:5000/books/search?q=${encodeURIComponent(searchQuery)}`);
            const results = response.data;
            if (results.length === 0) {
                setError('No books found.');
                setShowError(true); // Show the error popup
            } else {
                setSearchResults(results);
                setError(null);
                setShowError(false); // Hide the error popup
            }
        } catch (error) {
            console.error('Error searching books:', error);
            setError('An error occurred while searching for books.');
            setShowError(true); // Show the error popup
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleMybooks = () => {
        navigate('/my-books');
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-logo">
                    <Link to="/">TaleThreads</Link>
                </div>
                <div className="navbar-search">
                    <form onSubmit={handleSearch} className="search-form">
                        <input 
                            type="text" 
                            placeholder="Search books..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        {/* <button type="submit" className="search-button">Search</button> */}
                    </form>
                </div>
                <div className="navbar-links">
                    {user ? (
                        <>
                            <span>Welcome, {user.name}</span>
                            <button onClick={handleMybooks} className="mybooks-button">My Books</button>
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/signin" style={{ fontWeight: 'bold' }}>Sign In</Link>
                        </>
                    )}
                    <Link to="/admin-login" style={{ fontWeight: 'bold' }}>Admin</Link>
                </div>
            </nav>
            {showError && <div className="error-popup">{error}</div>} {/* Popup for errors */}
            {searchResults.length > 0 && (
                <div className="search-results">
                    <h2>Search Results:</h2>
                    <ul>
                        {searchResults.map((book) => (
                            <li key={book._id}>
                                <h3>{book.title}</h3>
                                <p>{book.author}</p>
                                <p>{book.category}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NavBar;
