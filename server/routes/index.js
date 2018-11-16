const express = require('express')
const app = express()


app.use(require('./usuario'));
app.use(require('./esal'));
app.use(require('./tipoEsal'));
app.use(require('./donacion'));
app.use(require('./login'));


module.exports = app;