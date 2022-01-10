const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

// middleware

app.use(logger)

const whitelist = ['https://www.google.com', 'http://localhost:3500'];
const corsOption = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) callback(null, true)
        else callback(new Error('Not allowed by CORS'))
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOption))

app.use(express.urlencoded({ extended: false }))

app.use(express.json());

app.use(express.static(path.join(__dirname, '/public')))

// route handlers

app.get('^/$|index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
})

app.get('/old-page(.html)?', (req, res) => {
    res.redirect('/new-page')
})

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) res.sendFile(path.join(__dirname, 'views', '404.html'))
    else if (req.accepts('json')) res.json({
        error: '404 Not Found'
    })
    else res.type('txt').send('404 Not Found')
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));