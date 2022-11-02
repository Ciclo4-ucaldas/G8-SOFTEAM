/* Se ejecuta cuando se carga la pagina, este archivo pertenece a la vista del administrador */
$(document).ready(() => {
    /* Es un evento se encarga de crear categorias */
    $(document).on('click', '#inciarSesion', () => {
        let a = $("#username").val();
        let b = $("#password").val();
        let c = $("#selectRol").val();
        if (a==""||b==""||c==null) {
            return alertify.error("Se deben llenar todos los campos")
        }
        $.ajax({
            url: "../../controlador/usuario.validar.php",
            type: "POST",
            datatype: "JSON",
            data: $("#frmLogin").serialize()
        }).done(json => {
            json = JSON.parse(json);
            if (json.length!=0) {
                let x = parseInt($("#selectRol :selected")[0].value);
                $("#nombreUser").val(json[0].nombre);
                $("#apellidoUser").val(json[0].apellido);
                $.ajax({
                    url: "../../controlador/login.create.php",
                    type: "POST",
                    datatype: "JSON",
                    data: $("#frmLogin").serialize()
                }).done(json2 => {
                    alertify.success("Iniciando sesion ...");
                    setTimeout(() => {
                        switch (x) {
                            case 1:
                                window.location.href="dashboard.frm.php";
                                break;
                            case 2:
                                window.location.href="../cocina/pedidos.frm.php";
                                break;
                            case 3:
                                window.location.href="../mesero/pedidos.frm.php";
                                break;
                        }
                    }, 200);
                }).fail((xhr, status, error) => {
                    console.log(error);
                })
            }else{
                return alertify.error("Ingrese bien sus datos")
            }
        }).fail((xhr, status, error) => {
            console.log(error);
        })
    });
    $(document).on('click', '#lectorQR', () => {
        window.location.href="../cliente/leerQR.frm.php";
    });
    
    /* Se encarga de leer los roles */
    buscar();
});
function buscar() {
    $.ajax({
        url: "../../controlador/rol.buscar.php",
        type: "POST",
        datatype: "JSON",
        data: null
    }).done(json => {
        json = JSON.parse(json);
        let option = "";
        for (const iterator of json) {
            option += `<option value="${iterator.id_rol}">${iterator.nombre}</option>`;
        }
        $("#selectRol").append(option);
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}