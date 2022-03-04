// inicializamos la conexion
const socket = io.connect();
var copiaData;
var envioData;
var fechaCli;

socket.on("fecha_ant", data => {
  fechaCli = data;  
})
socket.emit("base-data-inicial");

let contabilizar = false;
socket.on("allData", data => {
    console.log(fechaCli) 
    console.log(data)  
    copiaData = data;
    if(data[0].fecha != fechaCli){
      envioData = "dato-anterior";
    }else{
      envioData = "nuevo-dato";
    }
    if(data.length > 0){
        document.querySelector(".fecha").innerHTML = `<h1>FECHA: ${data[0].fecha}</h1>`;
        const mesEnCurso = data[0].fecha.split("-");
        const anio = mesEnCurso[2]        
        document.querySelector(".mes-en-curso").textContent =`${mesEnCurso[1]}`
        document.querySelector(".anio-en-curso").value =`${mesEnCurso[2]}`
        if(data[0].retiro_de_caja != null){
            let retiroDeCaja = document.querySelector(".resultRetiroDeCaja");    
            retiroDeCaja.innerHTML = ``;
               data[0].retiro_de_caja.forEach(e => {
                retiroDeCaja.innerHTML += `<div class="row">
                   <li>motivo: <b>${e.cliente} </b>monto: <b>${e.monto}</b></li><img src="https://cdn-icons-png.flaticon.com/512/32/32355.png" width="15" height="15" alt="">;
                   </div>`
                })
        }
        if(data[0].saldo_caja != null){
            let saldoCaja = document.querySelector(".resultsaldoCaja");
            saldoCaja.innerHTML = `<p>TOTAL DE CAJA: ${data[0].saldo_caja}</p>`;
          }

         if(data[0].transferencias_ICBC != null){
         let transferenciaICBC = document.querySelector(".transferenciaICBC");    
            transferenciaICBC.innerHTML = ``;
            data[0].transferencias_ICBC.forEach(e => {
                transferenciaICBC.innerHTML += `
                <li>cliente: <b>${e.cliente} </b>monto: <b>${e.monto}</b></li>
                `;
         })
        }
        if(data[0].transferencias_Santander != null){
        let transferenciaSantander = document.querySelector(".transferenciaSantander");
            transferenciaSantander.innerHTML = ``;
            data[0].transferencias_Santander.forEach(e => {
                transferenciaSantander.innerHTML += `
                <li>cliente: <b>${e.cliente} </b>monto: <b>${e.monto}</b></li>
                `;
         })
        }
         if(data[0].gasto_comida != null){
           let gastoComida = document.querySelector(".resultasoComida");
           gastoComida.innerHTML = `<p>TOTAL GASTADO: ${data[0].gasto_comida}</p>`;
         }
         if(data[0].gasto_embalaje != null){
            //console.log(data[0].gasto_embalaje)
            let gastoEmbalaje = document.querySelector(".resultgastoEmbalaje");
            gastoEmbalaje.innerHTML = " ";
            data[0].gasto_embalaje.forEach(e => {
            gastoEmbalaje.innerHTML += `<li>Motivo: ${e.motivo} Monto: ${e.gasto_embalaje}</li>`;
            });  
          }
         if(data[0].gasto_correo != null){
            let gastoCorreo = document.querySelector(".resultcorreoGastos");
            gastoCorreo.innerHTML = `<p>TOTAL GASTADO: ${data[0].gasto_correo}</p>`;
          }
         if(data[0].gasto_flete != null){
            let gastoFlete = document.querySelector(".resultgastoFlete");
            gastoFlete.innerHTML = `<p>TOTAL GASTADO: ${data[0].gasto_flete}</p>`;
          }
         if(data[0].cheques != null){
         let cheques = document.querySelector(".resultCheques");    
         cheques.innerHTML = ``;
            data[0].cheques.forEach(e => {
                cheques.innerHTML += `
                <li>cliente: <b>${e.cliente} </b>monto: <b>${e.monto}</b></li>
                `;
         })
        }
        if(data[0].gasto_facturaA != null){
            let gasto = document.querySelector(".resultfacturaA");    
            gasto.innerHTML = ``;
            data[0].gasto_facturaA.forEach(e => {
                    gasto.innerHTML += `
                        <li>empresa: <b>${e.empresa} </b>monto: <b>${e.monto}</b></li>
                        `;
            })
            let totalGlobal = document.querySelector(".resultGlobalA");
            totalGlobal.innerHTML = `
            <li>TOTAL: ${data[0].resultado_facturaA}</li>
            `;
           } 
           if(data[0].compras_facturaA != null){
            let gasto = document.querySelector(".resultfacturaAcompras");    
            gasto.innerHTML = ``;
            data[0].compras_facturaA.forEach(e => {
                    gasto.innerHTML += `
                        <li>empresa: <b>${e.empresa} </b>monto: <b>${e.monto}</b></li>
                        `;
            })
            let totalGlobal = document.querySelector(".resultGlobalAcompras");
            totalGlobal.innerHTML = `
            <li>TOTAL: ${data[0].resultado_comprasA}</li>
            `;
            let totalGlobal2 = document.querySelector(".resultGlobalAcompras2");
            totalGlobal2.innerHTML = `
            <p>${data[0].resultado_comprasA}</p>
            `;
           }
           if(data[0].compras_facturaB != null){
            let gasto = document.querySelector(".resultcomprasTipoB");    
            gasto.innerHTML = ``;
            data[0].compras_facturaB.forEach(e => {
                    gasto.innerHTML += `
                        <li>empresa: <b>${e.empresa} </b>monto: <b>${e.monto}</b></li>
                        `;
            })
            let totalGlobal = document.querySelector(".resultGlobalB");
            totalGlobal.innerHTML = `
            <li>TOTAL: ${data[0].resultado_comprasB}</li>
            `;
            let totalGlobal2 = document.querySelector(".resultGlobalB2");
            totalGlobal2.innerHTML = `
            <p>${data[0].resultado_comprasB}</p>
            `;
           }
           if(data[0].retiros_MP != null){
            let gasto = document.querySelector(".resultcomprasMP");    
            gasto.innerHTML = ``;
            data[0].retiros_MP.forEach(e => {
                    gasto.innerHTML += `
                        <li>empresa: <b>${e.empresa} </b>monto: <b>${e.monto}</b></li>
                        `;
            })
           }
           if(data[0].mercadopago_retirado != null){
            let result = document.querySelector(".resultadoMercadopagoRetirado");
            result.innerHTML = `<p>${data[0].mercadopago_retirado}</p>`;
          }
          if(data[0].mercadopago_minorista != null){
            let result = document.querySelector(".resultadoMercadopagoMinorista");
            result.innerHTML = `<p>${data[0].mercadopago_minorista}</p>`;
          }
          if(data[0].mercadopago_total != null){
            let result = document.querySelector(".mercadopagoTotales");
            result.innerHTML = `<p>${data[0].mercadopago_total}</p>`;
          } 
          if(data[0].notas_de_credito != null){
            let result = document.querySelector(".resultadonotaDeCredito");
            result.innerHTML = `<p>${data[0].notas_de_credito}</p>`;
          } 
          if(data[0].cierre_z != null){
            let result = document.querySelector(".resultadocierreZ");
            result.innerHTML = `<p>${data[0].cierre_z}</p>`;
          }
          if(data[0].ventas_cta_cte != null){
            let result = document.querySelector(".resultadoventasCtaCte");
            result.innerHTML = `<p>${data[0].ventas_cta_cte}</p>`;
          }
          if(data[0].cierreZ_Ncredit != null){
            let result = document.querySelector(".cierreZ-Ncredit");
            result.innerHTML = `<p>${data[0].cierreZ_Ncredit}</p>`;
          }
          if(data[0].credito_debito != null){
            let result = document.querySelector(".resultadocreditoDebito");
            result.innerHTML = `<p>${data[0].credito_debito}</p>`;
          }
          if(data[0].comiciones != null){
            let result = document.querySelector(".comiciones");
            result.innerHTML = `<p>${data[0].comiciones}</p>`;
          }
          if(data[0].comicion_debitos != null){
            let result = document.querySelector(".comicion-debito");
            result.innerHTML = `<p>${data[0].comicion_debitos}</p>`;
          }
          if(data[0].total_comicionMP != null){
            let result = document.querySelector(".comicionesMP");
            result.innerHTML = `<p>${data[0].total_comicionMP}</p>`;
          }
          if(data[0].comicionMP_resta != null){
            let result = document.querySelector(".total-comicionMP");
            result.innerHTML = `<p>${data[0].comicionMP_resta}</p>`;
          }
          if(data[0].sumaComiciones != null){
            let result = document.querySelector(".sumaComiciones");
            result.innerHTML = `<p>${data[0].sumaComiciones}</p>`;
          }
          if(data[0].total_comiciones_resta != null){
            let result = document.querySelector(".comicionesDescontadas");
            result.innerHTML = `<p>${data[0].total_comiciones_resta}</p>`;
          }
          if(data[0].recaudado != null){
            let result = document.querySelector(".recaudado");
            result.innerHTML = `<p>${data[0].recaudado}</p>`;
          }
          if(data[0].total_gastos != null){
            let result = document.querySelector(".totalGastos");
            result.innerHTML = `<p>${data[0].total_gastos}</p>`;
          }
          if(data[0].total_comprasAB != null){
            let result = document.querySelector(".comprasAB");
            result.innerHTML = `<p>${data[0].total_comprasAB}</p>`;
          }
          if(data[0].comprasA_sIVA != null){
            let result = document.querySelector(".comprasAsIVA");
            result.innerHTML = `<p>${data[0].comprasA_sIVA}</p>`;
          }
          if(data[0].total_comprasB != null){
            let result = document.querySelector(".totalComprasB");
            result.innerHTML = `<p>${data[0].total_comprasB}</p>`;
          }
          if(data[0].total_ventas != null){
            let result = document.querySelector(".totalVentasFinal");
            result.innerHTML = `<p>${data[0].total_ventas}</p>`;
          }
          if(data[0].utilidad_bruta != null){
            let result = document.querySelector(".utilidad_bruta");
            result.innerHTML = `<p>${data[0].utilidad_bruta}</p>`;
          }
          if(data[0].utilidad_real != null){
            let result = document.querySelector(".utilidadReal");
            result.innerHTML = `<p>${data[0].utilidad_real}</p>`;
          }
          
    }
      //nos aseguramos que la caja contabilice bien
      contarCaja();

     })

function ingresarTransferenciaICBC(){
    let cliente = document.querySelector(".clienteICBC").value;
    let monto = document.querySelector(".montoICBC").value;
    monto = parseFloat(monto);
    const transferencia = {monto: monto, cliente: cliente};
    let model = {transferencias_ICBC: transferencia}
    return socket.emit(envioData, model);
}
function ingresarTransferenciaSantander(){
    let cliente = document.querySelector(".clienteSantander").value;
    let monto = document.querySelector(".montoSantander").value;
    monto = parseFloat(monto);
    const transferencia = {monto: monto, cliente: cliente};
    let model = {transferencias_Santander: transferencia}
    return socket.emit(envioData, model);
}
function gastosComida(){
    let valor = parseFloat(document.querySelector(".comidaGastos").value);
    //let valorSuma = valor + copiaData[0].gasto_comida;
    const gastoComida = {gasto_comida: valor};
    console.log(gastoComida)
    return socket.emit(envioData, gastoComida);
}
function gastoFlete(){
    let valor = parseFloat(document.querySelector(".gastoFlete").value);
    //let valorSuma = valor + copiaData[0].gasto_flete;
    const gastoFlete = {gasto_flete: valor};
    return socket.emit(envioData, gastoFlete);
}
function ingresarCheques(){
    let cliente = document.querySelector(".chequesClientes").value;
    let monto = document.querySelector(".chequesMonto").value;
    monto = parseFloat(monto);
    const transferencia = {monto: monto, cliente: cliente};
    let model = {cheques: transferencia}
  return socket.emit(envioData, model);
}
function retiroDeCaja(){    
    let cliente = document.querySelector(".motivoCaja").value;
    let monto = document.querySelector(".montoCaja").value;
    monto = parseFloat(monto);
    const retiro = {monto: monto, cliente: cliente};
    let model = {retiro_de_caja: retiro}
    //console.log(model)
    return socket.emit(envioData, model);
}
function saldoCaja(){
    let valor = parseFloat(document.querySelector(".saldoCaja").value);
    const model = {saldo_caja: valor};
    return socket.emit(envioData, model);
}
function gastosCorreo(){
    let valor = parseFloat(document.querySelector(".correoGastos").value);
    //let valorSuma = valor + copiaData[0].gasto_correo;
    const gastoCorreo = {gasto_correo: valor};
    return socket.emit(envioData, gastoCorreo);
}
function gastoEmbalaje(){
    const motivo = document.querySelector(".gastoEmbalajeMotivo").value;
    let valor = parseFloat(document.querySelector(".gastoEmbalaje").value);
    const model = {motivo: motivo, gasto_embalaje: valor}
    const gasto = {gasto_embalaje: model}
    return socket.emit(envioData, gasto);
}
//tratamos de evitar tanta recursion
function ingresarFacturas(empresa, monto, tipo){
    
    const empresaValue = document.querySelector(empresa).value;
    const montoValue = parseFloat(document.querySelector(monto).value);
    const modelInt = {monto: montoValue, empresa: empresaValue};
    let model;
    let modelResult;
    let resultadoSuma = 0;
    if(tipo == 'facturaA'){
        model = {gasto_facturaA: modelInt};
        copiaData[0].gasto_facturaA.forEach(e => {
            resultadoSuma += e.monto;
        })
        const resultS_iva = (resultadoSuma + montoValue) / 1.21;
        modelResult = {resultado_facturaA: resultS_iva};
    }
    if(tipo == 'comprasA'){
        model = {compras_facturaA: modelInt};
        copiaData[0].compras_facturaA.forEach(e => {
            resultadoSuma += e.monto;
        })
            const resultS_iva = (resultadoSuma + montoValue) / 1.21;
            //console.log(typeof resultS_iva.toFixed(2))
            modelResult = {resultado_comprasA: resultS_iva};
        
    }
    if(tipo == 'comprasB'){
        model = {compras_facturaB: modelInt};
        copiaData[0].compras_facturaB.forEach(e => {
            resultadoSuma += e.monto;
        })
        const resultS_iva = resultadoSuma + montoValue;
        modelResult = {resultado_comprasB: resultS_iva};
    }
    if(tipo == 'comprasB'){
        model = {compras_facturaB: modelInt};
    }
    
    socket.emit(envioData, modelResult);
    return socket.emit(envioData, model);
}
function comprasMP(empresa, monto, tipo){
    const empresaValue = document.querySelector(empresa).value;
    const montoValue = parseFloat(document.querySelector(monto).value);
    const modelInt = {monto: montoValue, empresa: empresaValue};
    const model = {retiros_MP: modelInt};
    return socket.emit(envioData, model);
}
function cajaCierre(valor, resultado){
    let monto = parseFloat(document.querySelector(valor).value);
    if(resultado == '.resultadoMercadopagoRetirado'){
        const model = {mercadopago_retirado: monto};
        return socket.emit(envioData, model);
    }
    if(resultado == '.resultadoMercadopagoMinorista'){           
        const model = {mercadopago_minorista: monto};
        return socket.emit(envioData, model);
    }
    if(resultado == '.cierreZ'){        
        const model = {cierre_z: monto};
        return socket.emit(envioData, model);
    }
    if(resultado == '.notaDeCredito'){
        //let suma = monto + copiaData[0].notas_de_credito;
        const model = {notas_de_credito: monto};
        return socket.emit(envioData, model);
    }
    if(resultado == '.ventasCtaCte'){
        //let suma = monto + copiaData[0].ventas_cta_cte;
        const model = {ventas_cta_cte: monto};
        return socket.emit(envioData, model);
    }
    if(resultado == "creditoDebito"){
        const model = {credito_debito: monto};
        return socket.emit(envioData, model);
    }
}
function cerrameLa12(){
  socket.emit("cierre-caja");
  alert("caja contabilizada");
}

function contarCaja(){
  if(!contabilizar){
    const model = {cierre_z: 0};
    contabilizar = true;
    return socket.emit(envioData, model);
  }else{
    return;
  }
}

//------FECHA----------------
var anio = new Date().getFullYear();
var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
let mes = new Date().getMonth();
let mesEnCurso = queMes(mes);
let dia = new Date
let fecha = dia.getDate() +"-"+ mesEnCurso;
function queMes(mes){
    return meses[mes] +"-"+ anio;
}

function salir(){
  socket.emit("salir")
}

socket.on("fecha-anterior", () =>{
  socket.emit("res-fecha-anterior", fechaCli); 
});
 