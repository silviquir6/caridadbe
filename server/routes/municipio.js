// app
const express = require('express')
const app = express()
    // underscore
const _ = require('underscore');

// middleware
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

// model
const Municipio = require('../models/municipio');

app.get('/municipio', (req, res) => {

    //q campos qremos mostrar
    Municipio.find({})
        .populate('usuario')
        .exec((err, municipios) => {

            if (err) {

                return res.status(400).json({
                    ok: false,
                    err
                });

            }
            Municipio.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    municipios,
                    cuantos: conteo
                });

            });

        });

})


//===================================================
//Buscar municipio por departamento
//===================================================

app.get('/municipio/:idDepartamento', verificaToken, function(req, res) {
    let idDepartamento = req.params.idDepartamento;

    //q campos qremos mostrar
    Municipio.find({ departamento: idDepartamento }, '_id, descripcion')
        .exec((err, municipios) => {

            if (err) {

                return res.status(400).json({
                    ok: false,
                    err
                });

            }
            Municipio.count({ departamento: idDepartamento }, (err, conteo) => {
                res.json({
                    ok: true,
                    municipios,
                    cuantos: conteo
                });

            });

        });



});

//crear nuevos registros
app.post('/municipio', [verificaToken, verificaAdminRole], function(req, res) {

        let body = req.body;

        let municipio = new Municipio({
            descripcion: body.descripcion,
            usuario: req.usuario._id,
            departamento: body.departamento
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
app.put('/municipio/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    req.body.usuario = req.usuario._id;

    let body = _.pick(req.body, ['descripcion', 'usuario']);

    Municipio.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, municipioDB) => {

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
app.delete('/municipio/:id', function(req, res) {
    let id = req.params.id;

    Municipio.findByIdAndRemove(id, (err, municipioBorrado) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        }
        if (!municipioBorrado) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Municipio no encontrado' }
            });

        }

        res.json({
            ok: true,
            municipio: municipioBorrado
        })

    });


})

module.exports = app;