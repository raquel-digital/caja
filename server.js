const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('dotenv').config();
const PORT = process.env.PORT || 1000;

//coneccion mongo
const db = require("./db");
db(process.env.mongoDB);

const controller = require("./api/controller/controller")

app.use(express.static('./public'));

io.on('connect', socket => {
    socket.on("start", async () => {        
        const res = await controller.start();        
        socket.emit("refresh", res)        
    })

    socket.on("ingreso-caja", async (data) => {        
       const res = await controller.ingreso(data);
       io.emit("refresh", res);
    })
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