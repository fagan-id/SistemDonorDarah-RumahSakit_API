// Import Express
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {conn} = require('./database');
const specs = require('./swagger');
const swaggerUI = require('swagger-ui-express');


// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect PostgreSQL 
conn.connect()
    .then(() => console.log("connected"))
    .catch(err => console.error("Connection error", err.stack));

// Middleware
app.use(cors());
app.use(express.json());


// API ROUTE
const donorRouter = require('./route/donor');
const bloodRouter = require('./route/blood_stock');
const requestRouter = require('./route/request');
const authRouter = require('./route/auth');
const confirmedRouter = require('./route/confirmed');
const userRouter = require('./route/user');

app.use("/api/donor",donorRouter);
app.use("/api/stock",bloodRouter);
app.use('/api/request',requestRouter);
app.use('/api/auth',authRouter);
app.use('/api/confirmed',confirmedRouter);
app.use('/api/user',userRouter);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(specs))


// Basic route
app.get('/', (req, res) => {
    res.send(`Access API : http://localhost:${PORT}/api`);
    res.send(`Access Docs Via : https://localhost:${PORT}/api-docs`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
    console.log(`Access Docs Via : https://localhost:${PORT}/api-docs`)
  });