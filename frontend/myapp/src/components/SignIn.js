import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';
import './SignIn.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/signin', { email, password });
            const { token, user } = response.data;

            if (response.status === 200) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                if (error.response.data.message === 'User not found') {
                    setPopupMessage('Sign up to login');
                } else if (error.response.data.message === 'Invalid credentials') {
                    setPopupMessage('Wrong password');
                }
            } else {
                setPopupMessage('Something went wrong. Please try again later.');
            }
        }
    };

    const closePopup = () => {
        setPopupMessage('');
    };

    return (
        <div className="sign-in-container">
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" style={{backgroundColor:'#ff6439'}}>Sign In</button>
                <p style={{ paddingLeft: '80px' }}>
                    Don't have an account? <a href='signup' style={{ color: 'red' }}>Sign Up</a>
                </p>
            </form>
            {popupMessage && <Popup message={popupMessage} onClose={closePopup} />}
        </div>
    );
};

export default SignIn;
