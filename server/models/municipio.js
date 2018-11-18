var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var municipioSchema = new Schema({
    descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }

}, { collection: 'municipio' });

module.exports = mongoose.model('Municipio', municipioSchema);