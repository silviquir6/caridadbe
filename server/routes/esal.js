//app
const express = require('express')
const app = express()

// middleware
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

//model
const Esal = require('../models/esal');
//==========================
//Mostrar todas las ESAL
//==========================
app.get('/esal', function(req, res) {


        let desde = req.query.desde || 0;
        desde = Number(desde);

        let limite = req.query.limite || 5;
        limite = Number(limite);

        //q campos qremos mostrar
        Esal.find({ estado: true }, 'nombre descripcion img googlemaps direccion tipoEsal telefono facebook sitioWeb youtubeChannel municipio departamento pais usuario estado')
            .populate('tipoEsal')
            .populate('usuario')
            .populate('municipio')
            .populate('departamento')
            .skip(desde)
            .limit(limite)
            .exec((err, esals) => {

                if (err) {

                    return res.status(500).json({
                        ok: false,
                        err
                    });

                }
                Esal.count({ estado: true }, (err, conteo) => {
                    res.json({
                        ok: true,
                        esals,
                        cuantos: conteo
                    });

                });



            });


    })
    //==========================
    //Mostrar una ESAL por id
    //==========================
app.get('/esal/:id', function(req, res) {

    let id = req.params.id;

    Esal.findById(id, (err, esalDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }
        if (!esalDB) {
            return res.status(400).json({
                ok: false,
                err
            });


        }

        res.json({
            ok: true,
            esal: esalDB
        })

    });


})

//==========================
//Buscar ESAL por termino
//==========================

app.get('/esal/buscar/:termino', verificaToken, function(req, res) {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');


    Esal.find({ nombre: regex, estado: true }, 'nombre descripcion img googlemaps direccion tipoEsal telefono facebook sitioWeb youtubeChannel municipio departamento pais usuario estado')
        .populate('tipoEsal')
        .populate('usuario')
        .populate('municipio')
        .populate('departamento')

    .exec((err, esals) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }
        Esal.count({ nombre: regex, estado: true }, (err, conteo) => {
            res.json({
                ok: true,
                esals,
                cuantos: conteo
            });

        });



    });




});

//===================================================
//Buscar ESAL por ciudad, departamento, tipo de Esal
//===================================================

app.get('/esalBuscarPorMunDptoTipoEsal', verificaToken, function(req, res) {


    let municipio = req.query.municipio;
    let departamento = req.query.departamento;
    let tipoEsal = req.query.tipoEsal;

    //q campos qremos mostrar
    Esal.find({ municipio: municipio, departamento: departamento, tipoEsal: tipoEsal, estado: true }, 'nombre descripcion img googlemaps direccion tipoEsal telefono facebook sitioWeb youtubeChannel municipio departamento pais usuario estado')
        .populate('tipoEsal')
        .populate('usuario')
        .populate('municipio')
        .populate('departamento')
        .exec((err, esals) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });

            }
            Esal.count({ municipio: municipio, departamento: departamento, tipoEsal: tipoEsal, estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    esals,
                    cuantos: conteo
                });

            });



        });



});




//==========================
//Crear nueva ESAL
//==========================	
//crear nuevos registros
app.post('/esal', [verificaToken, verificaAdminRole], function(req, res) {


        let body = req.body;

        let esal = new Esal({

            nombre: body.nombre,
            img: body.img,
            googlemaps: body.googlemaps,
            direccion: body.direccion,
            tipoEsal: body.tipoEsal,
            telefono: body.telefono,
            facebook: body.facebook,
            sitioWeb: body.sitioWeb,
            youtubeChannel: body.youtubeChannel,
            municipio: body.municipio,
            departamento: body.departamento,
            pais: body.pais,
            usuario: req.usuario._id,
            estado: body.estado,
            descripcion: body.descripcion

        });

        esal.save((err, esalDB) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            if (!esalDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });


            }

            res.json({
                ok: true,
                esal: esalDB
            })


        });
    })
    //==========================
    //Actualizar ESAL
    //==========================	

app.put('/esal/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    req.body.usuario = req.usuario._id;
    let body = req.body;

    Esal.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, esalDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!esalDB) {
            return res.status(400).json({
                ok: false,
                err
            });


        }

        res.json({
            ok: true,
            esal: esalDB
        })
    });
})

//==========================
//  Cambiar Estado /Delete ESAL
//==========================	
app.delete('/esal/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Esal.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, esalDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!esalDB) {
            return res.status(400).json({
                ok: false,
                err
            });


        }

        res.json({
            ok: true,
            esal: esalDB
        })
    });





})

module.exports = app;