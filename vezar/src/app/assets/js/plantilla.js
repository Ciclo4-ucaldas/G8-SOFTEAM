/* Se ejecuta cuando se carga la pagina, este archivo pertenece a la vista del administrador */
$(document).ready(() => {
    /* Es un evento de categorias y se muestra en html */
    $(document).on("change", "#selCategorias", () => {
        let x = $("#selCategorias")[0];
        $("#txtIdCategoria").val(x.value)
        buscar();
    });
    cargarCategorias();
});
/* Crea los productos y los muestra en html */
function crearMatriz(x) {
    let datos="";
    $.each(x,(key,value)=>{
        datos +=`<div class="producto pt-2">
        <img src="../${value.imagen}" alt="">
        <p class="text-center">${value.nombre}</p>`;
        if (value.estado=="activo") {
            datos+=`<h1 class="text-center" onclick="toggleProducto(${value.id_producto_plantilla},'${value.estado}');"><i class="fas fa-toggle-on"></i></h1>
            </div>`;
        }else{
            datos+=`<h1 class="text-center" onclick="toggleProducto(${value.id_producto_plantilla},'${value.estado}');"><i class="fas fa-toggle-off"></i></h1>
            </div>`;
        }
    });
    $("#respuesta").html(datos);
}
/* Trae los productos, es una busqueda personalizada */
function buscar() {
    $.ajax({
        url:"../../controlador/plantillaAdmin.read.php",
        type:"POST",
        datatype:"JSON",
        data:$("#plantillaFrm").serialize()
    }).done((json)=>{
        crearMatriz(JSON.parse(json));
    }).fail((xhr,status,error)=>{
        console.log(error);
    })
}
/* Carga el select con las categorias que existen en base de datos y lo muestra en html */
function cargarCategorias() {
    let local = JSON.parse(localStorage.getItem('plantilla'));
    $("#nombrePlantilla").html(local[0]);
    $("#txtIdPlantilla").val(local[1]);
    $.ajax({
        url: "../../controlador/categoria.read.php",
        type: "POST",
        dataType: "JSON",
        data: null
    }).done(json => {
        const select = $("#selCategorias");
        let option = "";
        $.each(json, (key, value) => {
            option += `<option value="${value.id_categoria}">${value.nombre}</option>`;
        })
        select.append(option);
        let x = $("#selCategorias")[0];
        $("#txtIdCategoria").val(x.value)
        buscar();
    }).fail((xhr, status, error) => {
        console.log(error)
    })
}
/* Si el producto esta desactivado esta funcion lo activa y viceversa por eso le puse toggle */
function toggleProducto(x,y) {
    $("#txtIdProductoPlantilla").val(x);
    if (y=="activo") {
        y="inactivo";
    }else{
        y="activo";
    }
    $("#txtEstado").val(y);
    $.ajax({
        url: "../../controlador/plantillaAdmin.update.php",
        type: "POST",
        dataType: "JSON",
        data: $("#plantillaFrm").serialize()
    }).done(json => {
        buscar();
        alertify.success("Se Guardaron Cambios")
    }).fail((xhr, status, error) => {
        console.log(error)
    })
}