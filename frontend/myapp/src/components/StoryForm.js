import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StoryForm.css';

const StoryForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const editingStory = location.state?.story;

    useEffect(() => {
        if (editingStory) {
            setTitle(editingStory.title);
            setContent(editingStory.content);
        }
    }, [editingStory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            if (editingStory) {
                // Update the story
                await axios.put(`http://localhost:5000/stories/${editingStory._id}`, { title, content }, config);
            } else {
                // Create a new story
                await axios.post('http://localhost:5000/stories', { title, content }, config);
            }
            navigate('/stories');
        } catch (error) {
            console.error('Error saving story:', error);
        }
    };

    return (
        <div className="story-form-container">
            <h1>{editingStory ? 'Edit Story' : 'Create New Story'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="story-form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        className="story-form-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="story-form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        className="story-form-textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="story-form-submit">
                    {editingStory ? 'Update Story' : 'Create Story'}
                </button>
            </form>
        </div>
    );
};

export default StoryForm;
