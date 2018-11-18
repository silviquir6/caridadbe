//app
const express = require('express')
const app = express()
    //hacer npm install
const fileUpload = require('express-fileupload');





const fs = require('fs');
const path = require('path');

// model
const Usuario = require('../models/usuario');
const Esal = require('../models/esal');




app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {


    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: { message: 'No se ha seleccionado ningún archivo' }


            });

    }

    //Valida tipo

    let tiposValidos = ['esals', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({

            ok: false,

            err: { message: 'Los tipos permitidos son:' + tiposValidos.join(', ') }
        });

    }



    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreArchivoCortado = archivo.name.split('.');
    let extension = nombreArchivoCortado[nombreArchivoCortado.length - 1];

    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,

            err: { message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ') },
            ext: extension




        });



    }

    //cambiar nombre al archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err


            });
        }

        //aqui imagen cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenEsal(id, res, nombreArchivo);
        }

    });



});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {

            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err


            });
        }

        if (!usuarioDB) {

            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuaro no existe'
                }
            });

        }

        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;





        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo

            });



        });


    });





}

function imagenEsal(id, res, nombreArchivo) {

    Esal.findById(id, (err, esalDB) => {
        if (err) {


            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err


            });
        }

        if (!esalDB) {



            return res.status(400).json({
                ok: false,

                err: { message: 'Esal No Existe' }

            });

        }





        borraArchivo(esalDB.img, 'esals');



        esalDB.img = nombreArchivo;
        esalDB.save((err, esalGuardado) => {

            res.json({
                ok: true,
                esal: esalGuardado,
                img: nombreArchivo

            });




        });
    });


}



function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    //borrar imagen anterior
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }


}

module.exports = app;