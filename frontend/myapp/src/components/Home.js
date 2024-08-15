import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    const handleStartReading = () => {
        navigate('/books');
    };

    const handleStartWriting = () => {
        navigate('/stories');
    };

    return (
        <div className="home-container">
            <div className="content">
                <h1 className="welcome-message">Hey, we're TaleThreads</h1>
                <p className="paragraph">
                Browse through a diverse collection of genres, from thrilling mysteries 
                to heartwarming romances, carefully curated to satisfy every reader's taste.
                 Discover new authors or revisit classics, all at your fingertips. Whether
                  you're seeking an adrenaline-pumping adventure or a heartwarming tale, our 
                  library has something special waiting for you.
                </p><br/>
                <div className="button-container1">
                    <button onClick={handleStartReading}>Start Reading</button>
                    <button onClick={handleStartWriting}>Start Writing</button>
                </div>
            </div>
        </div>
    );
}

export default Home;