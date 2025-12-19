const express = require('express');
const cors = require('cors');
const dataRoute = require('./routes/dataRoutes');
const authRoute = require('./routes/authRoutes');
const { getIo } = require('./socket');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'https://aquifer.casur-consulting.com' 
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Injecter io
app.use((req, res, next) => {
    req.io = getIo();
    next();
});

app.use('/api/data', dataRoute);
app.use('/api/auth', authRoute);

module.exports = app;
