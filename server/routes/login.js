const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
// middleware
const { verificaToken } = require('../middlewares/autenticacion');


const Usuario = require('../models/usuario');

const app = express();



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
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }


        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token,
            menu: obtenermenu(usuarioDB.role)
        });


    });

});


app.get('/renuevaToken', verificaToken, (req, res) => {

    let token = jwt.sign({
        usuario: req.usuario
    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

    res.status(200).json({
        ok: true,
        token: token
    });

});


// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}


app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                    menu: obtenermenu(usuarioDB.role)
                });

            }

        } else {

            console.log('Usuario NO EXISTE EN LA BD')
                // Si el usuario no existe en nuestra base de datos
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
                };

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                console.log('Usuario SILVIAAAA');
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                    menu: obtenermenu(usuarioDB.role)
                });


            });

        }


    });


});


function obtenermenu(ROLE) {

    menu = [{
            path: '',
            title: 'Principal',
            icon: 'mdi mdi-gauge',
            class: 'has-arrow',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: [{
                    path: '/dashboard/esalDashboard',
                    title: 'Esal',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/dashboard/dashboard1',
                    title: 'Otro',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/dashboard/dashboard2',
                    title: 'Otro2',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                }
            ]
        },
        {
            path: '',
            title: 'Sobre nosotros',
            icon: 'mdi mdi-gauge',
            class: 'has-arrow',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
        }

    ];

    if (ROLE === 'ADMIN_ROLE') {
        menu.push({
            path: '',
            title: 'Apps',
            icon: 'mdi mdi-apps',
            class: 'has-arrow',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: [{
                    path: '/apps/email',
                    title: 'Mailbox',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },

                {
                    path: '/apps/fullcalendar',
                    title: 'Calendar',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/apps/taskboard',
                    title: 'Taskboard',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/apps/usuario',
                    title: 'Usuario',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/apps/departamento',
                    title: 'Departamento',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/apps/tipoEsal',
                    title: 'tipoEsal',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/apps/municipio',
                    title: 'municipio',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/apps/donacion',
                    title: 'donacion',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/apps/esal',
                    title: 'esal',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                }

            ]
        });
    }
    return menu;
}




module.exports = app;