const express = require('express')
const app = express()

const TipoEsal = require('../models/tipoEsal');

app.get('/tipoEsal', function(req, res) {
        res.json('get tipoEsal')
    })
    //crear nuevos registros
app.post('/tipoEsal', function(req, res) {
        res.json('post tipoEsal')
    })
    //actualizar 
app.put('/tipoEsal/', function(req, res) {
    res.json('put tipoEsal')
})
app.delete('/tipoEsal/:id', function(req, res) {
    let id = req.params.id;

    TipoEsal.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario no encontrado' }
            });

        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    });



})

module.exports = app;