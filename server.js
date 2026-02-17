const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const dbURI = 'mongodb+srv://solomoncollins555_db_user:collins@cluster0.fdalyy8.mongodb.net/?appName=Cluster0';

mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB Atlas!'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));


const studentSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    course: { type: String, required: true },
    gpa: { type: Number, required: true }
});


const Student = mongoose.model('Student', studentSchema);

// GET and POST
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/students', async (req, res) => {
    const newStudent = new Student({
        id: req.body.id,
        name: req.body.name,
        course: req.body.course,
        gpa: req.body.gpa
    });

    try {
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Remove a student by their Custom ID
app.delete('/students/:id', async (req, res) => {
    try {
        const removedStudent = await Student.findOneAndDelete({ id: req.params.id });
        if (!removedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Starting the Server
const serverPort = process.env.PORT || 3000;

app.listen(serverPort, () => {
    console.log(`Server is running on port ${serverPort}`);
});