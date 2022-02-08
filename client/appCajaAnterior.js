const socket = io.connect();
socket.on("allData", data => {
    console.log("ok")
})