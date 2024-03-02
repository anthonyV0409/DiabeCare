document.addEventListener("DOMContentLoaded", function () {
    cargarHistorial();
    let paginacionDiagnosticoPrevious = document.getElementById("paginacion-diagnostico-previous");
    let paginacionDiagnosticoNext = document.getElementById("paginacion-diagnostico-next");

    paginacionDiagnosticoPrevious.addEventListener('click', clickPrevious);
    paginacionDiagnosticoNext.addEventListener('click', clickNext);
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

    fetch(`http://127.0.0.1:8000/get_historial_diagnosticos/${usuarioId}`)
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
    const historialBody = document.getElementById("historial-diagnosticos-body");

    historialBody.innerHTML = "";

    if (data.length > 0) {
        let contador = ((currentPage - 1) * recordsPerPage) + 1; // Calcular el contador inicial
        data.forEach(diagnostico => {
            const row = historialBody.insertRow();

            const cell = row.insertCell();
            cell.textContent = contador++; // Agregar contador a la primera celda

            const columns = [
                'Pregnancies',
                'Glucose',
                'BloodPressure',
                'SkinThickness',
                'Insulin',
                'BMI',
                'DiabetesPedigreeFunction',
                'Age',
                'resultado_diagnostico',
                'fecha_diagnostico'
            ];

            columns.forEach(column => {
                const cell = row.insertCell();

                if (column === 'resultado_diagnostico') {
                    if (diagnostico[column] === 'Saludable') {
                        cell.textContent = diagnostico[column];
                        cell.classList.add("text-success");
                        cell.classList.add("fw-bold");
                    } else if (diagnostico[column] === 'Diabetico') {
                        cell.classList.add("text-danger");
                        cell.classList.add("fw-bold");
                        cell.textContent = diagnostico[column];
                    }
                } else if (column === 'fecha_diagnostico') {
                    // Formatear la fecha antes de agregarla a la celda
                    const fechaDiagnostico = new Date(diagnostico[column]);
                    cell.textContent = fechaDiagnostico.toLocaleString();
                } else {
                    cell.textContent = diagnostico[column];
                }
            });
        });
    } else {
        const row = historialBody.insertRow();
        const cellEmpty = row.insertCell();
        cellEmpty.colSpan = columns.length; 
        cellEmpty.textContent = "No hay diagnósticos disponibles.";
    }
}

function actualizarBotonesPaginacion() {
    let paginacionDiagnosticoPrevious = document.getElementById("paginacion-diagnostico-previous");
    let paginacionDiagnosticoNext = document.getElementById("paginacion-diagnostico-next");

    // Desactivar o activar el botón 'Anterior' según la página actual
    if (currentPage === 1) {
        paginacionDiagnosticoPrevious.parentElement.classList.add("disabled");
    } else {
        paginacionDiagnosticoPrevious.parentElement.classList.remove("disabled");
    }

    // Desactivar o activar el botón 'Siguiente' según la página actual
    if (currentPage === totalPages) {
        paginacionDiagnosticoNext.parentElement.classList.add("disabled");
    } else {
        paginacionDiagnosticoNext.parentElement.classList.remove("disabled");
    }
}

function obtenerUsuarioId() {
    const usuarioData = JSON.parse(localStorage.getItem("Usuario"));
    return usuarioData.usuario.usuario_id;
}
