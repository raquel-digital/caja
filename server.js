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
const PORT = process.env.PORT || 8080;
//carpeta estaticos
app.use(express.static('./client'));
//middleware
const loginMiddleware = require("./utils/midleware")

//Recuperamos los datos de MONGO

var formCaja;
var emitirCaja = false

var fecha_ant = null; 

// async function readBase(){
//     try{
//         let fecha = require("./utils/fecha");        
//         allData = await mongoCrud.read();
//         if(allData.fecha == null)
//         await mongoCrud.create({fecha: fecha.fecha});
//         dataHoy = allData;
//         return allData = await mongoCrud.read();
//        }catch(err){
//            console.log("no se pudo crear BASE"+err)
//        }
// }
// readBase()

//WebSocket recibimos data del cliente
io.on('connect', socket => {
    //inicia pagina enviamos la fecha
    // if(allData){
    //     socket.emit("allData", allData);
    // }else{
    //     (async () => {
    //         try{
    //         //  allData = await mongoCrud.read();
    //         //  if(allData == null)
    //         //  await mongoCrud.create({fecha: fecha.fecha});
    //         //  return allData = await mongoCrud.read();
    //         allData = await mongoCrud.cajaAnterior(fecha.fecha);
    //         }catch(err){
    //             console.log("no se pudo crear BASE"+err)
    //         }
    //      })()
    //}  
    if(fecha_ant != null){
        console.log(fecha_ant);
        socket.emit("fecha_ant", fecha_ant)
        socket.on("base-data-inicial", async () => { 
            try{
                let responce = await mongoCrud.read();
                console.log(responce)
                    if(responce == null)
                        await mongoCrud.create({fecha: fecha_ant});
                responce = await mongoCrud.read();
                socket.emit("allData", responce);
                fecha_ant = null;
            }catch(err){
                console.log("ERROR EN LECTURA INICIAL " + err)
            }
        })    
    }else{
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
    }   
    socket.on("nuevo-dato", async dato => {
        await mongoCrud.create(dato);
        const reWrite = await mongoCrud.read();
        socket.emit("allData", reWrite);
    });
    socket.on("dato-anterior", async dato => {
        let fecha;
        socket.emit("fecha-anterior");        
        socket.on("res-fecha-anterior", fecha_ant => {
            fecha =  fecha_ant;
            console.log(fecha +" D anterior")
        })
        console.log(fecha)                
        await mongoCrud.create(dato, fecha);        
        const reWrite =  await mongoCrud.cajaAnterior(fecha);
        socket.emit("allData", reWrite);
    });
    socket.on("cierre-caja", async () =>{
        return mongoCrud.ingresarTotal();
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

app.get("/", loginMiddleware.logged, async (req, res) => {
    return res.sendFile('client/indexx.html', {root: __dirname })
})
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
     if(fecha === fecha.fecha){
        return res.send(`<h1>ERROR: FECHA EN CURSO VOLVER A LA PAGINA PRINCIPAL<h1/>`)
     }else{
        //allData = await mongoCrud.cajaAnterior(fecha);
        return res.redirect("/index-ant");
     }
})
app.get("/index-ant", loginMiddleware.logged, async (req, res) => {    
    return  res.sendFile("client/index-ant.html", {root: __dirname });
})
app.get("/cargar-base", loginMiddleware.logged, async (req, res) => {    
    if(fecha === fecha.fecha){
        return res.send(`<h1>ERROR: FECHA EN CURSO VOLVER A LA PAGINA PRINCIPAL<h1/>`)
    }else{       
       fecha_ant = fecha.fecha;
       return res.redirect("/index-ant");
    }
})

app.post("/formSubmit", loginMiddleware.logged, async (req, res) => {
    formCaja = req.body;
    await mongoCrud.constrolMensual(formCaja);
    emitirCaja = true;
   return res.redirect("/controlMesual");
})

app.post('/singup', loginMiddleware.isLogin);

http.listen(PORT, () => {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});
//en caso de memory leaks por el emmiter
process.on('warning', e => console.warn(e.stack));
// en caso de error, avisar
http.on('error', error => {
    console.log('error en el servidor:', error);
});
