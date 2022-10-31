/* Se ejecuta cuando se carga la pagina, este archivo pertenece a la vista del cliente */
$(document).ready(() => {
    /* Es el selector de camaras */
    $("#selectCamera").on('change', () => {
        decoder.stop().play();
    });
    $(document).on('click', '#iniciarSesionTxt', () => {
        window.location.href="../admin/login.frm.php";
    });
});

let txt = "innerText" in HTMLElement.prototype ? "innerText" : "textContent";
let arg = {
    resultFunction: function (result) {
        /* Este valor se guarda en un input hidden */
        $("#qrCode").val(result.code);
        buscar();
    }
};
/* Se inicia la camara apenas carga el documento */
let decoder = new WebCodeCamJS("canvas").buildSelectMenu('select', 'environment|back').init(arg).play();
/* Esta funcion es la encargada de leer el codigo qr que se detecto en la camara y se valida si existe en base de datos, si existe guarda en localStorage la mesa y se redirecciona a 'plantilla.frm.php' */
function buscar() {
    $.ajax({
        url:"../../controlador/mesaQR.read.php",
        type:"POST",
        datatype:"JSON",
        data: $("#mesaFrm").serialize()
    }).done((json)=>{
        json=JSON.parse(json);
        if (json.length>0) {
            localStorage.setItem("mesa",json[0].id_mesa)
            window.location.href="plantilla.frm.php";
        }
    }).fail((xhr,status,error)=>{
        console.log(error);
    })
}