var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var esalSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    img: { type: String, required: true },
    googlemaps: { type: String, required: false },
    direccion: { type: String, required: true },
    tipoEsal: { type: Schema.Types.ObjectId, ref: 'TipoEsal', required: true },
    telefono: { type: Number, required: true },
    facebook: { type: String, required: false },
    sitioWeb: { type: String, required: false },
    youtubeChannel: { type: String, required: false },
    municipio: { type: String, required: true },
    departamento: { type: String, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    estado: { type: Boolean, default: true }

}, { collection: 'esal' });

module.exports = mongoose.model('Esal', esalSchema);