const express = require('express')
const app = express()

const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
//requerimos el middleware
const { verificaToken , verificaAdminRole} = require('../middlewares/autenticacion');

//El middleware es para validar el token en cada operacion,
// usamos el middleware

app.get('/usuario', verificaToken, (req, res) => {

/* return res.json({
usuario: req.usuario,
nombre: req.usuario.nombre,
email: req.usuario.email

});  */




        let desde = req.query.desde || 0;
        desde = Number(desde);

        let limite = req.query.limite || 5;
        limite = Number(limite);

        //q campos qremos mostrar
        Usuario.find({ estado: true }, 'nombre email estado google role')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {

                if (err) {

                    return res.status(400).json({
                        ok: false,
                        err
                    });

                }
                Usuario.count({ estado: true }, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    });

                });




            });

    })
    //crear nuevos registros
app.post('/usuario', function(req, res) {

        let body = req.body;

        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        });

        usuario.save((err, usuarioDB) => {

            if (err) {

                return res.status(400).json({
                    ok: false,
                    err
                });

            }

            res.json({
                ok: true,
                usuario: usuarioDB
            })


        });

    })
    //actualizar 
app.put('/usuario/:id',[verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });


})
app.delete('/usuario/:id',[verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });





})

module.exports = app;