// app
const express = require('express')
const app = express()

//si la imagen existe o no
const fs = require('fs');

const path = require('path');


// middleware
const { verificaTokenImg } = require('../middlewares/autenticacion');


// Necesito diferenciar el tipo de imagen
// la imagen tiene q ser proveida
app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    //obtener los parametros
    let tipo = req.params.tipo;
    let img = req.params.img;

    //aqui tengo las imagenes y la imagen q me está enviando

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {


        //retorna el archivo como tal
        res.sendFile(pathImagen);

    } else {

        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');

        //retorna el archivo como tal
        res.sendFile(noImagePath);

    }






});

module.exports = app;