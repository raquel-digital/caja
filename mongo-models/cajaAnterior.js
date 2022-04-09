const { type } = require('express/lib/response');
const mongoose = require('mongoose');
let fecha = require("../utils/fecha");


const schema = mongoose.Schema({
    fecha : {type: String},
    retiro_de_caja : [{monto: Number, cliente: String}],
    saldo_caja : {type: Number},
    gasto_embalaje : [{motivo: String, gasto_embalaje: Number}],
    gasto_comida : {type: Number},
    gasto_correo : {type: Number},
    gasto_flete : {type: Number},
    gasto_facturaA : [{monto: Number, empresa: String}],
    resultado_facturaA : {type: Number},
    compras_facturaA : [{monto: Number, empresa: String}],
    resultado_comprasA : {type: Number},
    compras_facturaB : [{monto: Number, empresa: String}],
    resultado_comprasB : {type: Number},
    cheques : [{monto: Number, cliente: String}],
    transferencias_ICBC : [{monto: Number, cliente: String}],
    transferencias_Santander : [{monto: Number, cliente: String}],
    retiros_MP: [{monto: Number, empresa: String}],
    mercadopago_retirado : {type: Number},
    mercadopago_minorista : {type: Number},
    mercadopago_total : {type: Number},
    credito_debito : {type: Number},
    cierre_z : {type: Number},
    notas_de_credito : {type: Number},
    ventas_cta_cte : {type: Number},
    cierreZ_Ncredit : {type: Number},
    comiciones : {type: Number},
    comicion_debitos : {type: Number},
    comicionMP : {type: Number},
    total_comicionMP : {type: Number},
    comicionMP_resta : {type: Number},
    sumaComiciones : {type: Number},
    total_comiciones_resta : {type: Number},
    recaudado : {type: Number},
    total_gastos : {type: Number},
    total_comprasAB : {type: Number},
    comprasA_sIVA : {type: Number},
    total_comprasB : {type: Number},
    total_ventas : {type: Number},
    utilidad_bruta : {type: Number},
    utilidad_real : {type: Number},
    transferencias_minorista: [{type: Number}]
});

function cajaAnterior(caja){
    let model = mongoose.model(caja, schema);
    return model;
}


module.exports = cajaAnterior;