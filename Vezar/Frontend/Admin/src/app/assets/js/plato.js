/* Se ejecuta cuando se carga la pagina, este archivo pertenece a la vista del cliente */
$(document).ready(()=>{
    $(document).on("click", "#atras", () => {
        atras();
    });
    $(document).on("keyUp change", "#txtCantidad", (e) => {
        /* la e es el objeto sobre el que se produce el evento, se compara el valor ingresado con el valor maximo, minimo o sino esta establecido */
        if (parseInt(e.target.max)<parseInt(e.target.value)) {
            e.target.value=e.target.max;
        }else if (parseInt(e.target.value)<parseInt(e.target.min)) {
            e.target.value=e.target.min;
        }else if (e.target.value=="") {
            e.target.value=e.target.min;
        }
    });
    /* Esta funcion agrega la cantidad del producto seleccionado al pedido del localStorage si existe sino sera su primer producto como pedido de localStorage */
    $(document).on("click", "#agregarCarrito", () => {
        let x = JSON.parse(localStorage.getItem("plato"));
        let a = $("#txtCantidad").val();
        let b = JSON.parse(localStorage.getItem("pedido"));
        if (b) {
            let producto=[];
            let cantidad=[];
            let pedidos=[];
            let i = 0 ;
            for (const iterator of b) {
                for (const iterar of iterator) {
                    if (typeof iterar == "object") {
                        producto.push(iterar)
                    }else{
                        cantidad.push(iterar)
                    }
                }
            }
            for (const iterator of producto) {
                if (iterator.id_auditoria==x[0].id_auditoria) {
                    cantidad[producto.indexOf(iterator)]=parseInt(cantidad[producto.indexOf(iterator)])+parseInt(a);
                    i++;
                }
            }
            for (const iterator of producto) {
                pedidos.push(new Array(iterator,cantidad[producto.indexOf(iterator)]))
            }
            if (i==0) {
                pedidos.push(new Array(x[0],a));
            }
            localStorage.setItem("pedido",JSON.stringify(pedidos));
        }else{
            b = []
            b.push(new Array(x[0],a));
            localStorage.setItem("pedido",JSON.stringify(b));
        }
        alertify.success("Se Agrego El Producto Al Carrito")
        atras();
    });
});
/* Es redireccionado a la plantilla del localStorage */
function atras() {
    let x = JSON.parse(localStorage.getItem("plato"));
        localStorage.setItem("atras",JSON.stringify([x[1],x[2]]));
        return window.location.href="plantilla.frm.php";
}
/* Muestra el plato seleccionado por el cliente  */
function obtenerPlato() {
    let x = JSON.parse(localStorage.getItem("plato"));
    let datos = `<div class="card m-auto mt-4" style="width: 40rem;">
    <h2 class="card-title mt-2">${x[0].nombre}<h2/>
    <div class="row">
        <div class="col-6">
            <img class="card-img-top img-border-radius" src="../${x[0].imagen}" alt="Card image cap">
        </div>
        <div class="col-6">
        <h4 class="card-title">Descripcion</h4>
        <h5 class="card-text text-justify">${x[0].descripcion}.</h5>
        </div>
    </div>
    <div class="card-body">
        <div class="row mb-2">
        <div class="col-6">
            <h5 class="card-text">Precio Unitario &nbsp;&nbsp;$<span id="txtPrecio">${x[0].precio}</span> USD</h5>
        </div>
        <div class="col-6">
            <h5 class="card-text">Cantidad &nbsp;&nbsp;<input id="txtCantidad" type="number" min="1" max="${x[0].cantidad}" value="1"></h5>
        </div>
    </div>
    <input type="button" id="agregarCarrito" class="btn btn-warning btn-block col-12" value="Agregar Carrito">
    </div>
    </div>`;
    $("#respuestas").html(datos);
}
obtenerPlato();
// elemento.clientHeight