var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var paisValido = {
    values: ['Colombia'],
    message: '{VALUE} no es un pais permitido'
}



var esalSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    img: { type: String, required: false },
    googlemaps: { type: String, required: false },
    direccion: { type: String, required: true },
    tipoEsal: { type: Schema.Types.ObjectId, ref: 'TipoEsal', required: true },
    telefono: { type: Number, required: true },
    facebook: { type: String, required: false },
    sitioWeb: { type: String, required: false },
    youtubeChannel: { type: String, required: false },
    municipio: { type: Schema.Types.ObjectId, ref: 'Municipio', required: true },
    departamento: { type: Schema.Types.ObjectId, ref: 'Departamento', required: true },
    pais: { type: String, default: 'Colombia', enum: paisValido, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    estado: { type: Boolean, default: true }

}, { collection: 'esal' });

module.exports = mongoose.model('Esal', esalSchema);