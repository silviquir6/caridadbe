const express = require('express')
const app = express()

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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



//Configuraciones de google
//async retorna una promesa

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //con este payload ya obtenemos toda la información del usuario
      console.log(payload);
    //la promesa regresa un objeto de google
    return {
        nombre: payload.name,
        email: payload.email,
        picture: payload.picture,
        google: true,
        
    }
}

//como usa una funcion await
app.post('/google', async (req, res) => {

    let token = req.body.idtoken;
    //console.log(token);
    //promesa: para q se asigne automaticamente debe usar el await
    let googleUser = await verify(token)
        .catch(e  => {
            return res.status(403).json({
                ok: false,
                err: e 
            });
        }); 
   
    //verificar si yo no tengo un usuario q tenga ese correo
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                err: err 
            })

        }

        if (usuarioDB) {
            //si NO se ha autenticado por google, ya se autentico con credenciales normales
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: { message: 'Debe usar su autenticación normal' }
                })

            }
            //ya se ha autenticado por google
            else {

                //renovar su token para q pueda seguir trabajando
                //crear su token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //30 dias

                //status 200 por defecto
                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });



            }

        } else {
            //Si el usuario no existe en nuestra base de datos
            //tenemos q crear un nuevo objeto

            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {

                    return res.status(500).json({
                        ok: false,
                        err
                    });

                }
                //crear su token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //30 dias

                //status 200 por defecto
                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });



            });

        }

    });

});



module.exports = app;