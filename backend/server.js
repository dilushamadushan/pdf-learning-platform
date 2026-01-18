import dotenv from 'dotenv'
dotenv.config();

import express from 'express';
import core from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import documentRoute from './routers/documentRoute.js';
import chatRoute from './routers/chatRoute.js';
import flshRoute from './routers/flashcardRoute.js';
import quizRoute from './routers/quizeRoute.js'
import summaryRoute from './routers/summaryRoute.js'

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

app.use('/api/documents', documentRoute);
app.use('/api/chat', chatRoute);
app.use('/api/flashcards', flshRoute);
app.use('/api/quizzes', quizRoute);
app.use('/api/summaries', summaryRoute);

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

