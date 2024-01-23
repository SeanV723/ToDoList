const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

app.use(express.json());

// Test API endpoint
app.get('/', (req, res) => {
    res.send('Hello World, this is the ToDo List app backend!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Perform registration logic
    alert('Registration logic goes here.');
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Perform login logic
    alert('Login logic goes here.');
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();

    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

// Helper method to check password.
userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);

mongoose.connect('mongodb://localhost:27017/todoApp', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true 
});

app.use(express.json());

// Registration endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).send('User already exists');
        }

        user = new User({ username, password });
        await user.save();

        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Invalid Credentials');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send('Invalid Credentials');
        }

        res.send('Login successful');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});