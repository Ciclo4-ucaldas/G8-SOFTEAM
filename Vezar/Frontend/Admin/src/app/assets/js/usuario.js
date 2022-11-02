/* Se ejecuta cuando se carga la pagina, este archivo pertenece a la vista del administrador */
$(document).ready(() => {
    /* Se agrega el usuario a base de datos */
    $(document).on('click', '#btnRegistrar', () => {
        let x = validarCampos("#txtIdentificacion","#txtNombre","#txtApellido","#txtRol","#txtUser","#txtPassword");
        if (x==false) {
            return
        }
        $.ajax({
            url: "../../controlador/usuario.create.php",
            type: "POST",
            datatype: "JSON",
            data: $("#usuarioFrm").serialize()
        }).done(json => {
            alertify.success(json);
            limpiarCampos()
            buscar();
        }).fail((xhr, status, error) => {
            console.log(error);
        })
    });
    /* Se actualiza el usuario en base de datos */
    $(document).on("click", "#updateModal", () => {
        let x = validarCampos("#txtIdentificacionModal","#txtNombreModal","#txtApellidoModal","#txtRolModal","#txtUserModal","#txtPasswordModal");
        if (x==false) {
            return
        }
        $.ajax({
            url: "../../controlador/usuario.update.php",
            type: "POST",
            datatype: "JSON",
            data: $("#usuarioFrm").serialize()
        }).done(json => {
            alertify.success(json)
            buscar();
            cerrarModal();
        }).fail((xhr, status, error) => {
            console.log(error);
        })
    });
    /* Se elimina el usuario en base de datos */
    $(document).on("click", "#deleteModal", () => {
        $.ajax({
            url: "../../controlador/usuario.delete.php",
            type: "POST",
            datatype: "JSON",
            data: $("#usuarioFrm").serialize()
        }).done(json => {
            alertify.error(json)
            buscar();
            cerrarModal();
        }).fail((xhr, status, error) => {
            console.log(error);
        })
    });
    buscar();
    cargarRoles();
});
let roles="";
function validarCampos(identificacion,nombre,apellido,rol,user,password) {
    let a = $(`${identificacion}`).val();
    let b = $(`${nombre}`).val();
    let c = $(`${apellido}`).val();
    let d = $(`${rol}`).val();
    let e = $(`${user}`).val();
    let f = $(`${password}`).val();
    if (a=="") {
        alertify.error("Se debe ingresar una identificacion");
        return false
    } else if (c=="") {
        alertify.error("Se debe ingresar un apellido");
        return false
    } else if (d==null) {
        alertify.error("Se debe seleccionar un rol");
        return false
    } else if (b=="") {
        alertify.error("Se debe ingresar un nombre");
        return false
    } else if (e=="") {
        alertify.error("Se debe ingresar un usuario");
        return false
    } else if (f=="") {
        alertify.error("Se debe ingresar una contraseña");
        return false
    }
}
function limpiarCampos() { 
    $("#txtIdentificacion").val("");
    $("#txtNombre").val("");
    $("#txtApellido").val("");
    $("#txtRol option[value='0']").prop("selected", true);
    $("#txtUser").val("");
    $("#txtPassword").val("");
}
function buscar() {
    $.ajax({
        url:"../../controlador/usuario.read.php",
        type:"POST",
        datatype:"JSON",
        data:null
    }).done((json)=>{
        try {
            /* Se envia el objeto a esta funcion */
            crearMatriz(JSON.parse(json));
            /* datatable no esta en uso */
            $('#myTable').DataTable({
                "language": {
                    "url": "../../componente/libreria/js/Spanish.json",
                    "buttons":{
                        copyTitle: "Registro(s) Copiado(s)",
                        copySuccess:{
                            _:'%d Registros Copiados',
                            1:'%d Registros Copiado'
                        }
                    }
                },
                dom: 'Bfrtip',
                buttons: [ 
                    {
                        extend: 'pdfHtml5',
                        text: '<i class="fas fa-file-pdf"></i>',
                        download: 'open',
                        titleAttr:"PDF",
                        title: 'Reporte de empleados',
                        exportOptions: {
                            columns:[0,1,2,3]
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fas fa-file-excel"></i>',
                        autoFilter: true,
                        titleAttr:"Excel",
                        title: 'Reporte de empleados',
                        exportOptions: {
                            columns:[0,1,2,3]
                        }
                    },
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fas fa-copy"></i>',
                        titleAttr:"Copiar",
                        title: 'Reporte de empleados',
                        exportOptions: {
                            columns:[0,1,2,3]
                        }
                    },
                    {
                        extend: 'print',
                        text: '<i class="fas fa-print"></i>',
                        titleAttr:"Imprimir",
                        title: 'Reporte de empleados',
                        exportOptions: {
                            columns:[0,1,2,3]
                        }
                    }
            ]
            });
        } catch (e) {
            console.log(e)
        }
    }).fail((xhr,status,error)=>{
        console.log(error);
    })
}
/* Ocultar modal */
function cerrarModal() {
    $('#modal').modal('hide');
}
/* crea la tabla y la muesta en html */
function crearMatriz(x) {
    let datos = "<table id='myTable' class='table table-dark table-bordered table-hover text-center' border=3><thead><tr><th>Identificacion</th><th>Nombre</th><th>Apellido</th><th>Rol</th><th>Usuario</th><th>Modificar</th><th>Eliminar</th></tr></thead>";
    datos += "<tbody>";
    $.each(x,(key,value)=>{
        datos +=`<tr class='bgTable'><td>${value.identificacion}</td>`;
        datos +=`<td>${value.nombre}</td>`;
        datos +=`<td>${value.apellido}</td>`;
        datos +=`<td>${value.nombreRol}</td>`;
        datos +=`<td>${value.user}</td>`;
        datos += `<td><a class="btn btn-info" onclick="modal('update');accion(${value.id_usuario},${value.id_rol},'${value.identificacion}','${value.nombre}','${value.apellido}','${value.user}','${value.pass}',${value.id_auditoria});" data-bs-toggle="modal" data-bs-target="#modal"><i class="far fa-edit"></i></a></td>`
        datos += `<td><a class="btn btn-danger" onclick="modal('delete');accion(${value.id_auditoria});" data-bs-toggle="modal" data-bs-target="#modal"><i class="far fa-trash-alt"></i></a></td></tr>`
    });
    datos += `</tbody></table>`;
    $("#respuesta").html(datos);
}
/* muestra el modal dependiendo de su condicion */
function modal(x){
    let j = "";
    if (x=="update"){
        $("#exampleModalLabel").html("Modificar Usuario");
        j = '<table class="table"><tbody>';
        j+= '<tr hidden><td>Id:</td><td><center><input readonly class="w-100" type="number" id="txtIdUsuarioModal" name="txtIdUsuarioModal"></center></td></tr>'
        j+= '<tr hidden><td>Id:</td><td><center><input readonly class="w-100" type="number" id="txtIdAuditoriaModal" name="txtIdAuditoriaModal"></center></td></tr>'
        j+='<tr><td>Identificacion:</td><td><center><input readonly class="w-100 form-control" type="number" id="txtIdentificacionModal" name="txtIdentificacionModal"></center></td></tr>'
        j+='<tr><td>Nombre:</td><td><center><input class="w-100 form-control" type="text" id="txtNombreModal" name="txtNombreModal"></center></td></tr>'
        j+='<tr><td>Apellido:</td><td><center><input class="w-100 form-control" type="text" id="txtApellidoModal" name="txtApellidoModal"></center></td></tr>'
        j+=`<tr><td>Rol:</td><td><center><select class="form-control" id="txtRolModal" name="txtRolModal"></select></center></td></tr>`
        j+='<tr><td>Usuario:</td><td><center><input class="w-100 form-control" type="text" id="txtUsuarioModal" name="txtUsuarioModal"></center></td></tr>'
        j += '<tr><td>Contraseña:</td><td><center><input class="w-100 form-control" type="text" id="txtPasswordModal" name="txtPasswordModal"></center></td></tr></tbody></table>'
        $(".modal-body").html(j);
        $(".modalConfirmacion").html("Modificar");
        $(".modalConfirmacion").prop("id","updateModal");
    }else{
        $("#exampleModalLabel").html("Desea continuar?");
        j = '<table class="table"><tbody>';
        j+= '<tr hidden><td>Id:</td><td><center><input hidden class="w-100" type="number" id="txtIdUsuarioModal" name="txtIdUsuarioModal"></center></td></tr></tbody></table>'
        $(".modal-body").html(j);
        $(".modalConfirmacion").html("Eliminar");
        $(".modalConfirmacion").prop("id","deleteModal");
    }
}
/* Carga los valores al modal */
function accion(a,b="",c="",d="",e="",f="",g="",h="") {
    $("#txtIdUsuarioModal").val(a)
    $("#txtIdentificacionModal").val(c)
    $("#txtNombreModal").val(d)
    $("#txtApellidoModal").val(e)
    $("#txtRolModal").append(roles)
    if (b!="") {
        document.getElementById("txtRolModal").value = b;   
    }
    $("#txtUsuarioModal").val(f)
    $("#txtPasswordModal").val(g)
    $("#txtIdAuditoriaModal").val(h)
}
/* Se encarga de mostrar los roles que existen base de datos en el formulario */
function cargarRoles() {
    $.ajax({
        url: "../../controlador/rol.read.php",
        type: "POST",
        datatype: "JSON",
        data: null
    }).done(json => {
        json = JSON.parse(json);
        let html;
        for (const iterator of json) {
            html += `<option value="${iterator.id_rol}">${iterator.nombre}</option>`
        }
        roles=html;
        let f = $("#txtRol").append(html);
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}