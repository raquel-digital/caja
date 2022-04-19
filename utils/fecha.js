var anio = new Date().getFullYear();
var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
let mes = new Date().getMonth();
let mesEnCurso = queMes(mes);
let dia = new Date
let fecha = dia.getDate() +"-"+ mesEnCurso;
function queMes(mes){
    return meses[mes] +"-"+ anio;
}
module.exports = {mesEnCurso, fecha};