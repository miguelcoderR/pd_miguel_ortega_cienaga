import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

//  Import BOTH routers
import clientRoutes from './src/routes/clients.routes.js';
import reportRoutes from './src/routes/reports.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get('/api', (req, res) => {
    res.json({ message: '¡The server is working! 🎉' });
});

// use imported routes
app.use('/api/clients', clientRoutes);
app.use('/api/reports', reportRoutes);

// star server
app.listen(PORT, () => {
    console.log(`🚀 Server running on  http://localhost:${PORT}`);
});