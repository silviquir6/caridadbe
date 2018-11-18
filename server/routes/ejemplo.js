// app
const express = require('express')
const app = express()


// middleware
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

// model
//const Ejemplo = require('../models/ejemplo');

app.get('/ejemplo', (req, res) => {
        res.json({
            res: 'get ejemplo'
        });

    })
    //crear nuevos registros
app.post('/ejemplo', function(req, res) {
        res.json({
            res: 'post ejemplo'
        });

    })
    //actualizar 
app.put('/ejemplo/:id', function(req, res) {
    res.json({
        res: 'put ejemplo'
    });

})
app.delete('/ejemplo/:id', function(req, res) {
    res.json({
        res: 'delete ejemplo'
    });

})

module.exports = app;