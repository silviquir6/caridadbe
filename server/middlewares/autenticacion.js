const jwt = require('jsonwebtoken');

//========================
// Verificar token
//========================
//middleware
let verificaToken = (req, res, next) => {

    //recibe el token del header
    let token = req.get('token');

    //verificar el token
    //objeto que yo encripte osea el mismo payload.
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json(
                {
                    ok: false,
                    err: {message: 'Token no válido'}
                }
            );
        }

        //efectivamente la información es correcta
        //puedo hacer que cualquier peticion tenga 
        //acceso a info de cualquier usuario
// estoy pasando info del payload a una variable req.usuario
        req.usuario= decoded.usuario;
        next();

    });


};

//========================
// Verificar ADMIN_ROLE
//========================
let verificaAdminRole = (req, res, next) => {

let usuario= req.usuario;

if (usuario.role === 'ADMIN_ROLE'){

 next();
}
else{
return res.status(401).json(
    {
        ok: false,
        err: {message: 'El usuario no es administrador'}
    }
);
}

};





module.exports = { verificaToken, verificaAdminRole };