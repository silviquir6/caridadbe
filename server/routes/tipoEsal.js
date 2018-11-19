//app
const express = require('express')
const app = express()

// middleware
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

//model
const TipoEsal = require('../models/tipoEsal');


//==============================
//Mostrar todos los tipoEsal
//==============================
app.get('/tipoEsal', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //q campos qremos mostrar
    TipoEsal.find({}, 'descripcion usuario')
        .skip(desde)
        .limit(limite)
        .exec((err, tipoEsals) => {

            if (err) {

                return res.status(400).json({
                    ok: false,
                    err
                });

            }
            TipoEsal.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    tipoEsals,
                    cuantos: conteo
                });

            });




        });




})

//==================================
//Mostrar todos los tipoEsal por ID
//==================================
app.get('/tipoEsal/:id', function(req, res) {

    let id = req.params.id;

    TipoEsal.findById(id, (err, tipoEsalDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }
        if (!tipoEsalDB) {
            return res.status(400).json({
                ok: false,
                err
            });


        }

        res.json({
            ok: true,
            esal: tipoEsalDB
        })

    });


})

//==============================
//Crear un tipoEsal
//==============================
app.post('/tipoEsal', [verificaToken, verificaAdminRole], function(req, res) {

        let body = req.body;

        let tipoEsal = new TipoEsal({
            descripcion: body.descripcion,
            usuario: req.usuario._id

        });

        tipoEsal.save((err, tipoEsalDB) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            if (!tipoEsalDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });


            }

            res.json({
                ok: true,
                tipoEsal: tipoEsalDB
            })


        });


    })
    //==============================
    //Actualizar un tipoEsal
    //==============================
app.put('/tipoEsal/:id', [verificaToken, verificaAdminRole], function(req, res) {

        let id = req.params.id;
        let body = req.body;

        TipoEsal.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, tipoEsalDB) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            if (!tipoEsalDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });


            }

            res.json({
                ok: true,
                tipoEsal: tipoEsalDB
            })
        });

    })
    //==============================
    //Delete un tipoEsal
    //==============================
app.delete('/tipoEsal/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;

    TipoEsal.findByIdAndRemove(id, (err, tipoEsalBorrada) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        }
        if (!tipoEsalBorrada) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario no encontrado' }
            });

        }

        res.json({
            ok: true,
            usuario: tipoEsalBorrada
        })

    });



})

module.exports = app;