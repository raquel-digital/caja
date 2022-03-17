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
var allData;
var dataHoy;
var formCaja;
var emitirCaja = false

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
readBase()

//WebSocket recibimos data del cliente
io.on('connect', socket => {
    //inicia pagina enviamos la fecha
    if(allData){
        socket.emit("allData", allData);
    }else{
        (async () => {
            try{
             allData = await mongoCrud.read();
             if(allData == null)
             await mongoCrud.create({fecha: fecha.fecha});
             return allData = await mongoCrud.read();
            }catch(err){
                console.log("no se pudo crear BASE"+err)
            }
         })()
    }
    socket.on("nuevo-dato", async dato => {
        await mongoCrud.create(dato);
        allData = await mongoCrud.read();
        socket.emit("allData", allData);
    });
    socket.on("dato-anterior", async dato => {
        console.log(dato, allData[0].fecha)
        await mongoCrud.create(dato, allData[0].fecha);
        
        allData =  await mongoCrud.cajaAnterior(allData[0].fecha);
        socket.emit("allData", allData);
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
    res.sendFile('client/indexx.html', {root: __dirname })
})
app.get("/login", (req, res) => {
    res.sendFile('client/login.html', {root: __dirname })
})
app.get("/controlMesual", loginMiddleware.logged, (req, res) => {
    res.sendFile('client/control.html', {root: __dirname })
})
app.get("/control-mes-deposito", loginMiddleware.logged, (req, res) => {
    res.sendFile('client/depositos-mensuales.html', {root: __dirname })
})
app.post("/caja-anterior/", loginMiddleware.logged, async (req, res) => {    
     const fecha = `${req.body.dia}-${req.body.mes}-${req.body.anio}`;
     if(fecha == allData[0].fecha){
         res.send(`<h1>ERROR: FECHA EN CURSO VOLVER A LA PAGINA PRINCIPAL<h1/>`)
     }else{
        allData = await mongoCrud.cajaAnterior(fecha);
        res.redirect("/");
     }
})
app.get("/cargar-base", loginMiddleware.logged, async (req, res) => {
    await require('./coneccion-mongo/mongoCompas');
    await readBase();
    res.redirect("/");
})

app.post("/formSubmit", loginMiddleware.logged, async (req, res) => {
    formCaja = req.body;
    await mongoCrud.constrolMensual(formCaja);
    emitirCaja = true;
    res.redirect("/controlMesual");
})
app.post('/singup', loginMiddleware.isLogin);

app.post("/registro-dato", loginMiddleware.logged, async (req, res) => {
    const dato = req.body;
    await mongoCrud.create(dato);
    allData = await mongoCrud.read();
    res.redirect("/");
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
