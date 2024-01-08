const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const feedbackSchema = new mongoose.Schema({
  customerName: String,
  feedback: String,
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

// MongoDB Models
const User = mongoose.model('User', userSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Middleware to authenticate user
function authenticateUser(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ auth: false, message: 'Access denied. No token provided.' });

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ "auth": false, message: 'Invalid token.' });
    req.user = user;
    next();
  });
}

// Authentication endpoints
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashedPassword });
    res.json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user.' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ auth: false, message: 'Invalid username or password.' });
  }

  const token = jwt.sign({ userId: user._id, username: user.username }, 'your-secret-key', { expiresIn: 3600 });
  delete user.password
  res.json({ token, user, auth: true });
});

app.get('/isUserAuthenticated', authenticateUser, async (req, res) => {
  res.json({ auth: true, message: "Authenticated" })
});

// CRUD operations for feedback
app.use(authenticateUser);

app.get('/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user.userId });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback.' });
  }
});

app.post('/feedback', async (req, res) => {
  const { customerName, feedback } = req.body;

  try {
    const newFeedback = await Feedback.create({ customerName, feedback, user: req.user.userId });
    res.json(newFeedback);
  } catch (error) {
    res.status(500).json({ message: 'Error creating feedback.' });
  }
});

app.put('/feedback/:id', async (req, res) => {
  const { customerName, feedback } = req.body;

  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.id, { customerName, feedback }, { new: true });
    res.json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ message: 'Error updating feedback.' });
  }
});

app.delete('/feedback/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting feedback.' });
  }
});

// Connect to MongoDB & start server
(async () => {
  try {
    await mongoose.connect('mongodb+srv://arpita:arpita@cluster0.sk0vu9n.mongodb.net/?retryWrites=true&w=majority', {});
    console.log("connected to mongodb");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('cannot connect to mongodb');
    console.error(err)
  }
})();