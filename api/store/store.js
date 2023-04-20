const modelCaja = require("../model/cajaModel");

const store = {
    read: async function (data) {
        const res = await modelCaja.find({fecha: data});
        if(res.length > 0){
            return res[0];
        }else{
            return;
        }
    },
    write: async function (data) {
        const res = await modelCaja.create(data);
        return res;
    },
    //INGRESO DE DATOS
    retiro_de_caja: async function (data) {
       return await modelCaja.findOneAndUpdate(
            {fecha: data.fecha}, 
            {
                $push: { retiro_de_caja: data.retiro_de_caja },
                $inc: { recaudado: data.retiro_de_caja.monto }
            });            
    },
    saldo_caja: async function (data) {
        return await modelCaja.findOneAndUpdate(
             {fecha: data.fecha}, 
             {
                $inc: { saldo_caja: data.saldo_caja, recaudado: data.saldo_caja}
             });            
    },
    comida: async function (data) {
        return await modelCaja.findOneAndUpdate(
             {fecha: data.fecha}, 
             {
                $inc: { gasto_comida: data.gasto_comida, recaudado: data.gasto_comida, total_gastos: data.gasto_comida}
             });            
    },
    gasto_otros: async function (data) {
        return await modelCaja.findOneAndUpdate(
             {fecha: data.fecha}, 
             {
                 $push: { gasto_otros: data.gasto_otros },
                 $inc: { recaudado: data.gasto_otros.monto, total_gastos: data.gasto_otros.monto }
             });            
     }, 
     transferencias_ICBC: async function (data) {
        return await modelCaja.findOneAndUpdate(
             {fecha: data.fecha}, 
             {
                 $push: { transferencias_ICBC: data.transferencias_ICBC },
                 $inc: { recaudado: data.transferencias_ICBC.monto }
             });            
     },
     gasto_correo: async function (data) {
        return await modelCaja.findOneAndUpdate(
             {fecha: data.fecha}, 
             {
                $inc: { gasto_correo: data.gasto_correo, recaudado: data.gasto_correo, total_gastos: data.gasto_correo}
             });            
    },
    gasto_flete: async function (data) {
        return await modelCaja.findOneAndUpdate(
             {fecha: data.fecha}, 
             {
                $inc: { gasto_flete: data.gasto_flete, recaudado: data.gasto_flete, total_gastos: data.gasto_flete }
             });            
    },
    transferencias_Santander: async function (data) {
        return await modelCaja.findOneAndUpdate(
             {fecha: data.fecha}, 
             {
                 $push: { transferencias_Santander: data.transferencias_Santander },
                 $inc: { recaudado: data.transferencias_Santander.monto }
             });
    },
    gasto_facturaA: async function (data) {
        const desgloceIVA = parseFloat(data.gasto_facturaA.monto / 1.21); 
        return await modelCaja.findOneAndUpdate(
             { fecha: data.fecha }, 
             {
               $push: { gasto_facturaA: data.gasto_facturaA },               
               $inc: { recaudado: data.gasto_facturaA.monto, resultado_facturaA: desgloceIVA}
             });
    },
    cheques: async function (data) {
        return await modelCaja.findOneAndUpdate(
             { fecha: data.fecha }, 
             {
               $push: { cheques: data.cheques },
               $inc: { recaudado: data.cheques.monto }
             });
    },
    compras_facturaA: async function (data) {
        const desgloceIVA = parseFloat(data.compras_facturaA.monto / 1.21);
        return await modelCaja.findOneAndUpdate(
             { fecha: data.fecha }, 
             {
               $push: { compras_facturaA: data.compras_facturaA },
               $inc: { resultado_comprasA: desgloceIVA, total_gastos: desgloceIVA, total_comprasAB: desgloceIVA}
             });
    },
    mercadopago_retirado: async function (data, totalComicionMP, totalComicionMPresta) {
        
        return await modelCaja.findOneAndUpdate(
             {fecha: data.fecha}, 
             {
                $inc: { 
                        mercadopago_retirado: data.mercadopago_retirado, 
                        recaudado: data.mercadopago_retirado,
                        total_comicionMP: totalComicionMP,
                        comicionMP_resta: totalComicionMPresta,
                        total_gastos: totalComicionMP 
                    }
             });            
    },
    compras_facturaB: async function (data) {
        return await modelCaja.findOneAndUpdate(
             { fecha: data.fecha }, 
             {
               $push: { compras_facturaB: data.compras_facturaB },
               $inc: { resultado_comprasB: data.compras_facturaB.monto, total_comprasAB: data.compras_facturaB.monto }
             });
    },
    transferencias_minorista: async function (data) {
        return await modelCaja.findOneAndUpdate(
             { fecha: data.fecha }, 
             {
               $push: { transferencias_minorista: data.transferencias_minorista }
             });
    },
    mercadopago_minorista: async function (data, resta, totalComicionMP, totalComicionMPresta) {
        return await modelCaja.findOneAndUpdate(
             { fecha: data.fecha }, 
             {               
               $inc: { 
                    mercadopago_minorista: data.mercadopago_minorista, 
                    recaudado: resta, 
                    mercadopagoTotales: resta,
                    total_comicionMP: totalComicionMP,
                    comicionMP_resta: totalComicionMPresta,
                    total_gastos: totalComicionMP  
                }
             });
    },  
    credito_debito: async function (data, totalComicionDebtCred, totalComicionRestaDebtCred) {
        return await modelCaja.findOneAndUpdate(
             {fecha: data.fecha}, 
             {
                $inc: { 
                        credito_debito: data.credito_debito,
                        comiciones: totalComicionDebtCred,
                        comicion_debitos: totalComicionRestaDebtCred,
                        recaudado: data.credito_debito,
                        total_gastos: totalComicionDebtCred,
                    }
             });            
    },    
    cierre_z: async function (data, totalGastos, cierreZMenosNotaCredito, coeficienteViejo) {
       
         await modelCaja.findOneAndUpdate(
             {fecha: data.fecha}, 
             {
                $inc: { 
                        cierre_z: data.cierre_z,                        
                        total_gastos: coeficienteViejo,
                    },
                $set: { 
                    cierreZ_Ncredit: cierreZMenosNotaCredito
                }    
             });
             
             return await modelCaja.findOneAndUpdate(
                {fecha: data.fecha}, 
                {
                    $inc: {
                        total_gastos: totalGastos
                    }  
                }
             )
    },
    notas_de_credito: async function (data, cierreZMenosNotaCredito, totalGastos, coeficienteViejo) {
         //console.log(coeficienteViejo)  
         await modelCaja.findOneAndUpdate(
             {fecha: data.fecha}, 
             {
                $inc: { 
                        notas_de_credito: data.notas_de_credito,
                        total_gastos: coeficienteViejo,
                },
                $set: { 
                    cierreZ_Ncredit: cierreZMenosNotaCredito
                },                     
             });  
             return await modelCaja.findOneAndUpdate(
                {fecha: data.fecha}, 
                {
                 $inc: {
                    total_gastos: totalGastos
                }
            })
    }, 
    ventas_cta_cte: async function (data) {
        return await modelCaja.findOneAndUpdate(
             {fecha: data.fecha}, 
             {
                $inc: { ventas_cta_cte: data.ventas_cta_cte}
             });            
    },  
    results: async function (data) {
        const ventasA = data.cierreZ_Ncredit / 1.21
        const ventasB = (data.recaudado - data.cierreZ_Ncredit) + data.ventas_cta_cte;
        const ventasAB = ventasA + ventasB
        const utilidadBruta = data.comprasA_sIVA - data.total_comprasAB
        const utilidadReal = utilidadBruta - data.total_gastos

        await modelCaja.findOneAndUpdate(
            {fecha: data.fecha}, 
            {
               $set: {
                    resultado_comprasA: data.resultado_comprasA, 
                    comprasA_sIVA: ventasA,
                    total_comprasB: ventasB,
                    total_ventas: ventasAB,
                    utilidad_bruta: utilidadBruta,
                    utilidad_real: utilidadReal
                }
            });
        const res = await store.read(data.fecha);    
        return res;

    }, 
    search: async function (query) {
        try{
            const result = await modelCaja.find(
                {fecha: { "$regex": query, "$options": "i" }}
            );
            return result;
        }catch(err){
            console.log("[ ERROR EN SEARCH STORE] " + err)
        }
    },       
}

module.exports = store;