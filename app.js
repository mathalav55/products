const express = require('express');
const mongoose = require('mongoose')
const app = express();
const product_controller = require('./src/controllers/product.controller')

//connecting to database
mongoose.connect('mongodb+srv://matalav55:zHLhXGm7tcIz8wN2@cluster0.drx9fpc.mongodb.net/shop',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('DB connection successful');
    })
    .catch((err) => {
        console.log(err.message);
    })

app.use('/api/products',product_controller)



app.use('/', (req, res, next) => {
    const err = new Error('not found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
    });
});

module.exports = app;