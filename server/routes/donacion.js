//app
const express = require('express')
const app = express()

// middleware
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

//model
const Donacion = require('../models/donacion');

//==============================
//Mostrar todas las donaciones
//==============================

app.get('/donacion', verificaToken, function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //q campos qremos mostrar
    Donacion.find({}, 'valor fecha esal usuario')
        .populate('esal')
        .populate('usuario')
        .skip(desde)
        .limit(limite)
        .exec((err, donaciones) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });

            }
            Donacion.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    donaciones,
                    cuantos: conteo
                });

            });



        });



})

//==============================
//Mostrar una donaci�n por Id  
//==============================
app.get('/donacion/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    Donacion.findById(id, (err, donacionDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }
        if (!donacionDB) {
            return res.status(400).json({
                ok: false,
                err
            });


        }

        res.json({
            ok: true,
            esal: donacionDB
        })

    });



})


//==============================
//Crear nueva donaci�n
//==============================
app.post('/donacion', verificaToken, function(req, res) {
    let body = req.body;

    let donacion = new Donacion({
        valor: body.valor,
        esal: body.esal,
        usuario: req.usuario._id

    });

    donacion.save((err, donacionDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!donacionDB) {
            return res.status(400).json({
                ok: false,
                err
            });


        }

        res.json({
            ok: true,
            donacion: donacionDB
        })


    });

})


//==============================
//Actualizar una donaci�n: NO!
//==============================


//==============================
//Eliminar una donaci�n: NO!
//==============================

module.exports = app;