const socket = io.connect();
const body = document.querySelector("#allBody");
let fechaHoy;

document.body.style.display = 'none';

socket.emit("start");

socket.on("refresh", res => {   
    //console.log(res)
    if(res){
        fechaHoy = res.fecha;
        document.querySelector("#fecha").innerHTML = `<h1>FECHA DEL DÍA: ${res.fecha}</h1>`;
        const fechaSplit = res.fecha.split("/")
        document.querySelector("#fecha-anterior-mes").value = fechaSplit[1]
        document.querySelector("#fecha-anterior-año").value = fechaSplit[2]
        
        updateData(res);
        document.body.style.display = 'block';
    }else{
        document.body.innerHTML = `<h1>[ Esperando Carga De Base De Datos... ] Recargue la pagina</h1>`
    }
});

//TODO
socket.on("load-caja-anterior-res", res => {
        if(res == null){
            alert("NO EXISTE CAJA EN ESA FECHA")
        }else{
             document.querySelector("#fecha").innerHTML = `<h1>FECHA DE CAJA ANTERIOR: ${res.fecha}</h1>`;
             updateData(res);
            //OLD
            //disable inputs
            // const allInputs = document.querySelectorAll("input")
            // const check = ["fecha-anterior-dia", "fecha-anterior-mes", "fecha-anterior-año"]
            // allInputs.forEach(e => {
            //     let ok = true
            //     check.forEach(c => {
            //         if(e.id === c){
            //             ok = false
            //         }
            //     })
            //     if(ok){
            //         e.setAttribute("disabled", true)
            //     }
            // })
            console.log(res)
            fechaHoy = res.fecha
        }
    
    })


body.addEventListener("click", (event) => {
    const mouse = event.target;

    if(mouse.classList.contains("retiroDeCaja")){
       const motivo = document.querySelector(".motivoCaja").value;
       const monto = document.querySelector(".montoCaja").value;
       socket.emit("ingreso-caja", { retiro_de_caja: { motivo: motivo, monto: monto }, fecha: fechaHoy})
       borrarInputs()
    }
    if(mouse.classList.contains("saldoCajaButton")){
        const monto = document.querySelector(".saldoCaja").value;
        socket.emit("ingreso-caja", { saldo_caja: Number(monto), fecha: fechaHoy})
        borrarInputs()
    }
    if(mouse.classList.contains("gastosComidaButton")){
        const monto = document.querySelector(".comidaGastos").value;
        socket.emit("ingreso-caja", { gasto_comida: Number(monto), fecha: fechaHoy})
        borrarInputs()
    }
    if(mouse.classList.contains("gastoOtrosButton")){        
        const motivo = document.querySelector(".gastosOtrosMotivo").value
        const monto = document.querySelector(".gastoOtrosMonto").value
        socket.emit("ingreso-caja", { gasto_otros: { motivo: motivo, monto: Number(monto) }, fecha: fechaHoy})
        borrarInputs()
    }
    if(mouse.classList.contains("ingresarTransferenciaICBCButton")){        
        const cliente = document.querySelector(".clienteICBC").value
        const monto = document.querySelector(".montoICBC").value
        socket.emit("ingreso-caja", { transferencias_ICBC: { cliente: cliente, monto: Number(monto) }, fecha: fechaHoy})
        borrarInputs()
    }
    if(mouse.classList.contains("gastosCorreoButton")){
        const monto = document.querySelector(".correoGastos").value
        socket.emit("ingreso-caja", { gasto_correo: Number(monto), fecha: fechaHoy})
        borrarInputs()
    }
    if(mouse.classList.contains("gastoFleteButton")){
        const monto = document.querySelector(".gastoFlete").value
        socket.emit("ingreso-caja", { gasto_flete: Number(monto), fecha: fechaHoy})
        borrarInputs()
    }
    if(mouse.classList.contains("ingresarTransferenciaSantanderButton")){        
        const cliente = document.querySelector(".clienteSantander").value
        const monto = document.querySelector(".montoSantander").value        
        socket.emit("ingreso-caja", { transferencias_Santander: { cliente: cliente, monto: Number(monto) }, fecha: fechaHoy})
        borrarInputs()
    }
    if(mouse.classList.contains("ingresarFacturasAButton")){        
        const cliente = document.querySelector(".facturaA").value
        const monto = document.querySelector(".facturaAmonto").value
        socket.emit("ingreso-caja", { gasto_facturaA: { cliente: cliente, monto: Number(monto) }, fecha: fechaHoy})
        borrarInputs()
    }
    if(mouse.classList.contains("ingresarChequesButton")){        
        const cliente = document.querySelector(".chequesClientes").value
        const monto = document.querySelector(".chequesMonto").value
        socket.emit("ingreso-caja", { cheques: { cliente: cliente, monto: Number(monto) }, fecha: fechaHoy})
        borrarInputs()
    }
    if(mouse.classList.contains("ingresarMercaderiaAButton")){        
        const cliente = document.querySelector(".facturaAcompras").value
        const monto = document.querySelector(".facturaAmontocompras").value
        socket.emit("ingreso-caja", { compras_facturaA: { cliente: cliente, monto: Number(monto) }, fecha: fechaHoy})
        borrarInputs()
    }
    if(mouse.classList.contains("retirosMPbutton")){
        const monto = document.querySelector(".montoMP").value
        const montoTotalMinoristaMP = document.querySelector(".resultadoMercadopagoMinorista").value
        const montoTotalMayoristaMP = document.querySelector(".resultRetirosMP").value
        
        socket.emit("ingreso-caja", { mercadopago_retirado: Number(monto),
                                      montoTotalMinoristaMP: Number(montoTotalMinoristaMP),
                                      montoTotalMayoristaMP: Number(montoTotalMayoristaMP), 
                                      fecha: fechaHoy
                                    })
        borrarInputs()
    }
    if(mouse.classList.contains("comprasTipoBbutton")){
        const cliente = document.querySelector(".comprasTipoB").value
        const monto = document.querySelector(".comprasTipoBmonto").value
        socket.emit("ingreso-caja", { compras_facturaB: { cliente: cliente, monto: Number(monto) }, fecha: fechaHoy})
        borrarInputs()
    }
    if(mouse.classList.contains("minoristaTransferenciaButton")){
        const monto = document.querySelector(".minoristaTransferencia").value
        socket.emit("ingreso-caja", { transferencias_minorista: Number(monto), fecha: fechaHoy})
        borrarInputs()
    }
    if(mouse.classList.contains("retirosMPMinoristabutton")){
        const monto = document.querySelector(".mercadopagoMinorista").value
        const montoTotalMinoristaMP = document.querySelector(".resultadoMercadopagoMinorista").value
        const montoTotalMayoristaMP = document.querySelector(".resultRetirosMP").value

        socket.emit("ingreso-caja", { mercadopago_minorista: Number(monto),                                      
                                      montoTotalMinoristaMP: Number(montoTotalMinoristaMP),
                                      montoTotalMayoristaMP: Number(montoTotalMayoristaMP),
                                      fecha: fechaHoy
                                    })
        borrarInputs()
    }
    if(mouse.classList.contains("creditoDebitoButton")){
        const monto = document.querySelector(".creditoDebito").value
        socket.emit("ingreso-caja", { credito_debito: Number(monto), fecha: fechaHoy})
        borrarInputs()
    }
    if(mouse.classList.contains("cierreZbutton")){
        const monto = document.querySelector(".cierreZ").value
        
        const cierreZrestaNcred = document.querySelector(".cierreZ-Ncredit").textContent
        console.log(monto, cierreZrestaNcred)
        socket.emit("ingreso-caja", { cierre_z: Number(monto), cierreZrestaNcred: Number(cierreZrestaNcred), fecha: fechaHoy})
        borrarInputs()
    }
    if(mouse.classList.contains("notaDeCreditoButton")){
        const monto = document.querySelector(".notaDeCredito").value
        const cierreZrestaNcred = document.querySelector(".cierreZ-Ncredit").textContent
        socket.emit("ingreso-caja", { notas_de_credito: Number(monto), cierreZrestaNcred: Number(cierreZrestaNcred), fecha: fechaHoy })
        borrarInputs()
    }
    if(mouse.classList.contains("ventasCtaCteButton")){
        const monto = document.querySelector(".ventasCtaCte").value
        
        socket.emit("ingreso-caja", { ventas_cta_cte: Number(monto), fecha: fechaHoy })
        borrarInputs()
    }
    //BUSCAR CAJAS ANTERIORES
    if(mouse.classList.contains("boton-caja-anterior")){
        let dia = document.querySelector("#fecha-anterior-dia").value
        let mes = document.querySelector("#fecha-anterior-mes").value
        const anio = document.querySelector("#fecha-anterior-año").value
        
        if(dia.length == 1){
            dia = "0" + dia
        }
        if(mes.length == 1){
            mes = "0" + mes
        }

        const fecha = dia + "/" + mes + "/" + anio
        
        if(dia && mes && anio){            
            alert("BUSCANDO CAJA ANTERIOR") 
            socket.emit("load-caja-anterior", fecha)
        }else{
            alert("FALTA INGRESAR UN DATO")
        }
    }
})




function borrarInputs(){
    const borrarTexto = document.querySelectorAll("input");
    borrarTexto.forEach(element => {
        if(element.value != " "){            
            element.value = " ";
        }
    });
}



