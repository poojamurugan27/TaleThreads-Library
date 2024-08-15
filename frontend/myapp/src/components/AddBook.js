import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddBook.css';

const AddBook = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [useImageUrl, setUseImageUrl] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleImageUrlChange = (e) => {
        const url = e.target.value;
        setImageUrl(url);
        setImagePreview(url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('category', category);
        formData.append('description', description);
        if (useImageUrl) {
            formData.append('imageUrl', imageUrl);
        } else if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post('http://localhost:5000/books', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 201) {
                navigate('/admin/books');
            }
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    return (
        <div className="add-book-container">
            <h1>Add Book</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Author</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                </div>
                <div className="form-group">
                    <label>Book Cover</label>
                    <div className="radio-group">
                        <label>
                            <input type="radio" checked={!useImageUrl} onChange={() => setUseImageUrl(false)} />
                            Upload from device
                        </label>
                        <label>
                            <input type="radio" checked={useImageUrl} onChange={() => setUseImageUrl(true)} />
                            Use image URL
                        </label>
                    </div>
                    {!useImageUrl ? (
                        <input type="file" onChange={handleImageChange} />
                    ) : (
                        <input type="text" value={imageUrl} onChange={handleImageUrlChange} placeholder="Enter image URL" />
                    )}
                    {imagePreview && <img src={imagePreview} alt="Book cover preview" className="image-preview" />}
                </div>
                <button type="submit">Add Book</button>
            </form>
        </div>
    );
}

export default AddBook;
