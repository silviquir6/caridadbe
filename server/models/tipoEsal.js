var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tipoEsalSchema = new Schema({
    descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }

});

module.exports = mongoose.model('TipoEsal', tipoEsalSchema);