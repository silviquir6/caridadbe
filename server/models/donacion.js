var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var donacionSchema = new Schema({
    valor: {
        type: Number,
        required: [true, 'El	valor	es	necesario']
    },
    fecha: {
        type: Date,
        default: Date.now,
        required: false
    },
    esal: {
        type: Schema.Types.ObjectId,
        ref: 'Esal',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El	id	usuario	es	un	campo	obligatorio']
    }
}, { collection: 'donacion' });

module.exports = mongoose.model('Donacion', donacionSchema);