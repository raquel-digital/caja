const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
let fecha = require("../utils/fecha");


const schema = mongoose.Schema({
        fecha: {type: String},
        ALQUILER: {type: Number},
        Movistar: {type: Number},
        POSNET: {type: Number},
        PROGRAMADOR: {type: Number},
        SUELDOS_CARGAS: {type: Number},
        Telecom: {type: Number},
        abl_planes: {type: Number},
        contador: {type: Number},
        ganancias: {type: Number},
        gastos_bancarios: {type: Number},
        jubilacion_javier: {type: Number},
        seguros: {type: Number},
        sueldos_2: {type: Number}
});

const caja = mongoose.model(`Control Mensual: ${fecha.mesEnCurso}`, schema);

module.exports = caja;