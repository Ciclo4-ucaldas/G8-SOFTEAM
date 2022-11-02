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
                        title: 'Reporte de pedidos',
                        exportOptions: {
                            columns:[0,1,2,3,4]
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fas fa-file-excel"></i>',
                        autoFilter: true,
                        titleAttr:"Excel",
                        title: 'Reporte de pedidos',
                        exportOptions: {
                            columns:[0,1,2,3,4]
                        }
                    },
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fas fa-copy"></i>',
                        titleAttr:"Copiar",
                        title: 'Reporte de pedidos',
                        exportOptions: {
                            columns:[0,1,2,3,4]
                        }
                    },
                    {
                        extend: 'print',
                        text: '<i class="fas fa-print"></i>',
                        titleAttr:"Imprimir",
                        title: 'Reporte de pedidos',
                        exportOptions: {
                            columns:[0,1,2,3,4]
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
function create(x) {
    if (x.length==0) {
        let b = "<h1 class='text-center mt-5'>No Existen Pedidos En El Sistema!!!</h1>"
        return $("#respuesta").html(b);
    }
    arreglo=[];
    for (const value of x) {
        if (!arreglo[value.id_pedido]) {
            arreglo[value.id_pedido] = new Array(value);
        } else {
            arreglo[value.id_pedido].push(value);
        }
    }
    let b;
    let datos = `<table id='myTable' class='table table-dark table-bordered table-hover text-center mb-2' border=3><thead><tr><th>Nombre</th><th>Mesa</th><th>Empleado</th><th>Total</th><th>Estado</th><th>Modificar</th><th>Eliminar</th></tr></thead><tbody>`;
    for (const iterator of arreglo) {
        if (iterator!=null) {
            datos += `<tr class='bgTable'>
            <td class="pedidoCocinaTable" onclick="pedido(${iterator[0].id_pedido});">${iterator[0].nombrePersona}</td>
            <td class="pedidoCocinaTable" onclick="pedido(${iterator[0].id_pedido});">${iterator[0].nombreMesa}</td>
            <td class="pedidoCocinaTable" onclick="pedido(${iterator[0].id_pedido});">${iterator[0].nombreUsuario}</td>
            <td class="pedidoCocinaTable" onclick="pedido(${iterator[0].id_pedido});">$ ${iterator[0].total} USD</td>
            <td class="pedidoCocinaTable" onclick="pedido(${iterator[0].id_pedido});">${iterator[0].estado}</td>`;
            datos += `<td><a class="btn btn-primary" onclick="modificar(${iterator[0].id_pedido},'${iterator[0].estado}',${iterator[0].id_auditoria});"><i class="fas fa-edit"></i></a></td>`;
            datos += `<td><a class="btn btn-danger" onclick="eliminar(${iterator[0].id_auditoria},${iterator[0].id_pedido});"><i class="fas fa-trash-alt"></i></a></td></tr>`;
        }
    }
    datos+="</tbody></table>"
    $("#respuesta").html(datos);
}
function pedido(x) {
    localStorage.setItem("pedidoMesero",JSON.stringify(new Array(arreglo[x])));
    window.location.href="pedido.frm.php";
}
function modificar(x,y,z) {
    $("#txtEstado").val("modificando");
    $("#txtIdAuditoria").val(z);
    $.ajax({
        url: "../../controlador/pedido.delete.php",
        type: "POST",
        datatype: "JSON",
        data: $("#pedidosFrm").serialize()
    }).done(json => {
        localStorage.setItem("pedidoMesero",JSON.stringify(new Array(arreglo[x],y,z)));
        window.location.href="pedido.frm.php";
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}
function eliminar(x,y) {
    $("#txtEstado").val("cancelado");
    $("#txtIdAuditoria").val(x);
    $("#txtIdPedido").val(y);
    $.ajax({
        url: "../../controlador/pedido.deleteCantidades.php",
        type: "POST",
        datatype: "JSON",
        data: $("#pedidosFrm").serialize()
    }).done(json => {
    }).fail((xhr, status, error) => {
        console.log(error);
    })
    $.ajax({
        url: "../../controlador/pedido.delete.php",
        type: "POST",
        datatype: "JSON",
        data: $("#pedidosFrm").serialize()
    }).done(json => {
        alertify.error("Se Elimino El Pedido");
        setTimeout(() => {
            window.location.href = "pedidos.frm.php";
        }, 600);
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}