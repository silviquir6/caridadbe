const express = require('express')
const app = express()

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }
        if (!usuarioDB) {
            //para q no siga ejecutando mas codigo se pone el return
            return res.status(400).json({
                ok: false,
                err: { message: '(Usuario) o contraseña incorrectos' }
            });
        }
        //si las contraseñas no son iguales
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario o (contraseña) incorrectos' }
            });

        }

        //objeto es el payload
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //30 dias

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});



module.exports = app;