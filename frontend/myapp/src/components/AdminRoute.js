import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const isAdmin = !!localStorage.getItem('admin'); // Check if admin is logged in

    return isAdmin ? children : <Navigate to="/admin-login" />;
}

export default AdminRoute;
