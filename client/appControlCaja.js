const socket = io.connect();


var allData;
let totalVentas = 0;
let totalCierreZ = 0;
socket.emit("base-data-inicial")
socket.on("allData", data => {
    console.log(data)
    allData = data;
    document.querySelector(".fecha").innerHTML = `<h1>FECHA: ${data[0].fecha}</h1>`;
    socket.emit("getMonth" ,data[0].fecha);
})
socket.on("getMonthResult", data => {
    allData.push(data);
    console.log(allData)
    document.querySelector(".load").innerHTML = "";
    const totalFormData = sumaFormula(formData);
    document.querySelector(".table").innerHTML = `<table class="table table-striped table-hover">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">FECHA</th>
                                                                    <th scope="col">VENTAS</th>
                                                                    <th scope="col">CIERRE Z</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody class="tableBody">   
                                                            </tbody>
                                                            <tfoot>
                                                                <tr>
                                                                    <td>TOTAL SALIDAS: ${totalFormData}</td> 
                                                                    <td class="totalVentas">TOTAL VENTAS: ${totalVentas}</td>
                                                                    <td class="totalCierreZ">TOTAL CIERRE Z: ${totalCierreZ}</td>                                                              
                                                                </tr>
                                                            </tfoot>
                                                            </table>`
    let tableBody = document.querySelector(".tableBody");
    tableBody.innerHTML += `<tr><td>${allData[0].fecha}</td><td>${allData[0].total_ventas.toFixed(2)}</td><td>${allData[0].cierre_z.toFixed(2)}</td></tr>`
        totalVentas += parseFloat(allData[0].total_ventas);
        totalCierreZ += parseFloat(allData[0].cierre_z);
    data.forEach(element => {
        if(element[0].total_ventas == undefined)
        return
        tableBody.innerHTML += `<tr><td>${element[0].fecha}</td><td>${element[0].total_ventas}</td><td>${element[0].cierre_z}</td></tr>`
        totalVentas += parseFloat(element[0].total_ventas);
        totalCierreZ += parseFloat(element[0].cierre_z);
    });
    document.querySelector(".totalVentas").innerHTML = `TOTAL VENTAS: ${totalVentas.toFixed(2)}`;
    document.querySelector(".totalCierreZ").innerHTML = `TOTAL CIERRE Z: ${totalCierreZ.toFixed(2)}`;

let result = {
    totalGasto: 0,
    comprasA: 0,
    comprasB: 0,
    TOT_COMPRA: 0,
    VENTA_A_s_iv: 0,
    VENTASB: 0,
    TOT_VENTAS: 0,
    totalNeto: 0
}

function gastos(result) {

    result.totalGasto += allData[0].total_gastos;
    result.comprasA += allData[0].resultado_comprasA;
    result.comprasB += allData[0].resultado_comprasB;
    result.TOT_COMPRA += allData[0].total_comprasAB;
    result.VENTA_A_s_iv += allData[0].comprasA_sIVA;
    result.VENTASB += allData[0].total_comprasB;
    result.TOT_VENTAS += allData[0].total_ventas;
    result.totalNeto += allData[0].notas_de_credito;

    allData[1].forEach( e => {

        if(e[0].total_gastos == undefined)
        return
        result.totalGasto += e[0].total_gastos;
        result.comprasA += e[0].resultado_comprasA;
        result.comprasA += e[0].resultado_comprasB;
        result.TOT_COMPRA += e[0].total_comprasAB;
        result.VENTA_A_s_iv += e[0].comprasA_sIVA
        result.VENTASB += e[0].total_comprasB;
        result.TOT_VENTAS += e[0].total_ventas;
        result.totalNeto += e[0].notas_de_credito;

    });
    result.totalGasto += totalFormData;
    return result;
}

gastos(result);

document.querySelector(".totalGastoDiario").innerHTML = `TOT c/GASTO diario: ${result.totalGasto}`;
document.querySelector(".comprasA").innerHTML = `COMPRAS A: ${result.comprasA}`;
document.querySelector(".comprasB").innerHTML = `COMPRAS B: ${result.comprasB}`;
document.querySelector(".TOT-COMPRA").innerHTML = `TOT COMPRA: ${result.TOT_COMPRA}`;
document.querySelector(".VENTA-Asiv").innerHTML = `VENTA A(s/iv): ${result.VENTA_A_s_iv}`;
document.querySelector(".VENTAS-B").innerHTML = `VENTAS B: ${result.VENTA_A_s_iv}`;
document.querySelector(".TOT-VENTAS").innerHTML = `TOT VENTAS: ${result.TOT_VENTAS}`;
const utilidadBruta = result.TOT_VENTAS - result.TOT_COMPRA;
document.querySelector(".UTILID-BRUTA").innerHTML = `UTILIDAD BRUTA: ${result.TOT_VENTAS - result.TOT_COMPRA}`;
document.querySelector(".UTILID-REAL").innerHTML = `UTILIDAD REAL: ${utilidadBruta - result.totalGasto}`;
const netoGrav = totalCierreZ / 1.21;
document.querySelector(".NETO-GRAV").innerHTML = `NETO GRAV: ${netoGrav}`;
const netoIVA = netoGrav * 0.21;
document.querySelector(".IVA").innerHTML = `IVA: ${netoIVA}`;
const totNeto = netoGrav + netoIVA;
document.querySelector(".TOTAL").innerHTML = `TOTAL: ${netoGrav + netoIVA}`;
const netoGrav_nCredit = result.totalNeto / 1.21;
document.querySelector(".NETO-GRAV-ndc").innerHTML = `NETO GRAV: ${netoGrav_nCredit}`;
const ivaNotaCred = netoGrav_nCredit * 0.21;
document.querySelector(".IVA-ndc").innerHTML = `IVA: ${ivaNotaCred}`;
document.querySelector(".TOTAL-ndc").innerHTML = `TOTAL: ${result.totalNeto}`;
document.querySelector(".NETO-GRAV-tr").innerHTML = `NETO GRAV: ${netoGrav - netoGrav_nCredit}`;
document.querySelector(".IVA-tr").innerHTML = `IVA: ${netoIVA - ivaNotaCred}`;
document.querySelector(".TOTAL-tr").innerHTML = `TOTAL: ${totNeto - result.totalNeto }`;
})

function sumaFormula(obj){    
    
        var sum = 0;
        for( var e in obj ) {
          if( obj.hasOwnProperty( e ) ) {
            sum += parseFloat( obj[e] );
          }
          console.log(sum + " "+ obj[e])
        }
        return sum;
}

//---------------------------------------------DATOS MENSUALES----------------------------------------------------------------------------

    


function draw_form(){
  if(formData != null){
    document.querySelector(".alquilerResult").value = formData.ALQUILER;
    document.querySelector(".moviestarResult").value = formData.Movistar;
    document.querySelector(".posnetResult").value = formData.POSNET;
    document.querySelector(".programadorResult").value = formData.PROGRAMADOR;
    document.querySelector(".telecomResult").value = formData.Telecom;
    document.querySelector(".ablResult").value = formData.abl_planes;
    document.querySelector(".contadorResult").value = formData.contador;
    document.querySelector(".ganaciasResult").value = formData.ganancias;
    document.querySelector(".gastosBancariosResult").value = formData.gastos_bancarios;
    document.querySelector(".jubilacionJavierResult").value = formData.jubilacion_javier;
    document.querySelector(".segurosResult").value = formData.seguros;
    document.querySelector(".sueldosResult").value = formData.sueldos_2;
    document.querySelector(".sueldosCargasResult").value = formData.SUELDOS_CARGAS;
  }
}
document.addEventListener("DOMContentLoaded", () => {
    formData = null;

socket.emit("get-form", async data => {
    formData = await data[0];
    draw_form();
})
socket.on("form", data => {
    console.log(data)
    if(data.ALQUILER == null){
        delete(data[0].__v);
        delete(data[0]._id);
    }
    formData = data[0];
    draw_form();
})
})
