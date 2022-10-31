$(document).ready(() => {
    sesionRoles();
    $(document).on('click', '.fa-sign-in-alt', () => {
        $.ajax({
            url: "../../controlador/login.delete.php",
            type: "POST",
            datatype: "JSON",
            data: null
        }).done(json => {
            window.location.href="../admin/login.frm.php";
        }).fail((xhr, status, error) => {
            console.log(error);
        });
    });
});
function sesionRoles() {
    $.ajax({
        url: "../../controlador/login.read.php",
        type: "POST",
        datatype: "JSON",
        data: null
    }).done(json => {
        json=JSON.parse(json);
        $(".admin").html(`<i class="far fa-user"></i> ${json[0]} ${json[1]}`)
    }).fail((xhr, status, error) => {
        console.log(error);
    });
}