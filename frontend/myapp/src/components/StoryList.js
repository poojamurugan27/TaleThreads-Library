import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StoryList.css';

const StoryList = () => {
    const [stories, setStories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStories = async () => {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));

            if (!token || !user || !user._id) {
                console.error('Missing token or user ID');
                return;
            }

            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`http://localhost:5000/users/${user._id}/stories`, config);
                setStories(response.data);
            } catch (error) {
                console.error('Error loading stories:', error);
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized - possible invalid or expired token');
                }
            }
        };

        fetchStories();
    }, []);

    const handleEdit = (story) => {
        navigate(`/edit-story/${story._id}`, { state: { story } });
    };

    const handleDelete = async (storyId) => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            await axios.delete(`http://localhost:5000/stories/${storyId}`, config);
            setStories(stories.filter((story) => story._id !== storyId));
        } catch (error) {
            console.error('Error deleting story:', error);
        }
    };

    return (
        <div className="story-list">
            <h1 style={{fontSize:'30px' , textAlign:'center'}}>My Stories</h1>
            <button className="create-story-button" onClick={() => navigate('/storyform')}>
                + Create New Story
            </button>
            {stories.map((story) => (
                <div key={story._id} className="story-item">
                    <h2>{story.title}</h2>
                    <p>{story.content}</p>
                    <div className="story-actions">
                        <button className="edit-button" onClick={() => handleEdit(story)}>Edit</button>
                        <button className="delete-button" onClick={() => handleDelete(story._id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StoryList;
