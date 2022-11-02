/* Se ejecuta cuando se carga la pagina, este archivo pertenece a la vista del administrador */
$(document).ready(() => {
    /* Es un evento se encarga de crear categorias */
    $(document).on('click', '#btnRegistrar', () => {
        let b = $("#txtNombre").val();
        if (b=="") {
            return alertify.error("El campo no debe estar vacio")
        }
        $.ajax({
            url: "../../controlador/categoria.create.php",
            type: "POST",
            datatype: "JSON",
            data: $("#categoriaFrm").serialize()
        }).done(json => {
            alertify.success(json)
            $("#txtNombre").val("");
            buscar();
        }).fail((xhr, status, error) => {
            console.log(error);
        })
    });
    /* Es un evento se encarga de actualizar la categoria */
    $(document).on("click", "#updateModal", () => {
        let b = $("#txtNombreModal").val();
        if (b=="") {
            return alertify.error("El campo no debe estar vacio")
        }
        $.ajax({
            url: "../../controlador/categoria.update.php",
            type: "POST",
            datatype: "JSON",
            data: $("#categoriaFrm").serialize()
        }).done(json => {
            alertify.success(json)
            buscar();
            cerrarModal();
        }).fail((xhr, status, error) => {
            console.log(error);
        })
    });
    /* Es un evento se encarga de eliminar la categoria */
    $(document).on("click", "#deleteModal", () => {
        $.ajax({
            url: "../../controlador/categoria.delete.php",
            type: "POST",
            datatype: "JSON",
            data: $("#categoriaFrm").serialize()
        }).done(json => {
            alertify.error(json)
            buscar();
            cerrarModal();
        }).fail((xhr, status, error) => {
            console.log(error);
        })
    });
    /* Se encarga de leer las categorias */
    buscar();
});
function buscar() {
    $.ajax({
        url:"../../controlador/categoria.read.php",
        type:"POST",
        datatype:"JSON",
        data:null
    }).done((json)=>{
        try {
            /* Se envia el objeto de categorias parseado */
            crearMatriz(JSON.parse(json));
            /* Se utiliza data table para filtrar datos, aun no esta en uso */
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
                            columns:[0]
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fas fa-file-excel"></i>',
                        autoFilter: true,
                        titleAttr:"Excel",
                        title: 'Reporte de empleados',
                        exportOptions: {
                            columns:[0]
                        }
                    },
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fas fa-copy"></i>',
                        titleAttr:"Copiar",
                        title: 'Reporte de empleados',
                        exportOptions: {
                            columns:[0]
                        }
                    },
                    {
                        extend: 'print',
                        text: '<i class="fas fa-print"></i>',
                        titleAttr:"Imprimir",
                        title: 'Reporte de empleados',
                        exportOptions: {
                            columns:[0]
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
/* Se utiliza para cerrar el modal cuando se intenta acutaliza o eliminar una categoria */
function cerrarModal() {
    $('#modal').modal('hide');
}
/* Recorre el objeto de las categorias y se muesta en html */
function crearMatriz(x) {
    let datos = "<table id='myTable' class='table table-dark table-bordered table-hover text-center' border=3><thead><tr><th>Nombre</th><th>Modificar</th><th>Eliminar</th></tr></thead>";
    datos += "<tbody>";
    $.each(x,(key,value)=>{
        datos +=`<tr class='bgTable'><td>${value.nombre}</td>`;
        datos += `<td><a class="btn btn-info" onclick="modal('update');accion(${value.id_categoria},${value.id_auditoria},'${value.nombre}');" data-bs-toggle="modal" data-bs-target="#modal"><i class="far fa-edit"></i></a></td>`
        datos += `<td><a class="btn btn-danger" onclick="modal('delete');accion(${value.id_auditoria});" data-bs-toggle="modal" data-bs-target="#modal"><i class="far fa-trash-alt"></i></a></td></tr>`
    });
    datos += `</tbody></table>`;
    $("#respuesta").html(datos);
}
/* Dependiendo del condicional se muestra su respectivo modal */
function modal(x){
    let j = "";
    if (x=="update"){
        $("#exampleModalLabel").html("Modificar Usuario");
        j = '<table class="table"><tbody>';
        j+= '<tr hidden><td>Id:</td><td><center><input readonly class="w-100" type="number" id="txtIdCategoriaModal" name="txtIdCategoriaModal"></center></td></tr>';
        j+= '<tr hidden><td>Id:</td><td><center><input readonly class="w-100" type="number" id="txtIdAuditoriaModal" name="txtIdAuditoriaModal"></center></td></tr>';
        j+='<tr><td>Nombre:</td><td><center><input class="w-100 form-control" type="text" id="txtNombreModal" name="txtNombreModal"></center></td></tr></tbody></table>';
        $(".modal-body").html(j);
        $(".modalConfirmacion").html("Modificar");
        $(".modalConfirmacion").prop("id","updateModal");
    }else{
        $("#exampleModalLabel").html("Desea continuar?");
        j = '<table class="table"><tbody>';
        j+= '<tr hidden><td>Id:</td><td><center><input hidden class="w-100" type="number" id="txtIdCategoriaModal" name="txtIdCategoriaModal"></center></td></tr></tbody></table>'
        $(".modal-body").html(j);
        $(".modalConfirmacion").html("Eliminar");
        $(".modalConfirmacion").prop("id","deleteModal");
    }
}
/* Se cargan los valores al modal */
function accion(a,b="",c="") {
    $("#txtIdCategoriaModal").val(a)
    $("#txtNombreModal").val(c)
    $("#txtIdAuditoriaModal").val(b)
}