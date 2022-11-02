/* Se ejecuta cuando se carga la pagina, este archivo pertenece a la vista del administrador */
$(document).ready(() => {
    /* Registra plantillas */
    $(document).on('click', '#btnRegistrar', () => {
        let b = $("#txtNombre").val();
        if (b=="") {
            return alertify.error("El campo no debe estar vacio");
        }
        $.ajax({
            url: "../../controlador/plantilla.create.php",
            type: "POST",
            datatype: "JSON",
            data: $("#plantillasFrm").serialize()
        }).done(json => {
            alertify.success(json);
            $("#txtNombre").val("");
            buscar();
        }).fail((xhr, status, error) => {
            console.log(error);
        })
    });
    /* Actualiza la plantilla */
    $(document).on("click", "#updateModal", () => {
        let b = $("#txtNombreModal").val();
        if (b=="") {
            return alertify.error("El campo no debe estar vacio");
        }
        $.ajax({
            url: "../../controlador/plantilla.update.php",
            type: "POST",
            datatype: "JSON",
            data: $("#plantillasFrm").serialize()
        }).done(json => {
            alertify.success(json)
            buscar();
            cerrarModal();
        }).fail((xhr, status, error) => {
            console.log(error);
        })
    });
    /* Elimina la plantilla */
    $(document).on("click", "#deleteModal", () => {
        $.ajax({
            url: "../../controlador/plantilla.delete.php",
            type: "POST",
            datatype: "JSON",
            data: $("#plantillasFrm").serialize()
        }).done(json => {
            alertify.error(json)
            buscar();
            cerrarModal();
        }).fail((xhr, status, error) => {
            console.log(error);
        })
    });
    buscar();
});
function buscar() {
    $.ajax({
        url:"../../controlador/plantilla.read.php",
        type:"POST",
        datatype:"JSON",
        data:null
    }).done((json)=>{
        try {
            crearMatriz(JSON.parse(json));
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
/* Cerrar Modal */
function cerrarModal() {
    $('#modal').modal('hide');
}
/* Crea la tabla y lo muestra en html */
function crearMatriz(x) {
    let datos = "<table id='myTable' class='table table-dark table-bordered table-hover text-center' border=3><thead><tr><th>Nombre</th><th>Modificar</th><th>Eliminar</th></tr></thead>";
    datos += "<tbody>";
    $.each(x,(key,value)=>{
        datos +=`<tr><td class="nameCode" onclick="plantilla('${value.nombre}',${value.id_plantilla});">${value.nombre}</td>`;
        datos += `<td><a class="btn btn-info" onclick="modal('update');accion(${value.id_plantilla},${value.id_auditoria},'${value.nombre}');" data-bs-toggle="modal" data-bs-target="#modal"><i class="far fa-edit"></i></a></td>`
        datos += `<td><a class="btn btn-danger" onclick="modal('delete');accion(${value.id_auditoria});" data-bs-toggle="modal" data-bs-target="#modal"><i class="far fa-trash-alt"></i></a></td></tr>`
    });
    datos += `</tbody></table>`;
    $("#respuesta").html(datos);
}
/* Muestra el modal dependiendo de la condicion */
function modal(x){
    let j = "";
    if (x=="update"){
        $("#exampleModalLabel").html("Modificar Usuario");
        j = '<table class="table"><tbody>';
        j+= '<tr hidden><td>Id:</td><td><center><input readonly class="w-100" type="number" id="txtIdPlantillaModal" name="txtIdPlantillaModal"></center></td></tr>';
        j+= '<tr hidden><td>Id:</td><td><center><input readonly class="w-100" type="number" id="txtIdAuditoriaModal" name="txtIdAuditoriaModal"></center></td></tr>';
        j+='<tr><td>Nombre:</td><td><center><input class="w-100 form-control" type="text" id="txtNombreModal" name="txtNombreModal"></center></td></tr></tbody></table>';
        $(".modal-body").html(j);
        $(".modalConfirmacion").html("Modificar");
        $(".modalConfirmacion").prop("id","updateModal");
    }else{
        $("#exampleModalLabel").html("Desea continuar?");
        j = '<table class="table"><tbody>';
        j+= '<tr hidden><td>Id:</td><td><center><input hidden class="w-100" type="number" id="txtIdPlantillaModal" name="txtIdPlantillaModal"></center></td></tr></tbody></table>'
        $(".modal-body").html(j);
        $(".modalConfirmacion").html("Eliminar");
        $(".modalConfirmacion").prop("id","deleteModal");
    }
}
/* Llena datos en el modal */
function accion(a,b="",c="") {
    $("#txtIdPlantillaModal").val(a)
    $("#txtNombreModal").val(c)
    $("#txtIdAuditoriaModal").val(b)
}
/* Guarda los datos de la plantilla antes de ser redireccionado a 'plantilla.frm.php' */
function plantilla(x,y) {
    localStorage.setItem('plantilla', JSON.stringify([x,y]));
    window.location.href="plantilla.frm.php";
}