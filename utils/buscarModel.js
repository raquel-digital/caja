const mongoose = require('mongoose');
const { async } = require('rxjs');
const mongoCrud = require("../api/mongo")


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
    utilidad_real : {type: Number}
});

async function buscarColeccion(coleccion) {    
    // coleccion = coleccion.split("");
    // let str2 = coleccion.splice(0, 2);
    // str2 = parseInt(str2.join(""));
    // console.log(str2)
    // str2--;
    // coleccion = coleccion.join("");
    coleccion = coleccion.split("-");    
    str2 = parseInt(coleccion[0]);    
    --str2    
    let find = [];
    try{
        while(str2 >= 1){            
            let coleccionTemp = str2+"-"+coleccion[1]+"-"+coleccion[2];
            
            let base = await coleccionCallBack(coleccionTemp);
            if(base.length > 0){            
                find.push(base);
            }
            str2--;
        }        
        return find;
    }catch(err){
      return console.log("BASE DE DATOS NO ENCONTRADA " + err)
    }
} 

async function coleccionCallBack(coleccion) {
    const ventas = mongoose.model(coleccion, schema);
    try{
        const find = await ventas.find();
        return find;
    }catch(err){
      return console.log("CALLBACK BASE DE DATOS NO ENCONTRADA " + err)
    }
}
let cajaAnterior;

async function coleccionAnterior(fecha){    
    try{ 
        if(fecha == undefined){
            return;
        }else{  
        let cajaAnterior;    
        cajaAnterior = await mongoose.model(fecha, schema);
        let find = await cajaAnterior.find();
        if(find.length == 0){
          await cajaAnterior.create({
            fecha: fecha,
            gasto_comida: 0,
            gasto_correo:0,
            resultado_facturaA: 0,
            resultado_comprasA: 0, 
            resultado_comprasB: 0,
            saldo_caja: 0,
            gasto_flete: 0,
            mercadopago_minorista: 0,
            mercadopago_retirado: 0,
            mercadopago_total: 0,
            credito_debito: 0,
            cierre_z: 0,
            notas_de_credito: 0,
            cierreZ_Ncredit: 0,
            ventas_cta_cte: 0,
            comiciones: 0,
            comicion_debitos: 0,
            total_comicionMP: 0,
            comicionMP_resta: 0,
            sumaComiciones: 0,
            total_comiciones_resta: 0,
            recaudado: 0,
            total_gastos: 0,
            total_comprasAB: 0,
            total_comprasB: 0,
            total_ventas : 0,
            utilidad_bruta : 0,
            utilidad_real : 0,
            comprasA_sIVA: 0,
            totalVentas: 0
            });
        }
        find = await cajaAnterior.find();
        console.log("desde coleccion anterior "+ find)
        return find;
    }
    }catch(err){
      return console.log("coleccionAnterior BASE DE DATOS NO ENCONTRADA " + err)
    }
}

async function conectarBase(fecha){
    try{       
        const cajaAnterior = mongoose.model(fecha, schema);        
        return cajaAnterior;
    }catch(err){
      return console.log("conectarBase BASE DE DATOS NO ENCONTRADA " + err)
    }
}

module.exports = {buscarColeccion, coleccionAnterior, cajaAnterior, conectarBase};
