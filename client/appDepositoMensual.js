const socket = io.connect();
var allData;

let table =  document.querySelector(".table");
socket.emit("base-data-inicial")
socket.on("allData", data => {
    allData = data;    
    document.querySelector(".fecha").innerHTML = `<h1>FECHA: ${data[0].fecha}</h1>`;
    socket.emit("getMonth" ,data[0].fecha);
})

socket.on("getMonthResult", data => {
    //console.log(data)
    document.querySelector(".load").innerHTML = " ";      
    table.innerHTML = `<table class="table table-hover">
    <thead>
        <tr>
            <th scope="col">CHEQUE
                <tr>
                    <tbody class="tableCheque">
                        <td scope="col">FECHA</th>
                        <td scope="col">CLIENTE</th>
                        <td scope="col">MONTO</th>
                    </tbody>
                </tr>
            </th>
            <th scope="col">ICBC
                <tr>
                    <tbody class="tableICBC">
                        <td scope="col">FECHA</th>
                        <td scope="col">CLIENTE</th>
                        <td scope="col">MONTO</th>
                    </tbody>
                </tr>
            </th>
            <th scope="col">SANTANDER
                <tr>
                    <tbody class="tableSantander">
                        <td scope="col">FECHA</th>
                        <td scope="col">CLIENTE</th>
                        <td scope="col">MONTO</th>
                    </tbody>
                </tr>
            </th>
            <th scope="col">Transferencias Minorista
                <tr>
                    <tbody class="tableMinorista">
                        <td scope="col">MONTO</th>
                    </tbody>
                </tr>
            </th>
        </tr>
    </thead>        
    </table>`
    
        if(allData[0].cheques.length > 0){            
            allData[0].cheques.forEach( e => {
                document.querySelector(".tableCheque").innerHTML += `
                <tr><td>${allData[0].fecha}</td><td>cliente: ${e.cliente} <td> monto: <b>${e.monto}</b></td><tr>
                `;
            })            
        }
        if(allData[0].transferencias_ICBC.length > 0){

            allData[0].transferencias_ICBC.forEach( e => {
                document.querySelector(".tableICBC").innerHTML += `
                <tr><td>${allData[0].fecha}</td><td>cliente: ${e.cliente} <td> monto: <b>${e.monto}</b></td><tr>
                `;
            })            
        }
        if(allData[0].transferencias_Santander != null){
            allData[0].transferencias_Santander.forEach( e => {
                document.querySelector(".tableSantander").innerHTML += `
                <tr><td>${allData[0].fecha}</td><td>cliente: ${e.cliente}</td><td> monto: <b>${e.monto}</b></td><tr>
                `;
            })  
        }
        if(allData[0].transferencias_minorista != null){
            allData[0].transferencias_minorista.forEach( e => {
                document.querySelector(".tableMinorista").innerHTML += `
                <tr><td>${allData[0].fecha}</td><td>transferencia: ${e}</b></td><tr>
                `;
            })  
        }
        
 
        
    data.forEach( el => {
        if(el[0].cheques.length > 0){
            el[0].cheques.forEach( e => {
                document.querySelector(".tableCheque").innerHTML += `
                <tr><td>${el[0].fecha}</td><td>cliente: ${e.cliente} <td> monto: <b>${e.monto}</b></td><tr>
                `;
            })            
        }
        if(el[0].transferencias_ICBC.length > 0){
            el[0].transferencias_ICBC.forEach( e => {
                document.querySelector(".tableICBC").innerHTML += `
                <tr><td>${el[0].fecha}</td><td>cliente: ${e.cliente} <td> monto: <b>${e.monto}</b></td><tr>
                `;
            })            
        }
        if(el[0].transferencias_Santander != null){
            el[0].transferencias_Santander.forEach( e => {
                document.querySelector(".tableSantander").innerHTML += `
                <tr><td>${el[0].fecha}</td><td>cliente: ${e.cliente}</td><td> monto: <b>${e.monto}</b></td><tr>
                `;
            })  
        }
        if(el[0].transferencias_minorista != null){
            el[0].transferencias_minorista.forEach( e => {
                document.querySelector(".tableMinorista").innerHTML += `
                <tr><td>${el[0].fecha}</td><td>transferencia: ${e}</b></td><tr>
                `;
            })  
        }
        
 })
})

