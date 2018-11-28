// app
const express = require('express')
const app = express()
const axios = require('axios');


// middleware
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

// model
//const Ejemplo = require('../models/ejemplo');

//crear nuevos registros
app.post('/payu', function(req, res) {
    let body = req.body;


    postPayuPagos(body)
        .then(resp => {
            return res.json({
                ok: true,
                resp: resp
            })
        })
        .catch(e => {
            return res.json({
                ok: false,
                e: e
            })
        });

})

const postPayuPagos = async(body) => {

    let resp = await axios.post('https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi',
        body
    );
    console.log(resp);
    return {
        respuesta: resp.data
    }
};



module.exports = app;