const { async } = require("rxjs");
const store = require("../store/store")

const controller = {
    start: async function () {
        const fecha =  crearFecha();
        const res = await store.read(fecha);
        
        if(res != undefined) {
            return res;
        }else{
           console.log("inicializando") 
           const res = await controller.inicializar(fecha);
           return res;
        }
    },
    inicializar: async function (fecha) {
        console.log("Creando caja fecha", fecha)
        if(!fecha){
            fecha =  crearFecha();
        }
        
        const data = { fecha: fecha,
                       recaudado: 0,
                       saldo_caja: 0,
                       gasto_comida: 0, 
                       gasto_correo: 0,
                       gasto_flete: 0,  
                       resultado_comprasA: 0, 
                       resultado_facturaA: 0,
                       total_gastos: 0,   
                       mercadopago_retirado: 0, 
                       resultado_comprasB: 0,
                       mercadopago_minorista: 0,   
                       mercadopago_total: 0,
                       total_comicionMP: 0, 
                       comicionMP_resta: 0,  
                       credito_debito: 0,    
                       comiciones: 0,
                       comicion_debitos: 0, 
                       cierre_z: 0,   
                       notas_de_credito: 0,
                       cierreZ_Ncredit: 0,
                       comprasA_sIVA: 0,
                       total_comprasB: 0,
                       total_ventas: 0,
                       ventas_cta_cte: 0,
                       total_comprasAB: 0,
                       total_ventas: 0,
                       utilidad_bruta: 0,
                       utilidad_real: 0
                    }
        const res = await store.write(data);
        return res;
    },
    ingreso: async function (data) {
            //console.log(data)
            if(data.retiro_de_caja != undefined){
                data.retiro_de_caja.monto = Number(data.retiro_de_caja.monto)
                await store.retiro_de_caja(data);
                
            }
            if(data.saldo_caja){
                await store.saldo_caja(data);
                
            }
            if(data.gasto_comida){
                await store.comida(data);
                
            }
            if(data.gasto_otros){
                await store.gasto_otros(data);
                
            }
            if(data.transferencias_ICBC){
                await store.transferencias_ICBC(data);
                
            }
            if(data.gasto_correo){
                await store.gasto_correo(data);
                
            }
            if(data.gasto_flete){
                await store.gasto_flete(data);
                
            }
            if(data.transferencias_Santander){
                await store.transferencias_Santander(data);
                
            }
            if(data.gasto_facturaA){
                await store.gasto_facturaA(data);
                
            }
            if(data.cheques){
                await store.cheques(data);
                
            }
            if(data.compras_facturaA){
                await store.compras_facturaA(data);
                
            }
            if(data.mercadopago_retirado){
                const comicionMP = 1 //TODO en variable entorno
                       
                const mercadoPagoRetiro = (data.montoTotalMayoristaMP + data.mercadopago_retirado) - data.montoTotalMinoristaMP;
                const totalComicionMP = (comicionMP / 100) * mercadoPagoRetiro;
                const totalComicionMPresta = mercadoPagoRetiro - totalComicionMP;
                
                //TODO let totalComicionesResta = totalComicionMP + operacionDebitos; 
                //RESTA CON COMICIONDEBITOS

                await store.mercadopago_retirado(data, totalComicionMP, totalComicionMPresta);
                
            }
            if(data.compras_facturaB){
                await store.compras_facturaB(data);
                
            }
            if(data.transferencias_minorista){
                await store.transferencias_minorista(data);
                
            }
            if(data.mercadopago_minorista){
                const comicionMP = 1 //TODO en variable entorno
                const resta = data.mercadopago_minorista * -1;        
                const mercadoPagoRetiro = data.montoTotalMayoristaMP - (data.montoTotalMinoristaMP + data.mercadopago_minorista);
                const totalComicionMP = (comicionMP / 100) * mercadoPagoRetiro;
                const totalComicionMPresta = mercadoPagoRetiro - totalComicionMP;
                
                //TODO let totalComicionesResta = totalComicionMP + operacionDebitos; 
                //RESTA CON COMICIONDEBITOS

                await store.mercadopago_minorista(data, resta, totalComicionMP, totalComicionMPresta);
                
            }
            if(data.credito_debito){
                const comicionDebtCred = 0.8 //TODO en variable entorno
                const totalComicionDebtCred = (comicionDebtCred / 100) * data.credito_debito;
                const totalComicionRestaDebtCred = data.credito_debito - totalComicionDebtCred;
                await store.credito_debito(data, totalComicionDebtCred, totalComicionRestaDebtCred);
                
            }
            if(data.cierre_z){
               
                const porcentajeIngresosBrutos = 0.05 //TODO en variable entorno               
                const cierreZMenosNotaCredito = data.cierreZrestaNcred + data.cierre_z;
                const totalGastos = cierreZMenosNotaCredito * porcentajeIngresosBrutos
                let coeficienteViejo = 0
                if(data.cierreZrestaNcred != 0){
                    coeficienteViejo = (data.cierreZrestaNcred * porcentajeIngresosBrutos) * -1;
                }
                console.log(coeficienteViejo)
                await store.cierre_z(data, totalGastos, cierreZMenosNotaCredito, coeficienteViejo);
                
            }
            if(data.notas_de_credito){
                const porcentajeIngresosBrutos = 0.05 //TODO en variable entorno
                const cierreZMenosNotaCredito = data.cierreZrestaNcred - data.notas_de_credito;
                const totalGastos = cierreZMenosNotaCredito * porcentajeIngresosBrutos
                const coeficienteViejo = (data.cierreZrestaNcred * porcentajeIngresosBrutos) * -1;
                await store.notas_de_credito(data, cierreZMenosNotaCredito, totalGastos, coeficienteViejo);
                
            }
            if(data.ventas_cta_cte){
                await store.ventas_cta_cte(data);                
            }

            const datosCaja = await store.read(data.fecha);
            return store.results(datosCaja);
        },
        findCajaAnterior: async function (fecha) {            
          const res = await store.read(fecha);
          return res;
        },
        findMes: async function (fecha){
           const fechaSplit = fecha.split("/") 
           const mesAnio = fechaSplit[1] + "/" + fechaSplit[2]
           const res = await store.search(mesAnio)
           return res
        }
    }


function crearFecha() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;        
    const fecha = dd + '/' + mm + '/' + yyyy;
    return fecha;
}

module.exports = controller;