/* Se ejecuta cuando se carga la pagina, este archivo pertenece a la vista del administrador */
$(document).ready(() => {
    /* Se agrega el producto a base de datos */
    $(document).on('click', '#btnRegistrar', () => {
        let x = validarCampos('#txtNombre','#txtDescripcion','#txtPrecio','#txtCantidad','#selCategoria','#txtImagen');
        if (x==false) {
            return
        }
        /* Se usa formdata porque estamos enviando una imagen */
        let formulario = new FormData($("#productoFrm")[0]);
        $.ajax({
            url: "../../controlador/producto.create.php",
            type: "POST",
            dataType: "JSON",
            data: formulario,
            processData: false,
            contentType: false
        }).done(json => {
            limpiarCampos();
            alertify.success(json)
            buscar();
        }).fail((xhr, status, error) => {
            console.log(error)
        })
    });
    cargarCategorias();
    /* Se actualiza el modal */
    $(document).on("click", "#updateModal", () => {
        let x = validarCampos('#txtNombreModal','#txtDescripcionModal','#txtPrecioModal','#txtCantidadModal','#txtRolModal','#txtImagenModal','modificar');
        if (x==false) {
            return
        }
        /* Se utiliza formdata porque el formulario esta manejando archivos */
        let formulario = new FormData($("#productoFrm")[0]);
        $.ajax({
            url: "../../controlador/producto.update.php",
            type: "POST",
            datatype: "JSON",
            data: formulario,
            processData: false,
            contentType: false
        }).done(json => {
            alertify.success(json)
            buscar();
        }).fail((xhr, status, error) => {
            console.log(error);
        })
        cerrarModal()
    });
    /* elimina el producto en base de datos */
    $(document).on("click", "#deleteModal", () => {
        cerrarModal();
        $.ajax({
            url: "../../controlador/producto.delete.php",
            type: "POST",
            datatype: "JSON",
            data: $("#productoFrm").serialize()
        }).done((json) => {
            alertify.error(json)
            buscar();
        }).fail((xhr, status, error) => {
            console.log(error);
        })
    });
    buscar();
});
let categorias="";
function buscar() {
    $.ajax({
        url: "../../controlador/producto.read.php",
        type: "POST",
        datatype: "JSON",
        data: null
    }).done((json) => {
        try {
            /* Se envia el objeto parseado a la funcion */
            crearMatriz(JSON.parse(json));
            /* data table no esta en uso */
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
                        title: 'Reporte de ingredientes',
                        exportOptions: {
                            columns:[0,1,2,3]
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fas fa-file-excel"></i>',
                        autoFilter: true,
                        titleAttr:"Excel",
                        title: 'Reporte de ingredientes',
                        exportOptions: {
                            columns:[0,1,2,3]
                        }
                    },
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fas fa-copy"></i>',
                        titleAttr:"Copiar",
                        title: 'Reporte de ingredientes',
                        exportOptions: {
                            columns:[0,1,2,3]
                        }
                    },
                    {
                        extend: 'print',
                        text: '<i class="fas fa-print"></i>',
                        titleAttr:"Imprimir",
                        title: 'Reporte de ingredientes',
                        exportOptions: {
                            columns:[0,1,2,3]
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
/* Se encarga de personalizar el campo donde ingresamos la imagen */
function limpiarImagen() {
    $("#divImagen").css('background-color', `aqua`);
    $("#divImagen").css('background-image', `none`);
    $(`.texto`).css('color', `#000000`);
}
/* funcion de validacion no esta en uso */
function limpiarCampos() {
    $("#txtNombre").val("");
    $("#txtDescripcion").val("");
    $("#txtPrecio").val(1);
    $("#txtCantidad").val(1);
    $("#selCategoria option[value='0']").prop("selected", true);
    $("#txtImagen").val("");
    limpiarImagen();
}
/* Se crea la tabla y se muestra en html */
function crearMatriz(x) {
    let datos = "<table id='myTable' class='table table-dark table-bordered table-hover text-center' border=3><thead><tr><th>Nombre</th><th>Categoria</th><th>Precio</th><th>Cantidad</th><th>Imagen</th><th>Modificar</th><th>Eliminar</th></tr></thead>"
    datos += "<tbody>";
    $.each(x, (key, value) => {
        datos += `<tr class='bgTable'><td>${value.nombre}</td>`
        datos += `<td>${value.nombreCategoria}</td>`;
        datos += `<td>${value.precio}</td>`;
        datos += `<td>${value.cantidad}</td>`;
        datos += `<td><img src="../${value.imagen}" class='imgMatriz' alt=""></td>`;
        datos += `<td><a class="btn btn-info" onclick="modal('update');accion(${value.id_producto},${value.id_auditoria},${value.id_categoria},'${value.nombre}','${value.descripcion}',${value.precio},${value.cantidad},'${value.imagen}');" data-bs-toggle="modal" data-bs-target="#modal"><i class="far fa-edit"></i></a></td>`;
        datos += `<td><a class="btn btn-danger" onclick="modal('delete');accion(${value.id_auditoria});" data-bs-toggle="modal" data-bs-target="#modal"><i class="far fa-trash-alt"></i></a></td></tr>`;
    });
    datos += `</tbody></table>`;
    $("#respuesta").html(datos);
}
/* ocultar modal */
function cerrarModal() {
    $('#modal').modal('hide');
}
/* Muestra el modal dependiendo del condicional */
function modal(x) {
    let j = "";
    if (x == "update") {
        $("#exampleModalLabel").html("Modificar Usuario");
        j = '<table class="table"><tbody>';
        j+= '<tr hidden><td>Id:</td><td><center><input readonly class="w-100" type="number" id="txtIdProductoModal" name="txtIdProductoModal"></center></td></tr>';
        j+= '<tr hidden><td>Id:</td><td><center><input readonly class="w-100" type="number" id="txtIdAuditoriaModal" name="txtIdAuditoriaModal"></center></td></tr>';
        j+='<tr><td>Nombre:</td><td><center><input class="w-100 form-control" type="text" id="txtNombreModal" name="txtNombreModal"></center></td></tr>';
        j+='<tr><td>Descripcion:</td><td><center><textarea class="form-control" name="txtDescripcionModal" id="txtDescripcionModal" rows="2"></textarea></center></td></tr>';
        j+=`<tr><td>Categoria:</td><td><center><select class="form-control" id="txtRolModal" name="txtRolModal"></select></center></td></tr>`;
        j+='<tr><td>Precio:</td><td><center><input class="w-100 form-control" type="number" id="txtPrecioModal" name="txtPrecioModal"></center></td></tr>';
        j+='<tr><td>Cantidad:</td><td><center><input class="w-100 form-control" type="number" id="txtCantidadModal" name="txtCantidadModal"></center></td></tr>';
        
        j += '<tr hidden><td>Imagen:</td><td><center><input readonly class="w-100" type="text" id="urlImagenModal" name="urlImagenModal"></center></td></tr>';
        j += `<tr><td>Imagen:</td><td><center>
            <div id="divImagenModal" class="col-12">
                <p id="textoModal"></p>
                <input type="file" accept="image/*" name="txtImagenModal" id="txtImagenModal" class="txtImagen" onchange="imagenServidor(this.id,'divImagenModal','modificar')">
            </div></center></td></tr></tbody></table>`;
        $(".modal-body").html(j);
        $(".modalConfirmacion").html("Modificar");
        $(".modalConfirmacion").prop("id","updateModal");
    } else {
        $("#exampleModalLabel").html("Desea continuar?");
        j = '<table class="table"><tbody>';
        j+= '<tr hidden><td>Id:</td><td><center><input hidden class="w-100" type="number" id="txtIdProductoModal" name="txtIdProductoModal"></center></td></tr></tbody></table>'
        $(".modal-body").html(j);
        $(".modalConfirmacion").html("Eliminar");
        $(".modalConfirmacion").prop("id","deleteModal");
    }
}
/* Se cargan los datos en el modal */
function accion(a="",b="",c="",d="",e="",f="",g="",h="") {
    $("#txtIdProductoModal").val(a)
    $("#txtIdAuditoriaModal").val(b)
    $("#txtNombreModal").val(d)
    $("#txtDescripcionModal").val(e)
    $("#txtPrecioModal").val(f)
    $("#txtRolModal").append(categorias)
    if (c!="") {
        document.getElementById("txtRolModal").value = c;   
    }
    $("#txtCantidadModal").val(g)
    $(`#urlImagenModal`).val(h);
    let i = h.split(" ");
    if (i.length>1) {
        h="";
        /* esta iterador personaliza la ruta de la imagen ejemplo la etiqueta '<img src="as sds.img"></img>' como podemos observar la etiqueta img si deja tener espacios en blancos mientras que la propiedad css no para ello seria de esta manera 'background-image : url(as\ sds.img)' */
        for (let j = 0; j < i.length; j++) {
            if (j==i.length-1) {
                h+=i[j];
            }else{
                h+=i[j]+"\\ ";
            }
        }
    }
    $("#divImagenModal").css('background-image', `url(..\/${h})`);
    
}
/* Esta funcion detecta si se cargo una imagen en input file, si es el caso se personaliza el campo donde ingresamos la imagen */
function imagenServidor(a,b,c="") {
    let input = document.getElementById(a);
    let fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    fReader.onloadend = function(event){
        $(`#${b}`).css('background-image', `url(${event.target.result})`);
        $(`#${b}`).css('background-color', `transparent`);
        if (b=="divImagen") {
            $(`.texto`).css('color', `transparent`);
        }
    }
    if (c!="") {
        $(`#urlImagenModal`).val("modificar");
    }
}
/* Esta funcion me carga las categorias en un select */
function cargarCategorias() {
    $.ajax({
        url: "../../controlador/categoria.read.php",
        type: "POST",
        dataType: "JSON",
        data: null
    }).done(json => {
        const select = $("#selCategoria");
        let option = "";
        $.each(json, (key, value) => {
            option += `<option value="${value.id_categoria}">${value.nombre}</option>`;
        })
        categorias=option;
        select.append(option);
    }).fail((xhr, status, error) => {
        console.log(error)
    })
}
/* Esta funcion valida campos, pero no esta en uso */
function validarCampos(nombre,descripcion,precio,cantidad,categoria,imagen,condicional="") {
    let a = $(`${nombre}`).val();
    let b = $(`${descripcion}`).val();
    let c = $(`${precio}`).val();
    let d = $(`${cantidad}`).val();
    let e = $(`${categoria}`).val();
    let f = $(`${imagen}`).val();
    if (d<0 || d=="") {
        alertify.error("La cantidad debe ser mayor a 0");
        return false
    } else if (c<0 || c=="") {
        alertify.error("El precio debe ser mayor a 0");
        return false
    } else if (e==null) {
        alertify.error("Se debe seleccionar una categoria");
        return false
    } else if (a=="") {
        alertify.error("Se debe ingresar un nombre");
        return false
    } else if (b=="") {
        alertify.error("Se debe ingresar una descripcion");
        return false
    }
    if (condicional="") {
        if (f=="") {
            alertify.error("Se debe seleccionar una imagen");
            return false
        }
    }
}