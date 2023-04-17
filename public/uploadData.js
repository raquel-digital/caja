function updateData(data){
    //resultados totales
    document.querySelector(".recaudado").innerHTML = `${data.recaudado}`
    document.querySelector(".resultsaldoCaja").innerHTML = `${data.saldo_caja}`
    document.querySelector(".resultadoComida").innerHTML = `${data.gasto_comida}`
    document.querySelector(".resultcorreoGastos").innerHTML = `${data.gasto_correo}`
    document.querySelector(".resultgastoFlete").innerHTML = `${data.gasto_flete}`
    document.querySelector(".totalGastos").innerHTML = `${data.total_gastos}`
    document.querySelector(".resultRetirosMP").innerHTML = `${data.mercadopago_retirado}`
    document.querySelector(".resultGlobalB").innerHTML = `TOTAL: ${data.resultado_comprasB}`
    document.querySelector(".resultGlobalB2").innerHTML = `${data.resultado_comprasB}`
    document.querySelector(".resultadoMercadopagoMinorista").innerHTML = `${data.mercadopago_minorista}`
    document.querySelector(".mercadopagoTotales").innerHTML = `${data.mercadopago_total}`
    document.querySelector(".comicionesMP").innerHTML = `${data.total_comicionMP}`
    document.querySelector(".total-comicionMP").innerHTML = `${data.comicionMP_resta}`
    document.querySelector(".resultadocreditoDebito").innerHTML = `${data.credito_debito}`
    document.querySelector(".comiciones").innerHTML = `${data.comiciones}`
    document.querySelector(".comicion-debito").innerHTML = `${data.comicion_debitos}`;
    document.querySelector(".resultadonotaDeCredito").innerHTML = `${data.notas_de_credito}`;
    document.querySelector(".cierreZ-Ncredit").innerHTML = `${data.cierreZ_Ncredit}`;
    document.querySelector(".resultadocierreZ").innerHTML = `${data.cierre_z}`;
    document.querySelector(".resultadoventasCtaCte").innerHTML = `${data.ventas_cta_cte}`;
    document.querySelector(".comprasAsIVA").innerHTML = `${data.total_comprasB}`;
    document.querySelector(".totalComprasB").innerHTML = `${data.comprasA_sIVA}`;
    document.querySelector(".resultGlobalAcompras2").innerHTML = `${data.resultado_comprasA}`;
    document.querySelector(".comprasAB").innerHTML = `${data.total_comprasAB}`;
    document.querySelector(".totalVentasFinal").innerHTML = `${data.total_ventas}`;
    document.querySelector(".utilidad_bruta").innerHTML = `${data.utilidad_bruta}`;
    document.querySelector(".utilidadReal").innerHTML = `${data.utilidad_real}`;
    
    //resultados con arrays
    if(data.retiro_de_caja != undefined){
        let total = 0;
        document.querySelector(".resultRetiroDeCaja").innerHTML = "";
        data.retiro_de_caja.forEach(e => {
            document.querySelector(".resultRetiroDeCaja").innerHTML += `
                <li>Motivo: ${e.motivo} Monto: ${e.monto}</li>
            `
            total += e.monto
            document.querySelector(".sumaDeRetiros").innerHTML = `<hr><h5> Total Retirado: ${total}</h4>`
        });
    }    
    if(data.gasto_otros != undefined){
        
        document.querySelector(".resultGastoOtros").innerHTML = "";
        data.gasto_otros.forEach(e => {
            document.querySelector(".resultGastoOtros").innerHTML += `
                <li>Motivo: ${e.motivo} Monto: ${e.monto}</li>
            `
        });
    } 
    if(data.transferencias_ICBC != undefined){        
        document.querySelector(".transferenciaICBC").innerHTML = "";
        data.transferencias_ICBC.forEach(e => {
            document.querySelector(".transferenciaICBC").innerHTML += `
                <li>Cliente: ${e.cliente} Monto: ${e.monto}</li>
            `
        });
    } 
    if(data.transferencias_Santander != undefined){        
        document.querySelector(".transferenciaSantander").innerHTML = "";
        data.transferencias_Santander.forEach(e => {
            document.querySelector(".transferenciaSantander").innerHTML += `
                <li>Cliente: ${e.cliente} Monto: ${e.monto}</li>
            `
        });
    } 
    if(data.gasto_facturaA != undefined){        
        document.querySelector(".resultfacturaA").innerHTML = "";
        let total = 0;
        data.gasto_facturaA.forEach(e => {
            document.querySelector(".resultfacturaA").innerHTML += `
                <li>Cliente: ${e.cliente} Monto: ${e.monto}</li>
            `
            total += e.monto;
        });
        document.querySelector(".resultGlobalA").innerHTML = `
        <h5>Total Sin IVA: ${data.resultado_facturaA}</h5>
        `;        
    } 
    if(data.cheques != undefined){        
        document.querySelector(".resultCheques").innerHTML = "";
        data.cheques.forEach(e => {
            document.querySelector(".resultCheques").innerHTML += `
                <li>Cliente: ${e.cliente} Monto: ${e.monto}</li>
            `
        });
    } 
    if(data.compras_facturaA != undefined){        
        document.querySelector(".resultfacturaAcompras").innerHTML = "";
        data.compras_facturaA.forEach(e => {
            document.querySelector(".resultfacturaAcompras").innerHTML += `
                <li>Cliente: ${e.cliente} Monto: ${e.monto}</li>
            `
        });

        document.querySelector(".resultGlobalAcompras").innerHTML = `<h5>Total Sin IVA:${data.resultado_comprasA}<h5>`
    }
    if(data.compras_facturaB != undefined){        
        document.querySelector(".resultcomprasTipoB").innerHTML = "";
        data.compras_facturaB.forEach(e => {
            document.querySelector(".resultcomprasTipoB").innerHTML += `
                <li>Cliente: ${e.cliente} Monto: ${e.monto}</li>
            `
        });
    } 
    if(data.transferencias_minorista != undefined){        
        document.querySelector(".resultMinoristaTransferencia").innerHTML = "";
        data.transferencias_minorista.forEach(e => {
            document.querySelector(".resultMinoristaTransferencia").innerHTML += `
                <li>Monto: ${e}</li>
            `
        });
    }
}