import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/admin/signin', { email, password });
            if (response.data.success) {
                localStorage.setItem('admin', JSON.stringify(response.data.admin));
                navigate('/admin/books');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Failed to login. Please check your credentials.');
        }
    };

    return (
        <div className="admin-login-container">
            <form onSubmit={handleLogin} className="admin-login-form">
                <h2>Admin Login</h2>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}

export default AdminLogin;
