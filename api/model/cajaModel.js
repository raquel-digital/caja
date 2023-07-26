const mongoose = require('mongoose');

const schema = mongoose.Schema({
    fecha : {type: String},
    retiro_de_caja : [{ motivo: String, monto: Number}],
    saldo_caja : {type: Number},
    gasto_otros : [{motivo: String, monto: Number}],
    gasto_comida : {type: Number},
    gasto_correo : {type: Number},
    gasto_flete : {type: Number},
    gasto_facturaA : [{monto: Number, cliente: String}],
    resultado_facturaA : {type: Number},
    compras_facturaA : [{monto: Number, cliente: String}],
    resultado_comprasA : {type: Number},
    compras_facturaB : [{monto: Number, cliente: String}],
    resultado_comprasB : {type: Number},
    cheques : [{monto: Number, cliente: String}],
    transferencias_ICBC : [{cliente: String, monto: Number }],
    transferencias_Santander : [{monto: Number, cliente: String}],
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
    depositos_mercadopago : [{cliente: String, monto: Number}],
    transferencias_minorista: [{type: Number}]
});

let caja = mongoose.model(`01 - CAJA MAYORISTA`, schema);

module.exports = caja;