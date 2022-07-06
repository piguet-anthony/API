var express = require("express");
const ActorRoute = require('./routes/routes');
const GenreRoute = require('./routes/routes');
const FilmRoute = require('./routes/routes');

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
app.use('/api/actor', ActorRoute);
app.use('/api/genre', GenreRoute);
app.use('/api/film', FilmRoute);