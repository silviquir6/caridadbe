const express = require('express')
const app = express()

const Esal = require('../models/esal');

app.get('/esal', function(req, res) {
        res.json('get esal')
    })
    //crear nuevos registros
app.post('/esal', function(req, res) {
        res.json('post esal')
    })
    //actualizar 
app.put('/esal/', function(req, res) {
    res.json('put esal')
})
app.delete('/esal', function(req, res) {
    res.json('delete esal')
})

module.exports = app;