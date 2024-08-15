import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
    const navigate = useNavigate();

    const handleAddBooks = () => {
        navigate('/add-book');
    };

    const handleAddedBooks = () => {
        navigate('/admin/books');
    };

    const handleLogout = () => {
        localStorage.removeItem('admin'); // Remove admin data from localStorage
        navigate('/'); // Navigate to the home page
    };

    return (
        <div className="admin-page-container">
            <div className="button-container">
                <button className="admin-page-button" onClick={handleAddBooks}>
                    Add Books
                </button>
                <button className="admin-page-button" onClick={handleAddedBooks}>
                    Added Books
                </button>
                <button className="admin-page-button logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default AdminPage;
