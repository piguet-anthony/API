var md5 = require('md5');
var express = require("express");

const HTTP_PORT = 8000;
const API_KEY = "Bearer 8f94826adab8ffebbeadb4f9e161b2dc";
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});

// Basic route
app.get('/',(req, res) => {
    res.json({ message: 'Hello World' });
});

// Vérification du la clef d'API
app.use((req, res, next) => {
    const apiKey = req.get('Authorization');
    if (!apiKey || apiKey !== API_KEY) {
        res.status(401).json({error: 'Votre API KEY n\'est pas valide ou inexistante'})
    } else {
        next()
    }
})

// Routes 
app.use('/api', routes);