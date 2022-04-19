const express = require('express');
const { mongo } = require('mongoose');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//UTILS
let fecha = require("./utils/fecha");
//conectamos mongoDB
require('./coneccion-mongo/mongoCompas');
//CRUD
const mongoCrud = require("./api/mongo");
const { async } = require('rxjs');
const buscarModel = require("./utils/buscarModel");
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 1000;
//carpeta estaticos
app.use(express.static('./client'));
//middleware
const loginMiddleware = require("./utils/midleware");
const { connectableObservableDescriptor } = require('rxjs/internal/observable/ConnectableObservable');
var login = false;//habilitar usuarios
//Recuperamos los datos de MONGO

var formCaja;
var emitirCaja = false;
var login = false;
var fecha_ant = undefined; 


//WebSocket recibimos data del cliente
 io.on('connect', socket => {
    socket.emit("test", "ok")
    if(login){
        socket.emit("loginOK", login);
        login=false;
    }
    if(fecha_ant != undefined){
        console.log("ACTIVADO?")
        console.log("fecha anterior: " + fecha_ant);
        socket.emit("fecha_ant", fecha_ant)
        socket.on("base-data-vieja-inicial", async () => { 
            try{
                let responce = await mongoCrud.cajaAnterior(fecha_ant);
                    if(responce == null || responce.length == 0){                        
                        await mongoCrud.create({fecha: fecha_ant});
                        responce = await mongoCrud.cajaAnterior(fecha_ant);                        
                    }
                   
                socket.emit("dataVieja", responce);
                fecha_ant = undefined;
            }catch(err){
                console.log("ERROR EN LECTURA INICIAL " + err)
            }
        })    
    }
   
    socket.emit("fecha-hoy", fecha.fecha);
    socket.on("base-data-inicial", async () => { 
        try{
            let responce = await mongoCrud.read();
               if(responce == null)
                    await mongoCrud.create({fecha: fecha.fecha});                   
            responce = await mongoCrud.read();
            socket.emit("allData", responce);
        }catch(err){
            console.log("ERROR EN LECTURA INICIAL " + err)
        }
    })   
            
    socket.on("nuevo-dato", async dato => {
        console.log(dato)
        await mongoCrud.create(dato);
        const reWrite = await mongoCrud.read();
        socket.emit("allData", reWrite);
    });
     let fechaAnt;
    // socket.on("dato-anterior", dato => {
    //     console.log("EN SERVER")
    //     console.log(dato)
    //     socket.emit("fecha-anterior");
    //     socket.on("res-fecha-anterior", async fechaCli => {
    //         fechaAnt = fechaCli;
    //         await mongoCrud.create(dato, fechaAnt);
    //         const reWrite =  await mongoCrud.cajaAnterior(fechaAnt);
    //         socket.emit("dataVieja", reWrite);
    //         //fechaAnt = undefined;
    //     })
    // });
    socket.on("dato-anterior", async data => {
        await mongoCrud.create(data.data, data.fecha);
        const reWrite =  await mongoCrud.cajaAnterior(data.fecha);
        socket.emit("dataVieja", reWrite);
    })
    socket.on("cierre-caja", async () =>{
        return mongoCrud.ingresarTotal() ;
    })
    socket.on("getMonth", async data => {
      const result = await buscarModel.buscarColeccion(data);
      socket.emit("getMonthResult", result);
    })
    socket.on("get-form", async () => {
        formCaja = await mongoCrud.leerForm();
        if(formCaja.length > 0)
        socket.emit("form", formCaja);
    })
    if(emitirCaja){
        socket.emit("form", formCaja);
        emitirCaja =  false;
    }
    
    socket.on("salir", () => {
        loginMiddleware.salir();
    })
})
function checkLog(){
io.on('connect', socket => {
    socket.emit("login-check", () => {
        socket.on("login-status", status => {
            const state = status;
            console.log("sattus: " +state)
            return state;
        });
    })
    })
}

app.get("/", loginMiddleware.logged, async (req, res) => {
    await require('./coneccion-mongo/mongoCompas');
    await readBase();
    return res.sendFile('client/indexx.html', {root: __dirname })
})
app.post('/singup', loginMiddleware.isLogin, (req, res) => {
   login = true; 
   module.exports = login;
   res.redirect('/')
});

app.get("/login", (req, res) => {
    return res.sendFile('client/login.html', {root: __dirname })
})
app.get("/controlMesual", loginMiddleware.logged, (req, res) => {
    return  res.sendFile('client/control.html', {root: __dirname })
})
app.get("/control-mes-deposito", loginMiddleware.logged, (req, res) => {
    return  res.sendFile('client/depositos-mensuales.html', {root: __dirname })
})
app.post("/caja-anterior/", loginMiddleware.logged, async (req, res) => {
    fecha_ant = `${req.body.dia}-${req.body.mes}-${req.body.anio}`;
    if(fecha_ant === fecha.fecha){
        return res.send(`<h1>ERROR: FECHA EN CURSO VOLVER A LA PAGINA PRINCIPAL<h1/>`)
    }else{
       
        return res.redirect("/index-ant");
    }
})
app.get("/index-ant", loginMiddleware.logged, async (req, res) => {
    return  res.sendFile("client/index-ant.html", {root: __dirname });
})
app.get("/cargar-base", loginMiddleware.logged, async (req, res) => {
    res.redirect("/")
})

app.post("/formSubmit", loginMiddleware.logged, async (req, res) => {
    
    formCaja = req.body;
    await mongoCrud.constrolMensual(formCaja);
    emitirCaja = true;
return res.redirect("/controlMesual");
})


http.listen(PORT, () => {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});
//en caso de memory leaks por el emmiter
process.on('warning', e => console.warn(e.stack));
// en caso de error, avisar
http.on('error', error => {
    console.log('error en el servidor:', error);
});

async function readBase(){
    try{
        let fecha = require("./utils/fecha");        
        allData = await mongoCrud.read();
        if(allData.fecha == null)
        await mongoCrud.create({fecha: fecha.fecha});
        dataHoy = allData;
        return allData = await mongoCrud.read();
       }catch(err){
           console.log("no se pudo crear BASE"+err)
       }
}

module.exports = login;


