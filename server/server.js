require('./config/config');

const express = require('express')
    // Using Node.js `require()`
const mongoose = require('mongoose');

//habilitar la carpeta public
const path = require('path');

const app = express()


// CORS
const cors = require('cors');

app.use(cors({ origin: "https://caridadhumana.com" }));


const bodyParser = require('body-parser')
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//Configuración global de rutas
app.use(require('./routes/index'));

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));




mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});

app.listen(process.env.PORT, () => {
    console.log("Escuchando el puerto  ", process.env.PORT);
})