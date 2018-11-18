const mongoose = require('mongoose');

let Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');

var rolesValidos = {
    values: ['ADMIN_ROLE', 'DONADOR_ROLE', 'ESAL_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false },
    estado: { type: Boolean, default: true }
}, { collection: 'usuario' });
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}


usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe ser único" });


module.exports = mongoose.model('Usuario', usuarioSchema);