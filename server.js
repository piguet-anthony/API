var express = require("express");
const routes = require('./routes/routes');

const app = express();

const HTTP_PORT = 8000;

app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});

// Basic route
app.get('/',(req, res) => {
    res.json({ message: 'Hello World' });
});

// Routes "genre"
app.use('/api', routes);