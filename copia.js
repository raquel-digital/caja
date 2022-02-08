const { async } = require("rxjs");
const cajaModel = require("../mongo-models/cajaDiaria");
let fecha = require("../utils/fecha");


const mongo = {
    read: async function (model) {
        try{
            let result = await cajaModel.find();
            return result;
        }catch(err){
            console.log("ERROR DE LECTURA EN MODELO: " + model)
        }
    },
    create: async function (data) {
        try{
            console.log(data)
            let test = await cajaModel.find();            
            if(data.transferencias_ICBC != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                }
                const base = await cajaModel.find();
                data.transferencias_ICBC.monto = parseFloat(data.transferencias_ICBC.monto);
                const sumaRecaudacion = base[0].recaudado + data.transferencias_ICBC.monto;               
                let totalVentasB = sumaRecaudacion + base[0].cierreZ_Ncredit + base[0].notas_de_credito;
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comprasB: totalVentasB}});
                //tomamos los datos y los pusheamos al array de mongo          
                let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {transferencias_ICBC: data.transferencias_ICBC}});
                await this.ingresarTotal(data.transferencias_ICBC.monto);
                return result;
            }            
            if(data.transferencias_Santander != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                }
                const base = await cajaModel.find();
                data.transferencias_Santander.monto = parseFloat(data.transferencias_Santander.monto);
                const sumaRecaudacion = base[0].recaudado + data.transferencias_Santander.monto;                
                let totalVentasB = sumaRecaudacion + base[0].cierreZ_Ncredit + base[0].notas_de_credito;
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comprasB: totalVentasB}});
                //tomamos los datos y los pusheamos al array de mongo          
                let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {transferencias_Santander: data.transferencias_Santander}});
                await this.ingresarTotal(data.transferencias_Santander.monto);
                return result;
            }
            if(data.gasto_comida != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                }
                  const base = await cajaModel.find();                  
                  data.gasto_comida = parseFloat(data.gasto_comida);
                  const sumaRecaudacion = base[0].total_gastos + data.gasto_comida;
                  //await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_gastos: sumaRecaudacion}});
                  const utilidadReal = base[0].utilidad_bruta - sumaRecaudacion;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {utilidad_real: utilidadReal}});
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {gasto_comida: data.gasto_comida}});
                  await this.ingresarTotal(data.gasto_comida);
                  return result;
            }
            if(data.gasto_flete != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  await this.ingresarTotal(data.gasto_flete);
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {gasto_flete: data.gasto_flete}});
                  return result;
            }
            if(data.cheques != null){
                if(test.length == 0){
                  return await cajaModel.create({fecha: fecha.fecha}, data);
                }
                const base = await cajaModel.find();
                data.cheques.monto = parseFloat(data.cheques.monto);
                const sumaRecaudacion = base[0].recaudado + data.cheques.monto;
                let totalVentasB = sumaRecaudacion + base[0].cierreZ_Ncredit + base[0].notas_de_credito;
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comprasB: totalVentasB}});
                //tomamos los datos y los pusheamos al array de mongo          
                let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {cheques: data.cheques}});
                await this.ingresarTotal(data.cheques.monto);
                return result;
            }
            if(data.retiro_de_caja != null){
                if(test.length == 0){
                  return await cajaModel.create({fecha: fecha.fecha}, data);
                }
                const base = await cajaModel.find();
                const sumaRecaudacion = base[0].recaudado + data.retiro_de_caja.monto;                                
                let totalVentasB = sumaRecaudacion + base[0].cierreZ_Ncredit + base[0].notas_de_credito;
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comprasB: totalVentasB}});
                //tomamos los datos y los pusheamos al array de mongo          
                let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {retiro_de_caja: data.retiro_de_caja}});
                await this.ingresarTotal(data.retiro_de_caja.monto);
                return result;
            }
            if(data.saldo_caja != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const base = await cajaModel.find();
                  const sumaRecaudacion = base[0].recaudado + data.saldo_caja;                  
                  let totalVentasB = sumaRecaudacion + base[0].cierreZ_Ncredit + base[0].notas_de_credito;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comprasB: totalVentasB}});
                  const suma = base[0].saldo_caja + data.saldo_caja;
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {saldo_caja: suma}});
                  await this.ingresarTotal(data.saldo_caja);
                  return result;
            }
            if(data.gasto_correo != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const base = await cajaModel.find();
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {gasto_correo: data.gasto_correo}});
                  await this.ingresarTotal(data.gasto_correo);
                  return result;
            }
            if(data.gasto_embalaje != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const base = await cajaModel.find();
                  data.gasto_embalaje = parseFloat(data.gasto_embalaje);
                  const sumaRecaudacion = base[0].total_gastos + data.gasto_embalaje;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_gastos: sumaRecaudacion}});
                  const utilidadReal = base[0].utilidad_bruta - sumaRecaudacion;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {utilidad_real: utilidadReal}});
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {gasto_embalaje: data.gasto_embalaje}});
                  await this.ingresarTotal(data.gasto_embalaje);
                  return result;
            }
            if(data.gasto_facturaA != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                //tomamos los datos y los pusheamos al array de mongo          
                let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {gasto_facturaA: data.gasto_facturaA}});
                return result;
            }
            if(data.resultado_facturaA != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const base = await cajaModel.find();
                  const recaudacion = data.resultado_facturaA + base[0].recaudado;
                  data.resultado_facturaA = parseFloat(data.resultado_facturaA);
                  const sumaRecaudacion = base[0].total_gastos + data.resultado_facturaA;
                  //await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_gastos: sumaRecaudacion}});
                  const utilidadReal = base[0].utilidad_bruta - sumaRecaudacion;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {utilidad_real: utilidadReal}});
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {resultado_facturaA: data.resultado_facturaA}});
                  await this.ingresarTotal(data.resultado_facturaA);
                  return result;
            }
            if(data.compras_facturaA != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                //tomamos los datos y los pusheamos al array de mongo          
                let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {compras_facturaA: data.compras_facturaA}});
                return result;
            }
            if(data.resultado_comprasA != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const base = await cajaModel.find();
                  const sumaAB = base[0].resultado_comprasB + data.resultado_comprasA;
                  const resAsIVA = base[0].cierreZ_Ncredit / 1.21;
                  //await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comprasAB: sumaAB}});
                  const restaAB_totalVentas = base[0].total_ventas - sumaAB;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {utilidad_bruta: restaAB_totalVentas}});
                  const utilidadReal = restaAB_totalVentas - base[0].total_gastos;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {utilidad_real: utilidadReal}});
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
                return result;
            }
            if(data.resultado_comprasB != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const base = await cajaModel.find();
                  const sumaAB = base[0].resultado_comprasA + data.resultado_comprasB;
                  //await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comprasAB: sumaAB}});
                  const restaAB_totalVentas = base[0].total_ventas - sumaAB;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {utilidad_bruta: restaAB_totalVentas}});
                  const utilidadReal = restaAB_totalVentas - base[0].total_gastos;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {utilidad_real: utilidadReal}});
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {resultado_comprasB: data.resultado_comprasB}});
                  await this.ingresarTotal()
                  return result;
            }
            if(data.retiros_MP != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                //tomamos los datos y los pusheamos al array de mongo          
                let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$push: {retiros_MP: data.retiros_MP}});
                return result;
            }
            if(data.mercadopago_minorista != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {mercadopago_minorista: data.mercadopago_minorista}});
                  const base = await cajaModel.find();
                  const retiroMP = base[0].mercadopago_retirado;
                  const operacion = retiroMP - data.mercadopago_minorista;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {mercadopago_total: operacion}});
                  const valorComicion = 1; //TODO hacer que sea copnfigurable desde el cliente
                  const totalPorcentaje = (valorComicion / 100) * operacion;
                  const comicionResta = operacion - totalPorcentaje;
                  let sumaTodasLasComiciones = comicionResta + base[0].comicion_debitos;
                  sumaTodasLasComiciones = sumaTodasLasComiciones.toFixed(2);
                  let comicionRestaTotal = totalPorcentaje + base[0].comiciones;
                  const sumaRecaudacion = base[0].total_gastos + comicionRestaTotal;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_gastos: sumaRecaudacion}});
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comicionMP: totalPorcentaje}});                  
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {comicionMP_resta: comicionResta}});
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {sumaComiciones: sumaTodasLasComiciones}});
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comiciones_resta: comicionRestaTotal}});
                  const utilidadReal = base[0].utilidad_bruta - sumaRecaudacion;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {utilidad_real: utilidadReal}});
                  return result;
            }
            if(data.mercadopago_retirado != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {mercadopago_retirado: data.mercadopago_retirado}});
                  const base = await cajaModel.find();
                  const minoristaMP = base[0].mercadopago_minorista;
                  const operacion = data.mercadopago_retirado - minoristaMP;
                  const valorComicion = 1; //TODO hacer que sea copnfigurable desde el cliente
                  const totalPorcentaje = (valorComicion / 100) * operacion;
                  const comicionResta = operacion - totalPorcentaje;
                  let sumaTodasLasComiciones = comicionResta + base[0].comicion_debitos;
                  sumaTodasLasComiciones = sumaTodasLasComiciones.toFixed(2);
                  let comicionRestaTotal = totalPorcentaje + base[0].comiciones;
                  const sumaRecaudacion = base[0].total_gastos + comicionRestaTotal;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_gastos: sumaRecaudacion}});
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comicionMP: totalPorcentaje}});                  
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {comicionMP_resta: comicionResta}});
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {mercadopago_total: operacion}});
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {sumaComiciones: sumaTodasLasComiciones}});
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comiciones_resta: comicionRestaTotal}});
                  const utilidadReal = base[0].utilidad_bruta - sumaRecaudacion;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {utilidad_real: utilidadReal}});
                  return result;
            }
            if(data.ventas_cta_cte != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {ventas_cta_cte: data.ventas_cta_cte}});
                  return result;
            }
            if(data.notas_de_credito != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const base = await cajaModel.find();
                  const cierreZ = base[0].cierre_z;
                  let operacion = cierreZ - data.notas_de_credito;
                  let operacionIVA = operacion / 1.21;
                  operacionIVA = operacionIVA.toFixed(2);
                  const sumaRecaudacion = base[0].total_gastos + (operacion * 0.03);
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_gastos: sumaRecaudacion}});
                  //await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {cierreZ_Ncredit: operacion}});
                  
                  //await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {comprasA_sIVA: operacionIVA}});
                  let totalVentasB = base[0].recaudado + operacion + data.notas_de_credito;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comprasB: totalVentasB}});
                  let opTotalVentas = operacionIVA + totalVentasB;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_ventas: opTotalVentas}});
                  const utilidadReal = base[0].utilidad_bruta - sumaRecaudacion;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {utilidad_real: utilidadReal}});
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {notas_de_credito: data.notas_de_credito}});
                  await mongo.ingresarTotal();
                  return result;
            }
            if(data.cierre_z != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const base = await cajaModel.find();
                  const Ncredit = base[0].notas_de_credito;
                  let operacion = data.cierre_z - Ncredit;
                  let operacionIVA = operacion / 1.21;
                  const sumaRecaudacion = base[0].total_gastos + (operacion * 0.03);
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_gastos: sumaRecaudacion}});
                  //await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {cierreZ_Ncredit: operacion}});
                  //await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {comprasA_sIVA: operacionIVA}});
                  let totalVentasB = base[0].recaudado + operacion + data.cierre_z;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comprasB: totalVentasB}});
                  let opTotalVentas = operacionIVA + totalVentasB;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_ventas: opTotalVentas}});
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {cierre_z: data.cierre_z}});
                  await mongo.ingresarTotal();
                  return result;
            }
            if(data.credito_debito != null){
                if(test.length == 0){
                    return await cajaModel.create({fecha: fecha.fecha}, data);
                  }
                  const base = await cajaModel.find();
                  const valorComicion = 0.8 //TODO hacer que sea copnfigurable desde el cliente
                  const operacion = (valorComicion / 100) * data.credito_debito;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {comiciones: operacion}});
                  const restaTotal = data.credito_debito - operacion;
                  let sumaTodasLasComiciones = restaTotal + base[0].comicionMP_resta;
                  sumaTodasLasComiciones = sumaTodasLasComiciones.toFixed(2);
                  let comicionRestaTotal = operacion + base[0].total_comicionMP; 
                  comicionRestaTotal = comicionRestaTotal.toFixed(2);
                  const operacion = (valorComicion / 100) * data.credito_debito;
                  const restaTotal = data.credito_debito - operacion;
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {comicion_debitos: restaTotal}});
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {sumaComiciones: sumaTodasLasComiciones}});
                  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comiciones_resta: comicionRestaTotal}});
                  let result =  await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {credito_debito: data.credito_debito}});
                  await this.ingresarTotal(data.credito_debito)
                  return result;
            }
            

            if(test.length == 0){
                console.log("Base de datos. Creada.");

            return await cajaModel.create({
                fecha: data.fecha, 
                gasto_comida: 0,
                gasto_embalaje: 0,
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
                utilidad_real : 0
                });
            }else{
                return console.log("Base de datos. Conectada.")
            }    
        }catch(err){
            console.log("ERROR EN CREATE: " + err);
        }
    },
    ingresarTotal: async function (valor){
        try{
            const base = await cajaModel.find();
            const cierreZncredit = base[0].cierre_z - base[0].notas_de_credito;
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {cierreZ_Ncredit: cierreZncredit}});
            const totalGastos = base[0].gasto_comida + base[0].gasto_embalaje + base[0].resultado_facturaA + base[0].total_comiciones_resta;
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_gastos: totalGastos}});
            const comprasAB = base[0].resultado_comprasA + base[0].resultado_comprasB;
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comprasAB: comprasAB}});
            const ventasAsIVA = (base[0].cierre_z - base[0].notas_de_credito) / 1.21;
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {comprasA_sIVA: ventasAsIVA}});
            const totalComprasB = base[0].recaudado - base[0].notas_de_credito + base[0].cierreZ_Ncredit;
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_comprasB: totalComprasB}});
            const totalVentas = base[0].comprasA_sIVA + base[0].total_comprasB;
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {total_ventas: totalVentas}});
            const utilidadBruta = base[0].totalVentas - base[0].total_comprasAB;
            await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {utilidad_bruta: utilidadBruta}});
            const utilidadReal = base[0].utilidad_bruta - base[0].total_gastos;
            if(valor == Number){
                const recaudado = base[0].recaudado + valor;
                await cajaModel.findOneAndUpdate({fecha: fecha.fecha}, {$set: {recaudado: recaudado}});
            }
        }catch(err){
            console.log("ERROR AL INTERTAR INGRESAR EL TOTAL " + err);
        }
    }
}

module.exports = mongo;