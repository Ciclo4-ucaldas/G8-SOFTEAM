/* Se ejecuta cuando se carga la pagina, este archivo pertenece a la vista de cocina */
crearMatriz();
/* Se muestran los productos del pedido escogido */
function crearMatriz() {
    let local = JSON.parse(localStorage.getItem("pedidoCocina"));
    let precioTotal=0;
    let datos = `<table id='tablePedidos' class='table table-dark table-bordered table-hover text-center mb-2' border=3><thead><tr><th>Nombre</th><th>Precio Unitario</th><th>Cantidad</th></tr></thead><tbody>`;
    for (const iterator of local) {
        precioTotal+= iterator.precio*iterator.cantidadPedido;
        datos += `<tr class='bgTable'>
    <td>${iterator.nombreProducto}</td>
    <td>$ ${iterator.precio}  USD</td>
    <td>${iterator.cantidadPedido}</td></tr>`;
    }
    datos += `</tbody></table><div class="text-right pr-2">Precio Total &nbsp; &nbsp; &nbsp; $ <span>${precioTotal}</span> USD</div>`;
    $("#nombrePersona").html(local[0].nombrePersona)
    $("#respuesta").html(datos);
}