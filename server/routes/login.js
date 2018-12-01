const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);



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
            title: 'Dashboards',
            icon: 'mdi mdi-gauge',
            class: 'has-arrow',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: [{
                    path: '/dashboard/dashboard1',
                    title: 'Modern',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/dashboard/dashboard2',
                    title: 'Classic',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/dashboard/dashboard3',
                    title: 'Analytical',
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
            title: 'Component',
            icon: 'mdi mdi-bullseye',
            class: 'has-arrow two-column',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: [{
                    path: '/component/accordion',
                    title: 'Accordion',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/component/alert',
                    title: 'Alert',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/component/carousel',
                    title: 'Carousel',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/component/dropdown',
                    title: 'Dropdown',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/component/modal',
                    title: 'Modal',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/component/pagination',
                    title: 'Pagination',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/component/poptool',
                    title: 'Popover & Tooltip',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/component/progressbar',
                    title: 'Progressbar',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/component/rating',
                    title: 'Ratings',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/component/tabs',
                    title: 'Tabs',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/component/timepicker',
                    title: 'Timepicker',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/component/buttons',
                    title: 'Button',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/component/cards',
                    title: 'Card',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/extra-component/toastr',
                    title: 'Toster',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/extra-component/upload',
                    title: 'File Upload',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/extra-component/editor',
                    title: 'Editor',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/extra-component/dragndrop',
                    title: 'Dragndrop',
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
            title: 'Extra',
            icon: 'mdi mdi-widgets',
            class: 'has-arrow',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: [{
                    path: '/widgets',
                    title: 'Widgets',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },

                {
                    path: '',
                    title: 'Forms',
                    icon: '',
                    class: 'has-arrow',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: [{
                            path: '/forms/basicform',
                            title: 'Basic Forms',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        },
                        {
                            path: '/forms/formvalidation',
                            title: 'Form Validation',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        },
                        {
                            path: '/component/typehead',
                            title: 'Form Typehead',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        },
                        {
                            path: '/component/datepicker',
                            title: 'Datepicker',
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
                    title: 'Tables',
                    icon: '',
                    class: 'has-arrow',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: [{
                            path: '/tables/basictable',
                            title: 'Basic Tables',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        },
                        {
                            path: '/tables/smarttable',
                            title: 'Smart Tables',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        },
                        {
                            path: '/tables/datatable',
                            title: 'Data Tables',
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
                    title: 'Charts',
                    icon: '',
                    class: 'has-arrow',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: [{
                            path: '/charts/chartjs',
                            title: 'Chart Js',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        },
                        {
                            path: '/charts/chartistjs',
                            title: 'Chartist Js',
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
                    title: 'Icons',
                    icon: '',
                    class: 'has-arrow',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: [{
                            path: '/icons/fontawesome',
                            title: 'Fontawesome',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        },
                        {
                            path: '/icons/simpleline',
                            title: 'Simple Line Icons',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        },
                        {
                            path: '/icons/material',
                            title: 'Material Icons',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        }
                    ]
                }
            ]
        },
        {
            path: '',
            title: 'Pages',
            icon: 'mdi mdi-file',
            class: 'has-arrow',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: [{
                    path: '',
                    title: 'Authentication',
                    icon: '',
                    class: 'has-arrow',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: [{
                            path: '/authentication/login',
                            title: 'Login',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        },
                        {
                            path: '/authentication/login2',
                            title: 'Login 2',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        },
                        {
                            path: '/authentication/signup',
                            title: 'Register',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        },
                        {
                            path: '/authentication/signup2',
                            title: 'Register 2',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        },
                        {
                            path: '/authentication/404',
                            title: '404',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        },
                        {
                            path: '/authentication/lock',
                            title: 'Lockscreen',
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
                    path: '/sample-pages/timeline',
                    title: 'Timeline',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/sample-pages/profile',
                    title: 'Profile',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/sample-pages/pricing',
                    title: 'Pricing',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/sample-pages/invoice',
                    title: 'Invoice',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/sample-pages/helperclasses',
                    title: 'Helper Classes',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: []
                },
                {
                    path: '/starter',
                    title: 'Starter Page',
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
            title: 'Menu Levels',
            icon: 'mdi mdi-arrange-send-backward',
            class: 'has-arrow',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: [{
                    path: 'javascript:void(0);',
                    title: 'Second Level',
                    icon: '',
                    class: '',
                    label: '',
                    labelClass: '',
                    extralink: true,
                    submenu: []
                },
                {
                    path: '',
                    title: 'Second Child',
                    icon: '',
                    class: 'has-arrow',
                    label: '',
                    labelClass: '',
                    extralink: false,
                    submenu: [{
                            path: 'javascript:void(0);',
                            title: 'Third 1.1',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        },
                        {
                            path: 'javascript:void(0);',
                            title: 'Third 1.2',
                            icon: '',
                            class: '',
                            label: '',
                            labelClass: '',
                            extralink: false,
                            submenu: []
                        }
                    ]
                }
            ]
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
                }
            ]
        });
    }
    return menu;
}




module.exports = app;