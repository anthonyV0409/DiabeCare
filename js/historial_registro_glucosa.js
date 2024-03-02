document.addEventListener("DOMContentLoaded", function () {
    cargarHistorial();
    let paginacionGlucosaPrevious = document.getElementById("paginacion-glucosa-previous");
    let paginacionGlucosaNext = document.getElementById("paginacion-glucosa-next");

    paginacionGlucosaPrevious.addEventListener('click', clickPrevious);
    paginacionGlucosaNext.addEventListener('click', clickNext);
});

let currentPage = 1;
const recordsPerPage = 10;
let totalPages;

function clickPrevious() {
    if (currentPage > 1) {
        currentPage--;
        cargarHistorial();
        actualizarBotonesPaginacion();
    }
}

function clickNext() {
    if (currentPage < totalPages) {
        currentPage++;
        cargarHistorial();
        actualizarBotonesPaginacion();
    }
}

function cargarHistorial() {
    const usuarioId = obtenerUsuarioId(); 

    fetch(`http://127.0.0.1:8000/get_historial_registro_glucosa/${usuarioId}`)
        .then(response => response.json())
        .then(data => {
            totalPages = Math.ceil(data.length / recordsPerPage);
            mostrarHistorial(data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage));
            actualizarBotonesPaginacion();
        })
        .catch(error => {
            console.error("Error al cargar el historial:", error);
        });
}

function mostrarHistorial(data) {
    const historialBody = document.getElementById("historial-body");

    // Limpiar la tabla antes de agregar nuevos registros
    historialBody.innerHTML = "";

    if (data.length > 0) {
        let contador = ((currentPage - 1) * recordsPerPage) + 1; // Calcular el contador inicial
        data.forEach(registro => {
            const row = historialBody.insertRow();

            const cellContador = row.insertCell(0);
            cellContador.textContent = contador++; // Agregar contador a la primera celda

            const cellNivelGlucosa = row.insertCell(1);
            const cellDiagnostico = row.insertCell(2);  // Nueva celda para el diagnóstico
            const cellFecha = row.insertCell(3);       // Ajustar índice para la fecha

            cellNivelGlucosa.textContent = registro.nivel_glucosa;

            // Asignar el diagnóstico según las condiciones
            const nivelGlucosa = parseFloat(registro.nivel_glucosa);
            if (nivelGlucosa <70) {
                cellDiagnostico.textContent = "Nivel bajo (Hipoglucemia)";
                cellDiagnostico.classList.add("text-danger");
                cellDiagnostico.classList.add("fw-bold");
                
            } else if (nivelGlucosa >= 70 && nivelGlucosa <= 99) {
                cellDiagnostico.textContent = "Nivel normal (antes de comida)";
                cellDiagnostico.classList.add("text-success");
                cellDiagnostico.classList.add("fw-bold");
            } else if (nivelGlucosa >= 100 && nivelGlucosa <= 125) {
                cellDiagnostico.textContent = "Prediabetes (antes de comida)";
                cellDiagnostico.classList.add("text-warning");
                cellDiagnostico.classList.add("fw-bold");
            } else if (nivelGlucosa >= 126) {
                cellDiagnostico.textContent = "Diabetes (antes de comida)";
                cellDiagnostico.classList.add("text-danger");
                cellDiagnostico.classList.add("fw-bold");
            } else {
                cellDiagnostico.textContent = "Sin diagnóstico";
            }

            // Formatear la fecha antes de agregarla a la celda
            const fechaRegistro = new Date(registro.fecha_registro);
            cellFecha.textContent = fechaRegistro.toLocaleString();
        });
    } else {
        const row = historialBody.insertRow();
        const cellEmpty = row.insertCell(0);
        cellEmpty.colSpan = 4;  // Ajustar el colspan para las nuevas celdas
        cellEmpty.textContent = "No hay registros disponibles.";
    }
}

function actualizarBotonesPaginacion() {
    let paginacionGlucosaPrevious = document.getElementById("paginacion-glucosa-previous");
    let paginacionGlucosaNext = document.getElementById("paginacion-glucosa-next");

    // Desactivar o activar el botón 'Anterior' según la página actual
    if (currentPage === 1) {
        paginacionGlucosaPrevious.parentElement.classList.add("disabled");
    } else {
        paginacionGlucosaPrevious.parentElement.classList.remove("disabled");
    }

    // Desactivar o activar el botón 'Siguiente' según la página actual
    if (currentPage === totalPages) {
        paginacionGlucosaNext.parentElement.classList.add("disabled");
    } else {
        paginacionGlucosaNext.parentElement.classList.remove("disabled");
    }
}

function obtenerUsuarioId() {
    const usuarioData = JSON.parse(localStorage.getItem("Usuario"));
    return usuarioData.usuario.usuario_id;
}
