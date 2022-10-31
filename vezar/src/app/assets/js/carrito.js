/* Se ejecuta cuando se carga la pagina, este archivo pertenece a la vista del cliente */
$(document).ready(()=>{
    /* Es un evento se encarga de ocultar el menu y mostrar el login de mesero, se guarda en localStorage */
    $(document).on("click", "#enviarPedido", () => {
        $("#menu").css({"display":"none"});
        $("body").css({"background-image": "url(../../componente/img/bgLogin.jpeg)", "background-size": "cover"})
        $("#modal").removeClass("d-none");
        $("#modal").addClass("d-block");
        localStorage.setItem("pedido",JSON.stringify(arrayPedidos()));
    });
    /* Es un evento se encarga de actualizar la cantidad del pedido*/
    $(document).on("keyUp change", ".cantidad", (e) => {
        /* la e es el objeto sobre el que se produce el evento, se compara el valor ingresado con el valor maximo, minimo o sino esta establecido */
        if (parseInt(e.target.max)<parseInt(e.target.value)) {
            e.target.value=e.target.max;
        }else if (parseInt(e.target.value)<parseInt(e.target.min)) {
            e.target.value=e.target.min;
        }else if (e.target.value=="") {
            e.target.value=e.target.min;
        }
        let a,d,c,g=[],f,valorActual,valorNuevo,total;
        /* Se dirige al selector padre */
        let b = e.target.parentNode.parentNode;
        /* Se recorre el objeto y se guardan en variables*/
        for (const iterator of b.childNodes) {
            if (iterator.childNodes.length>0) {
                if (iterator.childNodes[1]) {
                    if (iterator.childNodes[1].type=="number") {
                        f= parseInt(iterator.childNodes[1].value);
                    }else{
                        c = parseInt(iterator.childNodes[1].value);
                    }
                }else{
                    if (!iterator.childNodes[0].classList) {
                        a = iterator.childNodes[0].textContent;
                        a = parseInt(a.substr(2,a.length-7))
                    }
                }
            }
        }
        /* Se obtiene el objeto de localStorage */
        d = JSON.parse(localStorage.getItem("pedido"));
        /* Se actualiza la cantidad del producto actualizado */
        for (const iterator of d) {
            if (iterator[0].id_producto==c) {
                valorActual= parseInt(iterator[1]) * parseInt(a);
                iterator[1]=parseInt(f);
            }
            g.push(iterator);
        }
        /* Se actualiza el objeto en localStorage */
        localStorage.setItem("pedido",JSON.stringify(g));
        /* Se realiza operaciones basicas para actualizar el total de los productos */
        valorNuevo= parseInt(f) * parseInt(a);
        total = parseInt($("#precioTotal").html());
        $("#precioTotal").html((total-valorActual) + valorNuevo)
    });
    /* Esta funcion se encarga de mostrar el carrito y oculta el login de mesero */
    $(document).on("click", "#atras", () => {
        $("#menu").css({"display":"block"});
        $("body").css({"background-image": "url(../../componente/img/bgCliente.jpeg)", "background-size":"cover"})
        $("#modal").removeClass("d-block");
        $("#modal").addClass("d-none");
    });
    /* Se encarga de vaciar los productos del carrito y se actualiza el localStorage */
    $(document).on("click", "#vaciar", () => {
        $("#vaciar").html("");
        $("#numeroProductos").html(" (0)");
        let b = "<h1 class='text-center'>No Ingresaste Producto(s) En El Carrito!!!</h1>"
        $("#respuestas").html(b);
        localStorage.setItem("pedido",JSON.stringify(arrayPedidos()));
    });
    /* Se valida el usuario por medio de ajax */
    $(document).on("click", "#inciarSesion", () => {
        validarUsuario()
    });
    
});
function enviarPedido() {
    $.ajax({
        url: "../../controlador/pedido.create.php",
        type: "POST",
        datatype: "JSON",
        data: $("#carritoFrm").serialize()
    }).done(json => {
        alertify.success(json);
        /* Se limpia el localStorage */
        localStorage.clear();
        setTimeout(() => {
            window.location.href="leerQR.frm.php";
        }, 650);
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}
function validarUsuario() {
    $.ajax({
        url: "../../controlador/usuario.validar.php",
        type: "POST",
        datatype: "JSON",
        data: $("#usuarioFrm").serialize()
    }).done(json => { 
        console.log(json)
        json = JSON.parse(json)
        /* Si el usuario ingresado es correcto, se envia el pedido a cocina por medio de ajax sino muestra un mensaje de error */
        if (json.length>0) {
            $("#mesa").val(localStorage.getItem("mesa"));
            $("#idUsuario").val(json[0].id_usuario);
            $("#nombreCliente").val(localStorage.getItem("cliente"));
            let x = $("#precioTotal").html();
            $("#txtPrecioTotal").val(x);
            let y = arrayPedidos();
            for (const iterator of y) {
                iterator[0].cantidad=iterator[1];
                iterator.pop();
            }
            $("#textAreaObj").val(JSON.stringify(y))
            enviarPedido();
        }else{
            alertify.error("Ingrese bien sus datos");
            $("#username").val("");
            $("#password").val("");
        }
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}
/* Esta funcion se ejecuta cuando se carga la pagina, es la encargada de mostrar si existen productos en el carrito */
obtenerPedido();
function obtenerPedido() {
    let precioTotal=0;
    let x = JSON.parse(localStorage.getItem("pedido"));
    if (x==null||x.length==0) {
        let b = "<h1 class='text-center'>No Ingresaste Producto(s) En El Carrito!!!</h1>"
        return $("#respuestas").html(b);
    }
    $("#vaciar").html("VACIAR CARRITO");
    let datos = `<table id='tablePedidos' class='table table-bordered table-hover text-center mb-2' border=3><thead class="bg-verde white"><tr><th>Nombre</th><th>Precio Unitario</th><th>Cantidad</th><th>Eliminar</th></tr></thead><tbody class="vaciar">`;
    for (const iterator of x) {
        precioTotal+= iterator[0].precio*(iterator[1]>iterator[0].cantidad?iterator[0].cantidad:iterator[1]);
        datos += `<tr class='bgTable' id="as${iterator[0].id_producto_plantilla}">
    <td>${iterator[0].nombre} <input hidden type="text" value="${iterator[0].id_producto}"></td>
    <td>$ ${iterator[0].precio}  USD</td>
    <td><input hidden type="number"><input type="number" class="cantidad" min="1" max="${iterator[0].cantidad}" value="${(iterator[1]>iterator[0].cantidad?iterator[0].cantidad:iterator[1])}"></td>
    <td><a class="btn btn-danger" onclick="eliminarHijo('as${iterator[0].id_producto_plantilla}')"><i class="far fa-trash-alt"></i></a></td></tr>`;
    }
    datos += `</tbody></table><div class="text-right pr-2">Precio Total &nbsp; &nbsp; &nbsp; $ <span id="precioTotal">${precioTotal}</span> USD</div><div class="text-center mt-4"><input type="button" id="enviarPedido" class="btn btn-verde mb-4 font-size-1" value="Enviar Pedido"></div>`;
    $("#respuestas").html(datos);
}
/* Se encarga de recorrer la tabla de productos y guardar los datos en un array */
function arrayPedidos() {
    let x = $(".bgTable");
    let cantidad = [];
    let producto = [];
    let producto2 = [];
    let pedidos = [];
    /* Se encarga de recorrer todos los tr de la tabla */
    for (const iterator of x) {
        for (const i of iterator.childNodes) {
            if (i.childNodes[1]) {
                if (i.childNodes[1].type=="text") {
                    producto.push(i.childNodes[1].value)
                }else{
                    cantidad.push(i.childNodes[1].value)
                }
            }
        }
    }
    /* Compara los productos del array que se creo con el array global que se encuentra en 'desplegable.js' e ingresa los productos deacuerdo a un condicional */
    producto.forEach((element,index)=>{
        productos.forEach((e,i)=>{
            if (e.id_producto_plantilla==element) {
                producto2.push(e);
            }
        });
    });
    /* Es el array que se creo en el anterior bucle, en este bucle se guardan los pedidos y se retornan */
    for (const iterator of producto2) {
        pedidos.push(new Array(iterator,cantidad[producto2.indexOf(iterator)]));
    }
    return pedidos
}
/* Elimina un tr del table y se actualiza el localStorage */
function eliminarHijo(x) {
    let b = document.getElementById(x);
    b.parentNode.removeChild(b);
    let y = $("#numeroProductos").html();
    y = parseInt(y.slice(2,-1))-1;
    if (y<1) {
        $("#vaciar").html("");
        let b = "<h1 class='text-center'>No Ingresaste Producto(s) En El Carrito!!!</h1>"
        $("#respuestas").html(b);
    }
    $("#numeroProductos").html(` (${(y<1)?0:y})`);
    localStorage.setItem("pedido",JSON.stringify(arrayPedidos()));
    
}