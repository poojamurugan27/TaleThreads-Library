import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import BookList from './components/BookList';
import BookDetails from './components/BookDetail';
import AddBook from './components/AddBook';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import MyBooks from './components/Mybooks';
import AdminLogin from './components/AdminLogin';
import AdminPage from './components/AdminPage';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import AdminBookList from './components/AdminBookList'; 
import UpdateBook from './components/UpdateBook';
import StoryList from './components/StoryList'; // Import StoryList
import StoryForm from './components/StoryForm';
// import AddStory from './components/AddStory'; // Import AddStory

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="books" element={<BookList />} />
                <Route path="books/:id" element={<BookDetails />} />
                <Route path="signin" element={<SignIn />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="my-books" element={<MyBooks />} />
                <Route path="stories" element={<StoryList />} /> {/* Add StoryList route */}
                <Route path="storyform" element={<StoryForm />} /> Add AddStory route
                <Route path="/edit-story/:storyId" element={<StoryForm />} />
            </Route>
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/books" element={
                <AdminRoute>
                    <AdminBookList />
                </AdminRoute>
            } />
            <Route path="/add-book" element={
                <AdminRoute>
                    <AddBook />
                </AdminRoute>
            } />
            <Route path="/update-book/:id" element={
                <AdminRoute>
                    <UpdateBook />
                </AdminRoute>
            } />
        </Routes>
    );
}

export default App;
