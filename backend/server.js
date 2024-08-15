const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // Serve static files from the 'public' folder
app.use(fileUpload());

const connectionString = process.env.MONGO_URI || 'mongodb+srv://poojamurugan27092003:pooja27@cluster0.cgaycbp.mongodb.net/bookLibrary?retryWrites=true&w=majority&appName=Cluster0';

const connectWithRetry = () => {
    console.log('MongoDB connection with retry');
    return mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
};

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
    console.log(`MongoDB connection error: ${err}`);
    setTimeout(connectWithRetry, 5000); // Retry connection every 5 seconds
});

connectWithRetry();

// User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    myBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});

const User = mongoose.model('User', UserSchema);

// Book Schema
const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    category: String,
    description: String,
    image: String
});

const Book = mongoose.model('Book', BookSchema);

const adminCredentials = {
    email: 'poojam@gmail.com',
    password: 'pooja27'
};


const StorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Story = mongoose.model('Story', StorySchema);


const authenticateUser = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided or token is malformed' });
    }

    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, 'secret');
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid or expired' });
    }
};


// Routes
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/books', async (req, res) => {
    try {
        const { title, author, category, description } = req.body;
        let imagePath;

        if (req.files && req.files.image) {
            const image = req.files.image;
            imagePath = `/uploads/${image.name}`;
            await image.mv(`./public${imagePath}`);
        } else if (req.body.imageUrl) {
            imagePath = req.body.imageUrl;
        }

        const newBook = new Book({
            title,
            author,
            category,
            description,
            image: imagePath
        });

        await newBook.save();
        res.status(201).send(newBook);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.json(book);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete('/books/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Book deleted' });
    } catch (error) {
        res.status(500).send(error);
    }
});


app.put('/books/:id', async (req, res) => {
    console.log('Book ID:', req.params.id);
    console.log('Request Body:', req.body);

    try {
        const { title, author, category, description, image } = req.body;
        const updatedBook = { title, author, category, description, image };

        const book = await Book.findByIdAndUpdate(req.params.id, updatedBook, { new: true });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(book);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


app.get('/books/search', async (req, res) => {
    try {
        console.log('Search Query:', req.query.q); // Log the query to check if it's correctly received

        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: 'Query parameter is missing' });
        }

        const books = await Book.find({ title: new RegExp(query, 'i') });
        // res.json(books);

        console.log('Books Found:', books); // Log the results to ensure proper querying

        res.json(books);
    } catch (error) {
        console.error('Error during book search:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});




app.post('/books/add-to-my-books', async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.myBooks.includes(bookId)) {
            user.myBooks.push(bookId);
            await user.save();
            res.status(200).json({ message: 'Book added to your list' });
        } else {
            res.status(400).json({ message: 'Book already in your list' });
        }
    } catch (error) {
        console.error('Error adding book to my books:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


app.get('/users/:id/my-books', async (req, res) => {
    // console.log('Request received for user ID:', req.params.id);
    try {
        const user = await User.findById(req.params.id).populate('myBooks');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.myBooks);
    } catch (error) {
        console.error('Error retrieving my books:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});



// Route to remove a book from "My Books"
app.delete('/users/:userId/my-books/:bookId', async (req, res) => {
    console.log(`User ID: ${req.params.userId}, Book ID: ${req.params.bookId}`);
    try {
        const { userId, bookId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the book from the user's "My Books" list
        const bookIndex = user.myBooks.indexOf(bookId);
        if (bookIndex > -1) {
            user.myBooks.splice(bookIndex, 1); // Remove the book from the array
            await user.save();
            return res.status(200).json({ message: 'Book removed from your list' });
        } else {
            return res.status(404).json({ message: 'Book not found in your list' });
        }
    } catch (error) {
        console.error('Error removing book from my books:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});




app.post('/admin/signin', (req, res) => {
    const { email, password } = req.body;
    if (email === adminCredentials.email && password === adminCredentials.password) {
        const token = jwt.sign({ email }, 'admin-secret', { expiresIn: '1h' });
        res.json({ success: true, admin: { email }, token });
    } else {
        res.json({ success: false, message: 'Not admin credentials' });
    }
});


// Create a new story
app.post('/stories', authenticateUser, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newStory = new Story({ title, content, author: req.userId });
        await newStory.save();
        res.status(201).json(newStory);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Edit an existing story
app.put('/stories/:id', authenticateUser, async (req, res) => {
    try {
        const { title, content } = req.body;
        const updatedStory = { title, content, updatedAt: Date.now() };

        const story = await Story.findOneAndUpdate(
            { _id: req.params.id, author: req.userId }, // Ensure the story belongs to the authenticated user
            updatedStory,
            { new: true }
        );
        if (!story) {
            return res.status(404).json({ message: 'Story not found or unauthorized' });
        }

        res.status(200).json(story);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Delete a story
app.delete('/stories/:id', authenticateUser, async (req, res) => {
    try {
        const story = await Story.findOneAndDelete({ _id: req.params.id, author: req.userId }); // Ensure the story belongs to the authenticated user
        if (!story) {
            return res.status(404).json({ message: 'Story not found or unauthorized' });
        }
        res.json({ message: 'Story deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Get a user's stories
app.get('/users/:userId/stories', authenticateUser, async (req, res) => {
    try {
        if (req.userId !== req.params.userId) {
            return res.status(403).json({ message: 'Forbidden' }); // Ensure a user can only access their own stories
        }

        const stories = await Story.find({ author: req.userId });
        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
