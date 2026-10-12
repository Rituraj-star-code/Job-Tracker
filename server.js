import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { Application } from './models/Application.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Frontend assets host karne ke liye

// 1. CREATE: Save new job application
app.post('/api/applications', async (req, res) => {
    const { company_name, role_profile, status } = req.body;
    try {
        const newApp = new Application({ company_name, role_profile, status });
        const savedApp = await newApp.save();
        res.status(201).json(savedApp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. READ: Get all job applications
app.get('/api/applications', async (req, res) => {
    try {
        const apps = await Application.find().sort({ applied_date: -1 });
        res.json(apps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. UPDATE: Change application status
// 3. UPDATE: Change application full details (Name, Role, Status)
app.put('/api/applications/:id', async (req, res) => {
    const { id } = req.params;
    const { company_name, role_profile, status } = req.body;
    try {
        await Application.findByIdAndUpdate(
            id, 
            { company_name, role_profile, status }, 
            { new: true }
        );
        res.json({ message: 'Application updated successfully in MongoDB' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. DELETE: Drop a job application
app.delete('/api/applications/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Application.findByIdAndDelete(id);
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server Listen
app.listen(PORT, () => {
    console.log(`Server blasting live on port http://localhost:${PORT}`);
});