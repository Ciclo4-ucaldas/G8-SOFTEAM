/* Se ejecuta cuando se carga la pagina, este archivo pertenece a la vista de cocina */
$(document).ready(() => {
    buscar();
});
let arreglo=[];

function buscar() {
    $.ajax({
        url:"../../controlador/pedido.read.php",
        type:"POST",
        datatype:"JSON",
        data:null
    }).done((json)=>{
        try {
            create(JSON.parse(json));
            /* $('#myTable').DataTable({
                "language": {
                    "url": "../js/Spanish.json",
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
                            columns:[0,1,2,3]
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fas fa-file-excel"></i>',
                        autoFilter: true,
                        titleAttr:"Excel",
                        title: 'Reporte de empleados',
                        exportOptions: {
                            columns:[0,1,2,3]
                        }
                    },
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fas fa-copy"></i>',
                        titleAttr:"Copiar",
                        title: 'Reporte de empleados',
                        exportOptions: {
                            columns:[0,1,2,3]
                        }
                    },
                    {
                        extend: 'print',
                        text: '<i class="fas fa-print"></i>',
                        titleAttr:"Imprimir",
                        title: 'Reporte de empleados',
                        exportOptions: {
                            columns:[0,1,2,3]
                        }
                    }
            ]
            }); */
        } catch (e) {
            console.log(e)
        }
    }).fail((xhr,status,error)=>{
        console.log(error);
    })
}
function create(x) {
    /* si no existen pedidos retorna un mensaje */
    if (x.length==0) {
        let b = "<h1 class='text-center mt-5'>No Existen Pedidos En El Sistema!!!</h1>"
        return $("#respuesta").html(b);
    }
    arreglo=[];
    /* Se personaliza el array de productos */
    for (const value of x) {
        if (!arreglo[value.id_pedido]) {
            arreglo[value.id_pedido] = new Array(value);
        } else {
            arreglo[value.id_pedido].push(value);
        }
    }
    /* se crea la tabla y se imprime en html */
    let datos = `<table id='myTable' class='table table-dark table-bordered table-hover text-center mb-2' border=3><thead><tr><th>Nombre</th><th>Mesa</th><th>Empleado</th><th>Total</th><th>Cambiar Estado</th></tr></thead><tbody>`;
    for (const iterator of arreglo) {
        if (iterator!=null) {
            datos += `<tr class='bgTable'>
            <td class="pedidoCocinaTable" onclick="pedido(${iterator[0].id_pedido});">${iterator[0].nombrePersona}</td>
            <td class="pedidoCocinaTable" onclick="pedido(${iterator[0].id_pedido});">${iterator[0].nombreMesa}</td>
            <td class="pedidoCocinaTable" onclick="pedido(${iterator[0].id_pedido});">${iterator[0].nombreUsuario}</td>
            <td class="pedidoCocinaTable" onclick="pedido(${iterator[0].id_pedido});">$ ${iterator[0].total} USD</td>`;
            if (iterator[0].estado=="en proceso") {
                datos += `<td><a id="enProceso" onclick="cambiarEstado(${iterator[0].id_auditoria},'${iterator[0].estado}');" class="white" style="font-size:1.4em"><i class="fas fa-sync-alt"></i></a></td></tr>`;
            }else if(iterator[0].estado=="en cola"){
                datos += `<td><a id="enCola" onclick="cambiarEstado(${iterator[0].id_auditoria},'${iterator[0].estado}');" class="white" style="font-size:1.4em"><i class="fas fa-toggle-off"></i></a></td></tr>`;
            }else{
                datos += `<td><a class="white">Modificando</a></td></tr>`;
            }
        }
    }
    datos+="</tbody></table>"
    $("#respuesta").html(datos);
}
/* Se guarda el pedido que se quiere ver para acceder a el en la otra vista */
function pedido(x) {
    localStorage.setItem("pedidoCocina",JSON.stringify(arreglo[x]));
    window.location.href="pedido.frm.php";
}
/* Se carga el estado en un input hidden */
function cambiarEstado(x,y) {
    if (y=="en cola") {
        y="en proceso";
    }else if(y=="en proceso"){
        y="terminado";
    }
    $("#txtEstado").val(y);
    $("#txtIdAuditoria").val(x);
    updateEstado();
}
/* Actualiza el estado del pedido en base de datos */
function updateEstado() {
    $.ajax({
        url: "../../controlador/pedido.delete.php",
        type: "POST",
        datatype: "JSON",
        data: $("#pedidosFrm").serialize()
    }).done(json => {
        buscar();
        alertify.success(json)
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}