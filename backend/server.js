import dotenv from 'dotenv'
dotenv.config();

import express from 'express';
import core from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import documentRoute from './routers/documentRoute.js'
import aiRoute from './routers/aiRoute.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

app.use(
    core({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/document', documentRoute);
app.use('/api/ai', aiRoute);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Router not found",
        statusCode: 404
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running in ${PORT}`);
})

