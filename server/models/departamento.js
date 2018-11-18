var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var departamentoSchema = new Schema({
    descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }

}, { collection: 'departamento' });

module.exports = mongoose.model('Departamento', departamentoSchema);