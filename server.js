var express = require("express");

const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const HTTP_PORT = 8000;
const API_KEY = "Bearer 8f94826adab8ffebbeadb4f9e161b2dc";

app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});

// Basic route
app.get('/',(req, res) => {
    res.json({ message: 'Hello World' });
});

// PROTECT ALL ROUTES THAT FOLLOW
app.use((req, res, next) => {
    const apiKey = req.get('Authorization')
    if (!apiKey || apiKey !== API_KEY) {
      res.status(401).json({error: 'Votre API KEY n\'est pas valide ou inexistante'})
    } else {
      next()
    }
  })

// Routes 
app.use('/api', routes);