const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task');

const app = express();

// Middleware לקריאת JSON מהגוף של הבקשה
app.use(express.json());


// מחרוזת החיבור עם המשתמש rasha-26 והסיסמה hello123
const mongoURI = 'mongodb+srv://rasha-26:hello123@cluster0.tdvmbnh.mongodb.net/task_manager_api?retryWrites=true&w=majority';


// חיבור ל-MongoDB Atlas
mongoose.connect(mongoURI)
    .then(() => console.log('✅ Connected to MongoDB Atlas - DB: task_manager_api'))
    .catch(err => {
        console.error('❌ Connection error detail:');
        console.error(err.message);
    });

// 1️⃣ GET – קבלת כל המשימות
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// 2️⃣ POST – יצירת משימה חדשה
app.post('/tasks', async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const newTask = new Task({ title, description, status });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ error: "Failed to create task", details: err.message });
    }
});

// הגדרת פורט והפעלת השרת
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});