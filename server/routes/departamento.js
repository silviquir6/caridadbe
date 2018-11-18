// app
const express = require('express')
const app = express()


// middleware
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

// model
const Departamento = require('../models/departamento');

app.get('/departamento', (req, res) => {
        res.json({
            res: 'get departamento'
        });

    })
    //crear nuevos registros
app.post('/departamento', [verificaToken, verificaAdminRole], function(req, res) {
        let body = req.body;

        let departamento = new Departamento({
            descripcion: body.descripcion,
            usuario: req.usuario._id
        });

        departamento.save((err, departamentoBD) => {

            if (err) {

                return res.status(400).json({
                    ok: false,
                    err
                });

            }

            res.json({
                ok: true,
                departamento: departamentoBD
            })


        });

    })
    //actualizar 
app.put('/departamento/:id', function(req, res) {
    res.json({
        res: 'put departamento'
    });

})
app.delete('/departamento/:id', function(req, res) {
    res.json({
        res: 'delete departamento'
    });

});

module.exports = app;