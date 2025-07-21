// app.js

const express = require('express');
const path = require('path'); // Node.js built-in module for path manipulation
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware Setup ---
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (from forms)
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Specify the directory where your EJS templates are located
app.set('views', path.join(__dirname, 'views'));


// --- In-memory Data Storage (for this version) ---
// This array will hold your blog posts.
// Each post will be an object { id: Number, title: String, content: String }
const posts = [];
let nextPostId = 1; // Simple counter for unique IDs


// --- Routes ---

// Home route - displays all blog posts
app.get('/', (req, res) => {
    res.render('home', { posts: posts }); // Pass the 'posts' array to the home.ejs template
});

// Route to show the new post creation form
app.get('/new', (req, res) => {
    res.render('newPost');
});

// Route to handle new post submission
app.post('/new', (req, res) => {
    const { postTitle, postContent } = req.body; // Get data from the form
    const newPost = {
        id: nextPostId++,
        title: postTitle,
        content: postContent
    };
    posts.push(newPost); // Add the new post to our in-memory array
    res.redirect('/'); // Redirect back to the home page after creating the post
});

// Route to view an individual post
app.get('/posts/:id', (req, res) => {
    const requestedPostId = Number(req.params.id); // Get the ID from the URL parameter
    const post = posts.find(p => p.id === requestedPostId); // Find the post by ID

    if (post) {
        res.render('post', { post: post }); // Render the individual post view
    } else {
        res.status(404).send('Post not found'); // Handle case where post doesn't exist
    }
});


// --- Start the server ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open your browser at http://localhost:${PORT}`);
});