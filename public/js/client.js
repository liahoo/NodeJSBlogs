$(document).ready(() => {
 $(".sidenav").sidenav();
 $('.modal').modal();
 $(".action-delete").click((e1) => {
    $('.modal .btn-delete').click((e) => {
        deleteBlog(e1.currentTarget.id)
    })
 })
});
function deleteBlog(id) {
    if(!id) return;
    $.ajax({
        url: "/blogs/" + id,
        type: "DELETE",
        success: (result) => {
            console.log(result)
            location.reload()
        },
        failed: (err) => {
            console.log(err)
            window.alert("Can not delete now, ask Ruby why -_-!")
        }
    })
}
