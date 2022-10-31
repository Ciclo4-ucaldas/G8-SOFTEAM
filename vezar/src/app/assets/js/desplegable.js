/* Se ejecuta cuando se carga la pagina, este archivo pertenece a la vista del cliente */
$(document).ready(() => {
    /* Es el menu de las plantillas se muestra y se oculta si se da click sobre el */
    $(document).on("click", ".desplegable", () => {
        let x = $("#txtDesplegable").val();
        if (x == "mostrar") {
            $("#menuDesplegable").show();
            $("#txtDesplegable").val("ocultar");
        } else {
            $("#menuDesplegable").hide();
            $("#txtDesplegable").val("mostrar");
        }
    });
    $(document).on("click", "#vista", () => {
        window.location.href = "../admin/login.frm.php";
    });
    $(document).on("click", ".logo", () => {
        window.location.href = "../cliente/leerQR.frm.php";
    });
    read();
    /* Cuando damos click en el carrito y no estamos en la vista del carrito nos redirige a la vista del carrito, de lo contrario no hace nada */
    $(document).on("click", "#carrito", () => {
        if (ruta() != "carrito.frm.php") {
            return window.location.href = "carrito.frm.php";
        }
    });
});
/* Se encarga de preguntar el nombre del cliente si no esta guardado en localStorage */
let cliente = localStorage.getItem("cliente");
let mesa = localStorage.getItem("mesa");
if (!mesa) {
    window.location.href = "leerQR.frm.php";
} else if (!cliente) {
    $(".container-fluid").addClass("d-none");
    preguntarNombre();
}
function socketCustom() {
    if (!cliente) {
        setTimeout(() => {
            window.location.reload();
        }, 650);
    }
}
/* Si el usuario ingreso un nombre correcto se muestran los productos, sino la pagina se actualiza y preguntara de nuevo su nombre */
function preguntarNombre() {
    alertify.prompt("Ingrese Su Nombre.", "",
        function (evt, value) {
            if (value == "") {
                alertify.error('Debe Ingresar Su Nombre');
                socketCustom();
            } else {
                cliente = localStorage.setItem("cliente", value)
                alertify.success('Hola: ' + value);
                $(".container-fluid").removeClass("d-none")
            }
        },
        function () {
            alertify.error('Debe Ingresar Su Nombre');
            socketCustom();
        });
    $(".ajs-ok").css({ "background-color": "#5BBD72" });
    $(".ajs-cancel").css({ "background-color": "#5C6166" });
    $(".ajs-button").css({ "color": "#ffffffff" });
}

let pedidos = "";
/* Se encarga de mostrar el numero de productos en los parentesis del carrito */
function read() {
    let x = JSON.parse(localStorage.getItem("pedido"));
    pedidos = x;
    let i = 0;
    if (x) {
        for (const iterator of x) {
            i++
        }
        $("#numeroProductos").html(` (${i})`);
    } else {
        $("#vaciar").html(``);
        $("#numeroProductos").html(" (0)");
    }
    $.ajax({
        url: "../../controlador/plantillaCliente.read.php",
        type: "POST",
        datatype: "JSON",
        data: null
    }).done((json) => {
        /* Se envia el objeto de plantillas, categorias y productos escogidos por administracion */
        create(JSON.parse(json));
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}
let productos;
let arreglo = [];
let categorias = [];
let plantillas = [];
/* Se encarga de personalizar el array de productos */
function create(x) {
    let datos = "";
    let j = [];
    let y = "";
    productos = x;
    /* Se guardan los productos en un array, como primer nivel la plantilla, segundo la categoria, estos dos son indices el producto son valores, de esta manera es mas facil ingresar a un producto en especifico */
    for (const value of x) {
        if (!arreglo[value.idPlantilla]) {
            j = []
            j[value.id_categoria] = new Array(value)
            arreglo[value.idPlantilla] = j;
        } else {
            if (!arreglo[value.idPlantilla][value.id_categoria]) {
                arreglo[value.idPlantilla][value.id_categoria] = new Array(value);
            } else {
                j = arreglo[value.idPlantilla][value.id_categoria]
                j.push(value);
            }
        }
    }
    /* Se guardan las categorias en un array */
    for (const iterator of x) {
        if (!categorias[iterator.id_categoria]) {
            categorias[iterator.id_categoria] = iterator.nombreCategoria;
        }
    }
    /* Se guardan las plantillas en un array */
    for (const iterator of x) {
        if (!plantillas[iterator.idPlantilla]) {
            plantillas[iterator.idPlantilla] = iterator.nombrePlantilla;
        }
    }
    j = 1;
    /* Se recorren las opciones del menu y luego se muestran en html */
    datos += "<ul>";
    arreglo.forEach((element, index) => {
        datos += `<li><a href="#"><h2 class="white row"><div class="col-10">${plantillas[index]}</div><div class="col-2"><i class="fas fa-chevron-right"></i></div></h2></a><ul>`;
        for (const iterator of element) {
            if (element.indexOf(iterator) != -1) {
                if (j == 1) {
                    y = element.indexOf(iterator);
                    x = index;
                    j++;
                }
                datos += `<li onclick="readProducts(${index},${element.indexOf(iterator)})"><a href="#"><h3 class="white">${categorias[element.indexOf(iterator)]}</h3></a></li>`;
            }
        }
        datos += "</ul></li>";
    });
    datos += "</ul>";
    $(".vistas").html(datos);
    /* Se trae informacion del localStorage y se valida */
    let local = JSON.parse(localStorage.getItem("menu"));
    let localAtras = JSON.parse(localStorage.getItem("atras"));
    /* Si estoy en la descripcion del plato y quiero ir a bebidas ese dato se guarda en local storage si existe me dirige a esa ruta cuando se cargue la pagina, si le di a la flecha de atras es el caso de la descripcion del plato, guarda el dato antes de dirigirse a la descripcion del plato y luego cuando le damos atras nos dirige a la plantilla y categoria en la que estabamos, si no existe ningua nos dirige a la primer plantilla y a la primer categoria */
    if (local) {
        datos = products(local[0], local[1])
        localStorage.removeItem('menu');
    } else if (localAtras) {
        datos = products(localAtras[0], localAtras[1])
        localStorage.removeItem('atras');
    } else {
        datos = products(x, y)
    }
    $("#respuesta").html(datos);
}

function readProducts(x, y) {
    /* Dependiendo la ruta, se actualiza el localStorage y es redireccionado a 'plantilla.frm' que en pocas palabras es el home del aplicativo del lado del cliente */
    if (ruta() == "carrito.frm.php") {
        //localStorage.setItem("pedido", JSON.stringify(arrayPedidos()));
        localStorage.setItem("menu", JSON.stringify([x, y]));
        return window.location.href = "plantilla.frm.php";
    } else if (ruta() != "plantilla.frm.php") {
        localStorage.setItem("menu", JSON.stringify([x, y]));
        return window.location.href = "plantilla.frm.php";
    }
    let datos = products(x, y);
    $("#menuDesplegable").hide();
    $("#txtDesplegable").val("mostrar");
    $("#respuesta").html(datos);
}
/* Se encarga de guardar los productos en html y luego es retornado */
function products(x, y) {
    /* `<div class="card" style="width: 18rem;">
    <img class="card-img-top" src="..." alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      <a href="#" class="btn btn-primary">Go somewhere</a>
    </div>
  </div>` */
    let datos = '<div class="col-12 m-2"><div class="row justify-content-start align-items-start p-6">';
    for (const iterator of arreglo[x][y]) {
        datos += `<div class="card m-auto mt-3 text-center" style="width: 14rem;"><img  class="card-img-top img-2" src="../${iterator.imagen}" alt=""><div class="card-body"><h5 class="card-title">${iterator.nombre}</h5>`;
        datos += `<a href="#" class="btn btn-warning" onclick="verPlato(${x},${y},${arreglo[x][y].indexOf(iterator)})">Ver Plato</a></div></div>`;
    }
    datos += "</div></div>"
    return datos
}
/* Se guarda el plato escogido por el cliente en localStorage, luego se redirecciona a la ruta 'plato.frm.php' */
function verPlato(x, y, z) {
    try {
        localStorage.setItem("plato", JSON.stringify([arreglo[x][y][z], x, y]));
        return window.location.href = "plato.frm.php";
    } catch (error) {
        $("#respuesta").html("");
    }
}
/* Se obtiene la ruta y luego se corta para dejar el ultimo dato de la cadena y este se retorna */
function ruta() {
    let b = window.location.pathname.split("/");
    return b[b.length - 1];
}
function modificarCantidad(x) {
    let datos = "";
    let j = [];
    let y = "";
    productos = x;
    /* Se guardan los productos en un array, como primer nivel la plantilla, segundo la categoria, estos dos son indices el producto son valores, de esta manera es mas facil ingresar a un producto en especifico */
    for (const value of x) {
        if (!arreglo[value.idPlantilla]) {
            j = []
            j[value.id_categoria] = new Array(value)
            arreglo[value.idPlantilla] = j;
        } else {
            if (!arreglo[value.idPlantilla][value.id_categoria]) {
                arreglo[value.idPlantilla][value.id_categoria] = new Array(value);
            } else {
                j = arreglo[value.idPlantilla][value.id_categoria]
                j.push(value);
            }
        }
    }
    /* Se guardan las categorias en un array */
    for (const iterator of x) {
        if (!categorias[iterator.id_categoria]) {
            categorias[iterator.id_categoria] = iterator.nombreCategoria;
        }
    }
    /* Se guardan las plantillas en un array */
    for (const iterator of x) {
        if (!plantillas[iterator.idPlantilla]) {
            plantillas[iterator.idPlantilla] = iterator.nombrePlantilla;
        }
    }
    j = 1;
    /* Se recorren las opciones del menu y luego se muestran en html */
    datos += "<ul>";
    arreglo.forEach((element, index) => {
        datos += `<li><a href="#"><h2 class="white row"><div class="col-10">${plantillas[index]}</div><div class="col-2"><i class="fas fa-chevron-right"></i></div></h2></a><ul>`;
        for (const iterator of element) {
            if (element.indexOf(iterator) != -1) {
                if (j == 1) {
                    y = element.indexOf(iterator);
                    x = index;
                    j++;
                }
                datos += `<li onclick="readProducts(${index},${element.indexOf(iterator)})"><a href="#"><h3 class="white">${categorias[element.indexOf(iterator)]}</h3></a></li>`;
            }
        }
        datos += "</ul></li>";
    });
    datos += "</ul>";
    $(".vistas").html(datos);
}
let contador;
function verificarPlato(c) {
    if (ruta() == "plato.frm.php") {
        let j=0,b;
        let plato = JSON.parse(localStorage.getItem("plato"))[0];
        for (const iterator of c) {
            if (iterator.id_producto==plato.id_producto) {
                j++;
                b = document.getElementById("txtCantidad");
                b.max=iterator.cantidad;
                if (b.value>b.max) {
                    b.value=b.max
                }
                break
            }
        }
        setTimeout(() => {
            if (j==0) {
                window.location.href="plantilla.frm.php";
            }
        }, 400);
    }
}
function verificarCarrito(c) {
    if (ruta() == "carrito.frm.php") {
        let j=[],b=0;
        let pedido = JSON.parse(localStorage.getItem("pedido"));
        for (const iterator of pedido) {
            for (const iterar of c) {
                if (iterar.id_producto==iterator[0].id_producto) {
                    if (iterator[0].cantidad!=iterar.cantidad) {
                        b++;
                    }
                    j.push(new Array(iterar,iterator[1]));
                    break;
                }
            }
        }
        if (b!=0 || pedido.length!=j.length ) {
            localStorage.setItem("pedido", JSON.stringify(j));
            setTimeout(() => {
                window.location.href="carrito.frm.php";
            }, 400);
        }
    }
}
setInterval(() => {
    $.ajax({
        url: "../../controlador/plantillaCliente.read.php",
        type: "POST",
        datatype: "JSON",
        data: null
    }).done((json) => {
        contador = JSON.parse(json);
        if (contador.length == productos.length) {
            verificarPlato(contador);
            verificarCarrito(contador);
            arreglo = [];
            modificarCantidad(contador);
            
        }else{
            verificarPlato(contador);
            verificarCarrito(contador);
            arreglo = [];
            create(contador);
        }
        if (ruta() == "plato.frm.php") {
            //return window.location.href = "carrito.frm.php";
        }
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}, 5000);
if (screen.width<320) {
    $("#menuDesplegable").removeClass("col-6")
    $("#menuDesplegable").addClass("col-7")
}