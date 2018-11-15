const express = require('express')
const app = express()

const Donacion = require('../models/donacion');

app.get('/donacion', function(req, res) {
        res.json('get donacion')
    })
    //crear nuevos registros
app.post('/donacion', function(req, res) {
        res.json('post donacion')
    })
    //actualizar 
app.put('/donacion/', function(req, res) {
    res.json('put donacion')
})
app.delete('/donacion', function(req, res) {
    res.json('delete donacion')
})

module.exports = app;