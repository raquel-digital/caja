const { async } = require("rxjs");
let cajaModel = require("../mongo-models/cajaDiaria");
let cajaHoy = require("../mongo-models/cajaDiaria");
const cajaVieja = require("../utils/buscarModel").cajaAnterior;
const controlMensual = require("../mongo-models/controlMensual");
let cajaAnterior = require("../mongo-models/cajaAnterior")
let fecha = require("../utils/fecha");
const buscarModel = require("../utils/buscarModel")

const mongo = {
    read: async function (model) {
        try{
            let result = await cajaModel.find();
            return result;
        }catch(err){
            console.log("ERROR DE LECTURA EN MODELO: " + model)
        }
    },
    create: async function (data, fechaModel) {
        try{
            //console.log(data)
            let test;
            if(fechaModel != undefined){ 
                fecha.fecha = fechaModel;
                cajaModel = await buscarModel.conectarBase(fechaModel);
                test = await cajaModel.find();
            }else{
                fecha.fecha = fecha.fecha
                cajaModel = cajaHoy;
                test = await cajaModel.find();
            }
            
            if(data.transferencias_ICBC != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                }          
                let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {transferencias_ICBC: data.transferencias_ICBC}});
                await this.ingresarTotal(data.transferencias_ICBC.monto, "recaudado");
                return result;
            }            
            if(data.transferencias_Santander != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                }          
                let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {transferencias_Santander: data.transferencias_Santander}});
                await this.ingresarTotal(data.transferencias_Santander.monto, "recaudado");
                return result;
            }
            if(data.gasto_comida != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                }
                  const gasto = test[0].gasto_comida + data.gasto_comida;
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {gasto_comida: gasto}});
                  await this.ingresarTotal(data.gasto_comida, "recaudado");
                  return result;
            }
            if(data.gasto_flete != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const gasto = test[0].gasto_flete + data.gasto_flete;
                  await this.ingresarTotal(data.gasto_flete, "recaudado");
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {gasto_flete: gasto}});
                  return result;
            }
            if(data.cheques != null){
                if(test.length == 0){
                  return await cajaModel.create({fecha: fecha.fecha}, data);
                }     
                let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {cheques: data.cheques}});
                await this.ingresarTotal(data.cheques.monto, "recaudado");
                return result;
            }
            if(data.retiro_de_caja != null){
                if(test.length == 0){
                  return await cajaModel.create({fecha: fecha.fecha}, data);
                }     
                let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {retiro_de_caja: data.retiro_de_caja}});
                await this.ingresarTotal(data.retiro_de_caja.monto, "recaudado");
                return result;
            }
            if(data.saldo_caja != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const base = await cajaModel.find();
                  const suma = base[0].saldo_caja + data.saldo_caja;
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {saldo_caja: suma}});
                  await this.ingresarTotal(data.saldo_caja, "recaudado");
                  return result;
            }
            if(data.gasto_correo != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const gasto = test[0].gasto_correo + data.gasto_correo;
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {gasto_correo: gasto}});
                  await this.ingresarTotal(data.gasto_correo, "recaudado");
                  return result;
            }
            if(data.gasto_embalaje != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {gasto_embalaje: data.gasto_embalaje}});
                  await mongo.ingresarTotal(data.gasto_embalaje.gasto_embalaje, "recaudado");
                  return result;
            }
            if(data.gasto_facturaA != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                //tomamos los datos y los pusheamos al array de mongo          
                let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {gasto_facturaA: data.gasto_facturaA}});
                await mongo.ingresarTotal(data.gasto_facturaA.monto, "recaudado");
                return result;
            }
            if(data.resultado_facturaA != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  data.resultado_facturaA = parseFloat(data.resultado_facturaA);
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {resultado_facturaA: data.resultado_facturaA}});
                  await this.ingresarTotal();
                  return result;
            }
            if(data.compras_facturaA != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                //tomamos los datos y los pusheamos al array de mongo          
                let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {compras_facturaA: data.compras_facturaA}});
                await mongo.ingresarTotal();
                return result;
            }
            if(data.resultado_comprasA != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  data.resultado_comprasA = parseFloat(data.resultado_comprasA);
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {resultado_comprasA: data.resultado_comprasA}});
                  await this.ingresarTotal()
                  return result;
            }
            if(data.compras_facturaB != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                //tomamos los datos y los pusheamos al array de mongo          
                let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {compras_facturaB: data.compras_facturaB}});
                await mongo.ingresarTotal();
                return result;
            }
            if(data.resultado_comprasB != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {resultado_comprasB: data.resultado_comprasB}});
                  await this.ingresarTotal()
                  return result;
            }
            if(data.retiros_MP != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                
                  
                let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {retiros_MP: data.retiros_MP}});
                
                return result;
            }
            if(data.mercadopago_minorista != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const suma = test[0].mercadopago_minorista + data.mercadopago_minorista;
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {mercadopago_minorista: suma}});
                  await mongo.ingresarTotal(null, "mercadopagoMinorista");
                  return result;
            }
            if(data.mercadopago_retirado != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const suma = test[0].mercadopago_retirado + data.mercadopago_retirado;  
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {mercadopago_retirado: suma}});
                  await mongo.ingresarTotal(null, "mercadopagoRetirado");
                  return result;
            }
            if(data.ventas_cta_cte != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const suma = test[0].ventas_cta_cte + data.ventas_cta_cte; 
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {ventas_cta_cte: suma}});
                  await mongo.ingresarTotal();
                  return result;
            }
            if(data.notas_de_credito != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const suma = test[0].notas_de_credito + data.notas_de_credito;
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {notas_de_credito: suma}});
                  await mongo.ingresarTotal();
                  return result;
            }
            if(data.cierre_z != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const suma = test[0].cierre_z + data.cierre_z;
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {cierre_z: suma}});
                  await mongo.ingresarTotal();
                  return result;
            }
            if(data.credito_debito != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const suma = test[0].credito_debito + data.credito_debito;
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {credito_debito: suma}});
                  await this.ingresarTotal(data.credito_debito, "credito-debito")
                  return result;
            }
            

            if(test.length == 0){
                console.log("Base de datos. Creada.");

            return await cajaModel.create({
                fecha: data.fecha, 
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
            }else{
                return console.log("Base de datos. Conectada.")
            }    
        }catch(err){
            console.log("ERROR EN CREATE: " + err);
        }
    },
    ingresarTotal: async function (valor, model){
        try{
            let base = await cajaModel.find();
            
            if(model == "recaudado"){
                const recaudado = base[0].recaudado + valor;
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {recaudado: recaudado}});
                base = await cajaModel.find();                
            }
            
            const comicionDebito = 0.8 //TODO hacer este valor configurable
            const operacionDebitos = (comicionDebito / 100) * base[0].credito_debito;
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {comiciones: operacionDebitos}});
            const comisionDebitos = base[0].credito_debito - operacionDebitos;
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {comicion_debitos: comisionDebitos}});
            
            if(model == "credito-debito"){
                let totalComiciones = base[0].total_comicionMP + operacionDebitos;
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comiciones_resta: totalComiciones}});
                const recaudado = base[0].recaudado + valor;
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {recaudado: recaudado}});
                base = await cajaModel.find();
            }
            
            if(model == "mercadopagoRetirado"){
                const mercadoPagoRetiro = base[0].mercadopago_retirado - base[0].mercadopago_minorista;
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {mercadopago_total: mercadoPagoRetiro}});
                base = await cajaModel.find();
                const recaudado = base[0].recaudado + base[0].mercadopago_retirado;            
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {recaudado: recaudado}});
                const comicionMP = 1;//TODO hacer este valor configurable
                const totalComicionMP = (comicionMP / 100) * mercadoPagoRetiro;            
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comicionMP: totalComicionMP}});
                const totalComicionMPresta = mercadoPagoRetiro - totalComicionMP;
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {comicionMP_resta: totalComicionMPresta}});            
                let totalComicionesResta = totalComicionMP + operacionDebitos;
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comiciones_resta: totalComicionesResta}});
                base = await cajaModel.find();
            }   
            if(model == "mercadopagoMinorista"){
                const mercadoPagoRetiro = base[0].mercadopago_retirado - base[0].mercadopago_minorista;
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {mercadopago_total: mercadoPagoRetiro}});
                base = await cajaModel.find();
                const recaudado = base[0].recaudado - base[0].mercadopago_minorista;            
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {recaudado: recaudado}});
                const comicionMP = 1;//TODO hacer este valor configurable
                const totalComicionMP = (comicionMP / 100) * mercadoPagoRetiro;            
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comicionMP: totalComicionMP}});
                const totalComicionMPresta = mercadoPagoRetiro - totalComicionMP;
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {comicionMP_resta: totalComicionMPresta}});            
                let totalComicionesResta = totalComicionMP + operacionDebitos;
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comiciones_resta: totalComicionesResta}});
                base = await cajaModel.find();
            }     
            
            const cierreZncredit = base[0].cierre_z - base[0].notas_de_credito;
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {cierreZ_Ncredit: cierreZncredit}});
            
            let gastoOtros = 0
            if(Array.isArray(base[0].gasto_embalaje)){
                base[0].gasto_embalaje.forEach(e => {
                    gastoOtros += parseFloat(e.gasto_embalaje);
                });
            }else{
                gastoOtros = 0;
            }
            
            const totalGastos = base[0].gasto_comida + gastoOtros + base[0].resultado_facturaA + base[0].total_comiciones_resta + (cierreZncredit * 0.03);
            
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_gastos: totalGastos}});
            
            const comprasAB = base[0].resultado_comprasA + base[0].resultado_comprasB;
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comprasAB: comprasAB}});
            const ventasAsIVA = (base[0].cierre_z - base[0].notas_de_credito) / 1.21;
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {comprasA_sIVA: ventasAsIVA}});

            const totalComprasB = base[0].recaudado - cierreZncredit;
            
            const totalComprasBMasCTA = totalComprasB + base[0].ventas_cta_cte;
            
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comprasB: totalComprasBMasCTA}});
            const totalVentas = ventasAsIVA + totalComprasB;
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_ventas: totalVentas}});
            const utilidadBruta = totalVentas - comprasAB;
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {utilidad_bruta: utilidadBruta}});
            //
            const utilidadReal = utilidadBruta - totalGastos;
            //
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {utilidad_real: utilidadReal}});
            
            return
        }catch(err){
            console.log("ERROR AL INTERTAR INGRESAR EL TOTAL " + err);
        }
    },
    constrolMensual: async function (data){
        try{
            const base = await controlMensual.find();
            if(base.length == 0){
                await controlMensual.create(
                {
                    ALQUILER: data.ALQUILER,
                    Movistar: data.Movistar,
                    POSNET: data.POSNET,
                    PROGRAMADOR: data.PROGRAMADOR,
                    SUELDOS_CARGAS: data.SUELDOS_CARGAS,
                    Telecom: data.Telecom,
                    abl_planes: data.abl_planes,
                    contador: data.contador,
                    ganancias: data.ganancias,
                    gastos_bancarios: data.gastos_bancarios,
                    jubilacion_javier: data.jubilacion_javier,
                    seguros: data.seguros,
                    sueldos_2: data.sueldos_2
                })
            }else{
                await controlMensual.updateMany(
                    {
                        ALQUILER: data.ALQUILER,
                        Movistar: data.Movistar,
                        POSNET: data.POSNET,
                        PROGRAMADOR: data.PROGRAMADOR,
                        SUELDOS_CARGAS: data.SUELDOS_CARGAS,
                        Telecom: data.Telecom,
                        abl_planes: data.abl_planes,
                        contador: data.contador,
                        ganancias: data.ganancias,
                        gastos_bancarios: data.gastos_bancarios,
                        jubilacion_javier: data.jubilacion_javier,
                        seguros: data.seguros,
                        sueldos_2: data.sueldos_2
            })
            }
            return
        }catch(err){
            console.log("ERROR EN CONTROL MENSUAL " + err);
        }
        
    },
    leerForm: async function () {
      const base = await controlMensual.find();
      if(base.length < 0){
        const formData = {ALQUILER: 0,
            Movistar: 0,
            POSNET: 0,
            PROGRAMADOR: 0,
            SUELDOS_CARGAS: 0,
            Telecom: 0,
            abl_planes: 0,
            contador: 0,
            ganancias: 0,
            gastos_bancarios: 0,
            jubilacion_javier: 0,
            seguros: 0,
            sueldos_2: 0
        };
        return formData;
      }else{
        return base
      }
    },
    cajaAnterior: async function (fecha) {
        try{
            let result = await buscarModel.coleccionAnterior(fecha);
            return result;
        }catch(err){
            console.log("ERROR DE LECTURA EN MODELO")
        }
        
    }
}

module.exports = mongo;