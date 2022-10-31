let ctx = document.getElementById('myChartSemana');
let ctx2 = document.getElementById('myChartMes');
let ctx3 = document.getElementById('myChartAño');
const diaSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
let myChart, menor, mayor, dias, mes2, año2, resultado, diasMes2, consulta, y = null, incremento, fecha = new Date(), arraySemana = new Array(), arrayMeses = new Array(), arrayAños = new Array();
function mesMenor() {
    switch (fecha.toLocaleDateString("es-ES", { weekday: "long" })) {
        case 'domingo':
            dias = parseInt(fecha.toLocaleDateString("es-ES", { day: 'numeric' }));
            menor = false;
            mes2 = parseInt(fecha.toLocaleDateString("es-ES", { month: 'numeric' }));
            año2 = parseInt(fecha.toLocaleDateString("es-ES", { year: 'numeric' }));
            resultado = `${año2}/${mes2}/${dias}`;
            break;
        case 'lunes':
            dias = parseInt(fecha.toLocaleDateString("es-ES", { day: 'numeric' }));
            menor = dias - 1 < 1 ? true : false;
            mes2 = parseInt(fecha.toLocaleDateString("es-ES", { month: 'numeric' }));
            año2 = parseInt(fecha.toLocaleDateString("es-ES", { year: 'numeric' }));
            if (menor) {
                if (mes2 == 1) {
                    resultado = `${año2 - 1}/12/31`;
                } else {
                    diasMes2 = new Date(año2, mes2 - 1, 0).getDate();
                    resultado = `${año2}/${mes2 - 1}/${diasMes2}`;
                }
            } else {
                resultado = `${año2}/${mes2}/${dias - 1}`;
            }
            break;
        case 'martes':
            dias = parseInt(fecha.toLocaleDateString("es-ES", { day: 'numeric' }));
            menor = dias - 2 < 1 ? true : false;
            mes2 = parseInt(fecha.toLocaleDateString("es-ES", { month: 'numeric' }));
            año2 = parseInt(fecha.toLocaleDateString("es-ES", { year: 'numeric' }));
            if (menor) {
                if (mes2 == 1) {
                    resultado = `${año2 - 1}/12/30`;
                } else {
                    diasMes2 = new Date(año2, mes2 - 1, 0).getDate();
                    resultado = `${año2}/${mes2 - 1}/${diasMes2 - 1}`;
                }
            } else {
                resultado = `${año2}/${mes2}/${dias - 2}`;
            }
            break;
        case 'miércoles':
            dias = parseInt(fecha.toLocaleDateString("es-ES", { day: 'numeric' }));
            menor = dias - 3 < 1 ? true : false;
            mes2 = parseInt(fecha.toLocaleDateString("es-ES", { month: 'numeric' }));
            año2 = parseInt(fecha.toLocaleDateString("es-ES", { year: 'numeric' }));
            if (menor) {
                if (mes2 == 1) {
                    resultado = `${año2 - 1}/12/29`;
                } else {
                    diasMes2 = new Date(año2, mes2 - 1, 0).getDate();
                    resultado = `${año2}/${mes2 - 1}/${diasMes2 - 2}`;
                }
            } else {
                resultado = `${año2}/${mes2}/${dias - 3}`;
            }
            break;
        case 'jueves':
            dias = parseInt(fecha.toLocaleDateString("es-ES", { day: 'numeric' }));
            menor = dias - 4 < 1 ? true : false;
            mes2 = parseInt(fecha.toLocaleDateString("es-ES", { month: 'numeric' }));
            año2 = parseInt(fecha.toLocaleDateString("es-ES", { year: 'numeric' }));
            if (menor) {
                if (mes2 == 1) {
                    resultado = `${año2 - 1}/12/28`;
                } else {
                    diasMes2 = new Date(año2, mes2 - 1, 0).getDate();
                    resultado = `${año2}/${mes2 - 1}/${diasMes2 - 3}`;
                }
            } else {
                resultado = `${año2}/${mes2}/${dias - 4}`;
            }
            break;
        case 'viernes':
            dias = parseInt(fecha.toLocaleDateString("es-ES", { day: 'numeric' }));
            menor = dias - 5 < 1 ? true : false;
            mes2 = parseInt(fecha.toLocaleDateString("es-ES", { month: 'numeric' }));
            año2 = parseInt(fecha.toLocaleDateString("es-ES", { year: 'numeric' }));
            if (menor) {
                mes2 = parseInt(fecha.toLocaleDateString("es-ES", { month: 'numeric' }));
                año2 = parseInt(fecha.toLocaleDateString("es-ES", { year: 'numeric' }));
                if (mes2 == 1) {
                    resultado = `${año2 - 1}/12/27`;
                } else {
                    diasMes2 = new Date(año2, mes2 - 1, 0).getDate();
                    resultado = `${año2}/${mes2 - 1}/${diasMes2 - 4}`;
                }
            } else {
                resultado = `${año2}/${mes2}/${dias - 5}`;
            }
            break;
        case 'sábado':
            dias = parseInt(fecha.toLocaleDateString("es-ES", { day: 'numeric' }));
            menor = dias - 6 < 1 ? true : false;
            mes2 = parseInt(fecha.toLocaleDateString("es-ES", { month: 'numeric' }));
            año2 = parseInt(fecha.toLocaleDateString("es-ES", { year: 'numeric' }));
            if (menor) {
                if (mes2 == 1) {
                    resultado = `${año2 - 1}/12/26`;
                } else {
                    diasMes2 = new Date(año2, mes2 - 1, 0).getDate();
                    resultado = `${año2}/${mes2 - 1}/${diasMes2 - 5}`;
                }
            } else {
                resultado = `${año2}/${mes2}/${dias - 6}`;
            }
            break;
        default:
            break;
    }
}
function week() {
    mesMenor();
    $("#fecha").val(resultado);
    $.ajax({
        url: "../../controlador/pedido.readDashboardWeek.php",
        type: "POST",
        datatype: "JSON",
        data: $("#dashboardFrm").serialize()
    }).done(json => {
        json = JSON.parse(json);
        if (json.length > 0) {
            for (const iterator of json) {
                if (iterator.fecha_creacion.slice(0, -16) == y) {
                    incremento += parseInt(iterator.total);
                } else {
                    y = iterator.fecha_creacion.slice(0, -16);
                    incremento = parseInt(iterator.total);
                }
                arraySemana[`${diaSemana[new Date(iterator.fecha_creacion).getDay()]}`] = incremento
            }
            myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                    datasets: [{
                        label: 'Total ',
                        data: [arraySemana["Domingo"] == undefined ? 0 : arraySemana["Domingo"], arraySemana["Lunes"] == undefined ? 0 : arraySemana["Lunes"], arraySemana["Martes"] == undefined ? 0 : arraySemana["Martes"], arraySemana["Miércoles"] == undefined ? 0 : arraySemana["Miércoles"], arraySemana["Jueves"] == undefined ? 0 : arraySemana["Jueves"], arraySemana["Viernes"] == undefined ? 0 : arraySemana["Viernes"], arraySemana["Sábado"] == undefined ? 0 : arraySemana["Sábado"]],
                        backgroundColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 255, 0, 1)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 255, 0, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}
function month() {
    let fechaFin = `${fecha.getFullYear()}/${fecha.getMonth() + 1}/${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}.${fecha.getMilliseconds()}999`;
    let fechaInicio = `${new Date().getFullYear()}/01/01 00:00:00.000000`;
    $("#fechaInicio").val(fechaInicio);
    $("#fechaFin").val(fechaFin);
    $.ajax({
        url: "../../controlador/pedido.readDashboardMonth.php",
        type: "POST",
        datatype: "JSON",
        data: $("#dashboardFrm").serialize()
    }).done(json => {
        json = JSON.parse(json);
        if (json.length > 0) {
            for (const iterator of json) {
                if (iterator.fecha_creacion.slice(5, -19) == y) {
                    incremento += parseInt(iterator.total);
                } else {
                    y = iterator.fecha_creacion.slice(5, -19);
                    incremento = parseInt(iterator.total);
                }
                arrayMeses[parseInt(y)] = incremento
            }
            myChart = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    datasets: [{
                        label: 'Total ',
                        data: [arrayMeses[1] == undefined ? 0 : arrayMeses[1], arrayMeses[2] == undefined ? 0 : arrayMeses[2], arrayMeses[3] == undefined ? 0 : arrayMeses[3], arrayMeses[4] == undefined ? 0 : arrayMeses[4], arrayMeses[5] == undefined ? 0 : arrayMeses[5], arrayMeses[6] == undefined ? 0 : arrayMeses[6], arrayMeses[7] == undefined ? 0 : arrayMeses[7], arrayMeses[8] == undefined ? 0 : arrayMeses[8], arrayMeses[9] == undefined ? 0 : arrayMeses[9], arrayMeses[10] == undefined ? 0 : arrayMeses[10], arrayMeses[11] == undefined ? 0 : arrayMeses[11], arrayMeses[12] == undefined ? 0 : arrayMeses[12]],
                        backgroundColor: [
                            'rgba(191, 63, 63, 1)',
                            'rgba(191, 127, 63, 1)',
                            'rgba(191, 191, 63, 1)',
                            'rgba(127, 191, 63, 1)',
                            'rgba(63, 191, 63, 1)',
                            'rgba(63, 191, 127, 1)',
                            'rgba(63, 191, 191, 1)',
                            'rgba(63, 127, 191, 1)',
                            'rgba(63, 63, 191, 1)',
                            'rgba(127, 63, 191, 1)',
                            'rgba(191, 63, 191, 1)',
                            'rgba(191, 63, 127, 1)'
                        ],
                        borderColor: [
                            'rgba(191, 63, 63, 1)',
                            'rgba(191, 127, 63, 1)',
                            'rgba(191, 191, 63, 1)',
                            'rgba(127, 191, 63, 1)',
                            'rgba(63, 191, 63, 1)',
                            'rgba(63, 191, 127, 1)',
                            'rgba(63, 191, 191, 1)',
                            'rgba(63, 127, 191, 1)',
                            'rgba(63, 63, 191, 1)',
                            'rgba(127, 63, 191, 1)',
                            'rgba(191, 63, 191, 1)',
                            'rgba(191, 63, 127, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}
function year() {
    $.ajax({
        url: "../../controlador/pedido.readDashboardYear.php",
        type: "POST",
        datatype: "JSON",
        data: $("#dashboardFrm").serialize()
    }).done(json => {
        json = JSON.parse(json);
        if (json.length > 0) {
            for (const iterator of json) {
                if (iterator.fecha_creacion.slice(0, -22) == y) {
                    incremento += parseInt(iterator.total);
                } else {
                    y = iterator.fecha_creacion.slice(0, -22);
                    incremento = parseInt(iterator.total);
                }
                arrayAños[parseInt(y)] = incremento
            }
            myChart = new Chart(ctx3, {
                type: 'bar',
                data: {
                    labels: [`${new Date().getFullYear() - 5}`, `${new Date().getFullYear() - 4}`, `${new Date().getFullYear() - 3}`, `${new Date().getFullYear() - 2}`, `${new Date().getFullYear() - 1}`, `${new Date().getFullYear()}`],
                    datasets: [{
                        label: 'Total ',
                        data: [arrayAños[new Date().getFullYear() - 5] == undefined ? 0 : arrayAños[new Date().getFullYear() - 5], arrayAños[new Date().getFullYear() - 4] == undefined ? 0 : arrayAños[new Date().getFullYear() - 4], arrayAños[new Date().getFullYear() - 3] == undefined ? 0 : arrayAños[new Date().getFullYear() - 3], arrayAños[new Date().getFullYear() - 2] == undefined ? 0 : arrayAños[new Date().getFullYear() - 2], arrayAños[new Date().getFullYear() - 1] == undefined ? 0 : arrayAños[new Date().getFullYear() - 1], arrayAños[new Date().getFullYear()] == undefined ? 0 : arrayAños[new Date().getFullYear()]],
                        backgroundColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 255, 0, 1)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 255, 0, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}
$(document).on('change', '#selCanvas', () => {
    if ($("#selCanvas").val() == 1) {
        week();
        $("#myChartSemana")[0].hidden = false;
        $("#myChartMes")[0].hidden = true;
        $("#myChartAño")[0].hidden = true;

    } else if ($("#selCanvas").val() == 2) {
        month()
        $("#myChartSemana")[0].hidden = true;
        $("#myChartMes")[0].hidden = false;
        $("#myChartAño")[0].hidden = true;
    }
    else if ($("#selCanvas").val() == 3) {
        year()
        $("#myChartSemana")[0].hidden = true;
        $("#myChartMes")[0].hidden = true;
        $("#myChartAño")[0].hidden = false;
    }
});
week();
pedidos();
function pedidos() {
    $.ajax({
        url: "../../controlador/pedido.readHistorialDashboard.php",
        type: "POST",
        datatype: "JSON",
        data: $("#dashboardFrm").serialize()
    }).done(json => {
        json = JSON.parse(json)
        if (json.length > 0) {
            let datos = "<table id='myTable' class='table table-dark table-bordered table-hover text-center' border=3><thead><tr><th>Usuario</th><th>Mesa</th><th>Personal</th><th>Fecha</th><th>Total</th></tr></thead>";
            datos += "<tbody>";
            $.each(json, (key, value) => {
                datos += `<tr class='bgTable'><td>${value.nombrePersona}</td>`;
                datos += `<td>${value.nombreMesa}</td>`;
                datos += `<td>${value.nombreUsuario} ${value.apellido}</td>`;
                datos += `<td>${new Date(value.fecha_creacion).toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}</td>`;
                datos += `<td>${value.total}</td></tr>`;
            });
            datos += `</tbody></table>`;
            $("#respuesta").html(datos);
            let table = $('#myTable').DataTable({
                "language": {
                    "url": "../../componente/libreria/js/Spanish.json",
                    "buttons": {
                        copyTitle: "Registro(s) Copiado(s)",
                        copySuccess: {
                            _: '%d Registros Copiados',
                            1: '%d Registros Copiado'
                        }
                    }
                },
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'pdfHtml5',
                        text: '<i class="fas fa-file-pdf"></i>',
                        download: 'open',
                        titleAttr: "PDF",
                        title: 'Reporte de pedidos',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4]
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fas fa-file-excel"></i>',
                        autoFilter: true,
                        titleAttr: "Excel",
                        title: 'Reporte de pedidos',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4]
                        }
                    },
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fas fa-copy"></i>',
                        titleAttr: "Copiar",
                        title: 'Reporte de pedidos',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4]
                        }
                    },
                    {
                        extend: 'print',
                        text: '<i class="fas fa-print"></i>',
                        titleAttr: "Imprimir",
                        title: 'Reporte de pedidos',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4]
                        }
                    }
                ]
            });
            //Creamos una fila en el head de la tabla y lo clonamos para cada columna
            $('#myTable thead tr').clone(true).appendTo('#myTable thead');

            $('#myTable thead tr:eq(1) th').each(function (i) {
                let title = $(this).text(); //es el nombre de la columna
                $(this).html(`<input type="text" placeholder="Buscar ${title}" class="w-100">`);
                $('input', this).on('keyup change', function () {
                    if (table.column(i).search() !== this.value) {
                        table.column(i).search(this.value).draw();
                    }
                });
            });
        }
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}
$("#start_date").datepicker({
    "dateFormat": "yy-mm-dd"
});
$("#end_date").datepicker({
    "dateFormat": "yy-mm-dd"
});
$(document).on("click", "#filter", function () {
    let start_date = $("#start_date").val();
    let end_date = $("#end_date").val();

    if (start_date == "" || end_date == "") {
        alertify.error("Son requeridos los dos campos");
    } else {
        pedidosPersonalizados();
    }
});
$(document).on("click", "#reset", function () {
    $("#start_date").val("");
    $("#end_date").val("");
    pedidos();
});
pedidos();
function pedidos() {
    $.ajax({
        url: "../../controlador/pedido.readHistorialDashboard.php",
        type: "POST",
        datatype: "JSON",
        data: $("#dashboardFrm").serialize()
    }).done(json => {
        json = JSON.parse(json)
        if (json.length > 0) {
            historialPedidos(json)
        }
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}
function historialPedidos(m) {
    let datos = "<table id='myTable' class='table table-dark table-bordered table-hover text-center' border=3><thead><tr><th>Usuario</th><th>Mesa</th><th>Personal</th><th>Fecha</th><th>Total</th></tr></thead>";
    datos += "<tbody>";
    $.each(m, (key, value) => {
        datos += `<tr class='bgTable'><td>${value.nombrePersona}</td>`;
        datos += `<td>${value.nombreMesa}</td>`;
        datos += `<td>${value.nombreUsuario} ${value.apellido}</td>`;
        datos += `<td>${new Date(value.fecha_creacion).toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}</td>`;
        datos += `<td>${value.total}</td></tr>`;
    });
    datos += `</tbody></table>`;
    $("#respuesta").html(datos);
    let table = $('#myTable').DataTable({
        "language": {
            "url": "../../componente/libreria/js/Spanish.json",
            "buttons": {
                copyTitle: "Registro(s) Copiado(s)",
                copySuccess: {
                    _: '%d Registros Copiados',
                    1: '%d Registros Copiado'
                }
            }
        },
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i>',
                download: 'open',
                titleAttr: "PDF",
                title: 'Reporte de pedidos',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4]
                }
            },
            {
                extend: 'excelHtml5',
                text: '<i class="fas fa-file-excel"></i>',
                autoFilter: true,
                titleAttr: "Excel",
                title: 'Reporte de pedidos',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4]
                }
            },
            {
                extend: 'copyHtml5',
                text: '<i class="fas fa-copy"></i>',
                titleAttr: "Copiar",
                title: 'Reporte de pedidos',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4]
                }
            },
            {
                extend: 'print',
                text: '<i class="fas fa-print"></i>',
                titleAttr: "Imprimir",
                title: 'Reporte de pedidos',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4]
                }
            }
        ]
    });
    //Creamos una fila en el head de la tabla y lo clonamos para cada columna
    $('#myTable thead tr').clone(true).appendTo('#myTable thead');

    $('#myTable thead tr:eq(1) th').each(function (i) {
        let title = $(this).text(); //es el nombre de la columna
        $(this).html(`<input type="text" placeholder="Buscar ${title}" class="w-100">`);
        $('input', this).on('keyup change', function () {
            if (table.column(i).search() !== this.value) {
                table.column(i).search(this.value).draw();
            }
        });
    });
}
function pedidosPersonalizados() {
    $.ajax({
        url: "../../controlador/pedido.readHistorialDashboardPersonalizado.php",
        type: "POST",
        datatype: "JSON",
        data: $("#dashboardFrm").serialize()
    }).done(json => {
        json = JSON.parse(json)
        if (json.length > 0) {
            historialPedidos(json)
        }else{
            $("#respuesta").html(`<h2 class="text-center mt-4">No existen pedidos en ese rango de fechas</h2>`);
        }
    }).fail((xhr, status, error) => {
        console.log(error);
    })
}
$.datepicker.regional['es'] = {
    closeText: 'Cerrar',
    prevText: '< Ant',
    nextText: 'Sig >',
    currentText: 'Hoy',
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
    dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
    weekHeader: 'Sm',
    dateFormat: 'dd/mm/yy',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
    };
$.datepicker.setDefaults($.datepicker.regional['es']);