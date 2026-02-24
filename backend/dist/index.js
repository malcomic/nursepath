import express from 'express';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.get('/api/health', (req, res) => {
    res.json({ message: 'Backend is running!' });
});
// Example API route
app.get('/api/data', (req, res) => {
    res.json({
        data: 'Sample data from backend',
        timestamp: new Date().toISOString()
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map