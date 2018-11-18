// app
const express = require('express')
const app = express()


// middleware
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

// model
const Municipio = require('../models/municipio');

app.get('/municipio', (req, res) => {
        res.json({
            res: 'get municipio'
        });

    })
    //crear nuevos registros
app.post('/municipio', [verificaToken, verificaAdminRole], function(req, res) {

        let body = req.body;

        let municipio = new Municipio({
            descripcion: body.descripcion,
            usuario: req.usuario._id
        });

        municipio.save((err, municipioDB) => {

            if (err) {

                return res.status(400).json({
                    ok: false,
                    err
                });

            }

            res.json({
                ok: true,
                municipio: municipioDB
            })


        });

    })
    //actualizar 
app.put('/municipio/:id', function(req, res) {
    res.json({
        res: 'put municipio'
    });

})
app.delete('/municipio/:id', function(req, res) {
    res.json({
        res: 'delete municipio'
    });

})

module.exports = app;