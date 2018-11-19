// app
const express = require('express')
const app = express()

// underscore
const _ = require('underscore');

// middleware
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

// model
const Departamento = require('../models/departamento');

app.get('/departamento', (req, res) => {

        //q campos qremos mostrar
        Departamento.find({}, 'descripcion')
            .exec((err, departamentos) => {

                if (err) {

                    return res.status(400).json({
                        ok: false,
                        err
                    });

                }
                Departamento.count({}, (err, conteo) => {
                    res.json({
                        ok: true,
                        departamentos,
                        cuantos: conteo
                    });

                });




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
app.put('/departamento/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    req.body.usuario = req.usuario._id;

    let body = _.pick(req.body, ['descripcion', 'usuario']);

    Departamento.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, departamentoDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        }

        res.json({
            ok: true,
            departamento: departamentoDB
        })
    });

})
app.delete('/departamento/:id', function(req, res) {
    let id = req.params.id;

    Departamento.findByIdAndRemove(id, (err, deptoBorrado) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        }
        if (!deptoBorrado) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Departamento no encontrado' }
            });

        }

        res.json({
            ok: true,
            departamento: deptoBorrado
        })

    });

});

module.exports = app;