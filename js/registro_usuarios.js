document.addEventListener("DOMContentLoaded", function () {
    cargarUsuarios();
});

function cargarUsuarios() {
    fetch("http://127.0.0.1:8000/get_users")
        .then(response => response.json())
        .then(data => {
            mostrarUsuarios(data);
        })
        .catch(error => {
            console.error("Error al cargar los usuarios:", error);
        });
}

function mostrarUsuarios(data) {
    const dataTable = $('#dataTable').DataTable();

    // Limpiar la tabla antes de agregar nuevos registros
    dataTable.clear();

    if (data.length > 0) {
        data.forEach(usuario => {
            dataTable.row.add([
                usuario.usuario_id,
                usuario.usuario,
                usuario.nombres,
                usuario.apellidos,
                usuario.correo,
                usuario.celular,
                usuario.fecha_nacimiento,
                usuario.tipo_diabetes,
                usuario.nivel_fisico,
                usuario.peso,
                usuario.fecha_registro,
                usuario.rol_id
            ]).draw();
        });
    }
}
