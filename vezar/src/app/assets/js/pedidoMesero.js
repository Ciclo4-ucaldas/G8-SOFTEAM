$(document).ready(() => {
    $(document).on("click", "#enviarPedido", () => {
        let x = JSON.parse(localStorage.getItem("pedidoMesero"));
        $("#textAreaObj").val(JSON.stringify(x[0]));
        $("#txtIdPedido").val(x[0][0].id_pedido);
        $.ajax({
            url: "../../controlador/pedido.update.php",
            type: "POST",
            datatype: "JSON",
            data: $("#pedidoFrm").serialize()
        }).done(json => {
            alertify.success(json)
            setTimeout(() => {
                updateEstado()
            }, 600);
        }).fail((xhr, status, error) => {
            console.log(error);
        })
    });
    $(document).on("keyUp change", ".cantidad", e => {
        if (parseInt(e.target.max)<parseInt(e.target.value)) {
            e.target.value=e.target.max
        }else if (parseInt(e.target.value)<parseInt(e.target.min)) {
            e.target.value=e.target.min;
        }else if (e.target.value=="") {
            e.target.value=e.target.min;
        }
        let valorActual,cantidad,valorNuevo,total,g=[],d,idDetallePedido,precio;
        let b = e.target.parentNode.parentNode;
        idDetallePedido = parseInt(b.childNodes[0].childNodes[0].value);
        precio = b.childNodes[2].childNodes[0].textContent;
        precio = parseInt(precio.substr(2,precio.length-7));
        cantidad = parseInt(b.childNodes[3].childNodes[0].value);
        valorNuevo = cantidad*precio;
        d = JSON.parse(localStorage.getItem("pedidoMesero"));
        for (const iterator of d[0]) {
            if (iterator.id_detalle_pedido==idDetallePedido) {
                valorActual= parseInt(iterator.cantidadPedido) * precio;
                iterator.cantidadPedido=cantidad;
            }
            g.push(iterator);
        }
        localStorage.setItem("pedidoMesero",JSON.stringify([g,d[1],d[2]]));
        total = parseInt($("#precioTotal").html());
        $("#precioTotal").html((total-valorActual) + valorNuevo)
    });
    $(document).on("click", "#atras", () => {
        updateEstado()
    });
    crearMatriz();
});
function eliminarHijo(x) {
    let b = document.getElementById(x);
    let hijo = b.firstChild.firstChild.value;
    let local = JSON.parse(localStorage.getItem("pedidoMesero"));
    let g=[];
    for (const iterator of local[0]) {
        if (iterator.id_detalle_pedido!=hijo) {
            g.push(iterator)
        }else{
            let y = $("#txtIdAuditoria").val();
            $("#txtIdAuditoria").val(iterator.dPIdAuditoria);
            let x = $("#txtEstado").val();
            $("#txtEstado").val("inactivo");
            $("#txtIdDetallePedido").val(iterator.id_detalle_pedido);
            $.ajax({
                url: "../../controlador/pedido.delete.php",
                type: "POST",
                datatype: "JSON",
                data: $("#pedidoFrm").serialize()
            }).done(json => {
                $("#txtEstado").val(x);
                $("#txtIdAuditoria").val(y);
            }).fail((xhr, status, error) => {
                console.log(error);
            });
            $("#txtCantidad").val(iterator.cantidadProducto);
            $("#txtIdProducto").val(iterator.id_producto);
            $.ajax({
                url: "../../controlador/pedido.deleteCantidad.php",
                type: "POST",
                datatype: "JSON",
                data: $("#pedidoFrm").serialize()
            }).done(json => {
                console.log(json)
            }).fail((xhr, status, error) => {
                console.log(error);
            });
        }
    }
    localStorage.setItem("pedidoMesero",JSON.stringify([g,local[1],local[2]]));
    b.parentNode.removeChild(b);
    crearMatriz();
}
function crearMatriz() {
    let local = JSON.parse(localStorage.getItem("pedidoMesero"));
    let precioTotal=0,i=0;
    let datos = `<table id='tablePedidos' class='table table-dark table-bordered table-hover text-center mb-2' border=3><thead><tr><th>Nombre</th><th>Precio Unitario</th><th>Cantidad</th>`;
    if (local.length>1) {
        datos+= `<th>Eliminar</th></tr></thead><tbody></tbody>`;
    }else{
        datos+=`</tr></thead><tbody></tbody>`;
    }
    for (const iterator of local[0]) {
        precioTotal+= iterator.precio*iterator.cantidadPedido;
        datos += `<tr class='bgTable' id="as${iterator.id_detalle_pedido}"><td hidden><input type="number" value="${iterator.id_detalle_pedido}"></td><td>${iterator.nombreProducto}</td><td>$ ${iterator.precio}  USD</td>`;
        if (local.length>1) {
            datos+= `<td><input type="number" class="cantidad" min="1" max="${parseInt(iterator.cantidadProducto)+parseInt(iterator.cantidadPedido)}" value="${iterator.cantidadPedido}"></td><td><a onclick="eliminarHijo('as${iterator.id_detalle_pedido}')" class="btn btn-danger"><i class="far fa-trash-alt"></i></a></tr>`;
        }else{
            datos+=`<td>${iterator.cantidadPedido}</td></tr>`;
        }
    }
    datos += `</tbody></table><div class="text-right pr-2">Precio Total &nbsp; &nbsp; &nbsp; $ <span id="precioTotal">${precioTotal}</span> USD</div>`;
    if (local.length>1) {
        datos+= `<div class="text-center mt-4"><input type="button" id="enviarPedido" class="btn btn-danger mb-4 font-size-1" value="Enviar Pedido"></div>`;
    }
    for (const iterator of local[0]) {
        $("#nombrePersona").html(iterator.nombrePersona);
        i++;
        break
    }
    if (i==0) {
        datos = "<h1 class='text-center'>No Existen Productos</h1>";
        $("#nombrePersona").html("");
    }
    $("#respuesta").html(datos);
}
function updateEstado() {
    let local = JSON.parse(localStorage.getItem("pedidoMesero"));
    if (local.length>1) {
        $("#txtEstado").val(local[1]=="modificando"?"en cola":local[1]);
        $("#txtIdAuditoria").val(local[2]);
        $.ajax({
            url: "../../controlador/pedido.delete.php",
            type: "POST",
            datatype: "JSON",
            data: $("#pedidoFrm").serialize()
        }).done(json => {
            window.location.href = "pedidos.frm.php";
        }).fail((xhr, status, error) => {
            console.log(error);
        })
    }else{
        window.location.href = "pedidos.frm.php"
    }
}