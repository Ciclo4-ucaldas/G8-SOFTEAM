/* Se ejecuta cuando se carga la pagina, este archivo pertenece a la vista del administrador */
$(document).ready(() => {
    /* Se encarga de agregar mesas */
    $(document).on('click', '#btnRegistrar', () => {
        let b = $("#txtNombre").val();
        if (b=="") {
            return alertify.error("El campo no debe estar vacio")
        }
        $.ajax({
            url: "../../controlador/mesa.create.php",
            type: "POST",
            datatype: "JSON",
            data: $("#mesaFrm").serialize()
        }).done(json => {
            alertify.success(json);
            $("#txtNombre").val("");
            buscar();
        }).fail((xhr, status, error) => {
            console.log(error);
        })
    });
    /* Se encarga de actualizar la mesa */
    $(document).on("click", "#updateModal", () => {
        let b = $("#txtNombreModal").val();
        if (b=="") {
            return alertify.error("El campo no debe estar vacio")
        }
        $.ajax({
            url: "../../controlador/mesa.update.php",
            type: "POST",
            datatype: "JSON",
            data: $("#mesaFrm").serialize()
        }).done(json => {
            alertify.success(json);
            buscar();
            cerrarModal();
        }).fail((xhr, status, error) => {
            console.log(error);
        })
    });
    /* Se encarga de eliminar la mesa */
    $(document).on("click", "#deleteModal", () => {
        $.ajax({
            url: "../../controlador/mesa.delete.php",
            type: "POST",
            datatype: "JSON",
            data: $("#mesaFrm").serialize()
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
/* Le damos el tamaño de la previsualizacion de la coversion de texto a codigo qr */
let qrcode = new QRCode(document.getElementById('qrResult'), {
    width: 300,
    height: 300
});
/* Si el campo esta vacio retorna una alerta de lo contrario muestra el codigo qr */
function generate() {
    let message = document.getElementById('qr');
    if (!message.value) {
        alertify.error("Ingrese un texto");
        message.focus();
        return;
    }
    qrcode.makeCode(message.value);
}
function buscar() {
    $.ajax({
        url: "../../controlador/mesa.read.php",
        type: "POST",
        datatype: "JSON",
        data: null
    }).done((json) => {
        try {
            /* Se envia el objeto a la funcion */
            crearMatriz(JSON.parse(json));
            /* datatable aun no esta en uso */
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
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}
/* Cierra el modal cuando intento actualizar o eliminar la mesa */
function cerrarModal() {
    $('#modal').modal('hide');
}
/* Se crea la tabla y se muestra en html */
function crearMatriz(x) {
    let datos = "<table id='myTable' class='table table-dark table-bordered table-hover text-center' border=3><thead><tr><th>Nombre</th><th>Modificar</th><th>Eliminar</th></tr></thead>";
    datos += "<tbody>";
    let i = 1;
    $.each(x, (key, value) => {
        datos += `<tr class='bgTable'><td id="nameCode${i}" class="nameCode" onclick="copiarAlPortapapeles(this.id);">${value.nombre}</td>`;
        datos += `<td><a class="btn btn-info" onclick="modal('update');accion(${value.id_mesa},${value.id_auditoria},'${value.nombre}');" data-bs-toggle="modal" data-bs-target="#modal"><i class="far fa-edit"></i></a></td>`
        datos += `<td><a class="btn btn-danger" onclick="modal('delete');accion(${value.id_auditoria});" data-bs-toggle="modal" data-bs-target="#modal"><i class="far fa-trash-alt"></i></a></td></tr>`;
        i++;
    });
    datos += `</tbody></table>`;
    $("#respuesta").html(datos);
}
/* Se muestra el modal dependiendo de su condicion */
function modal(x) {
    let j = "";
    if (x == "update") {
        $("#exampleModalLabel").html("Modificar Usuario");
        j = '<table class="table"><tbody>';
        j += '<tr hidden><td>Id:</td><td><center><input readonly class="w-100" type="number" id="txtIdMesaModal" name="txtIdMesaModal"></center></td></tr>';
        j += '<tr hidden><td>Id:</td><td><center><input readonly class="w-100" type="number" id="txtIdAuditoriaModal" name="txtIdAuditoriaModal"></center></td></tr>';
        j += '<tr><td>Nombre:</td><td><center><input class="w-100 form-control" type="text" id="txtNombreModal" name="txtNombreModal"></center></td></tr></tbody></table>';
        $(".modal-body").html(j);
        $(".modalConfirmacion").html("Modificar");
        $(".modalConfirmacion").prop("id", "updateModal");
    } else {
        $("#exampleModalLabel").html("Desea continuar?");
        j = '<table class="table"><tbody>';
        j += '<tr hidden><td>Id:</td><td><center><input hidden class="w-100" type="number" id="txtIdMesaModal" name="txtIdMesaModal"></center></td></tr></tbody></table>'
        $(".modal-body").html(j);
        $(".modalConfirmacion").html("Eliminar");
        $(".modalConfirmacion").prop("id", "deleteModal");
    }
}
/* Se cargan los valores al modal */
function accion(a, b = "", c = "") {
    $("#txtIdMesaModal").val(a)
    $("#txtNombreModal").val(c)
    $("#txtIdAuditoriaModal").val(b)
}
/* Esta funcion se encarga de obtener el dato sobre el que se presiono clic */
function copiarAlPortapapeles(idElemento) {
    $("#qr").val($(`#${idElemento}`).html());
}