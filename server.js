//Importing the necessary dependencies and declare the port location
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
//Middleware that parses incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Allow requests from different origins
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
//Routes for API endpoints
const routes = require('./routes/functions');
app.use(routes);
//Server initialization
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});