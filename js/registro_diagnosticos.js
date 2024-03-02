document.addEventListener("DOMContentLoaded", function () {
    cargarDiagnosticos();
});

function cargarDiagnosticos() {
    fetch("http://127.0.0.1:8000/get_diagnosticos")
        .then(response => response.json())
        .then(data => {
            mostrarDiagnosticos(data);
        })
        .catch(error => {
            console.error("Error al cargar los diagnósticos:", error);
        });
}

function mostrarDiagnosticos(data) {
    const dataTable = $('#dataTable').DataTable();

    // Limpiar la tabla antes de agregar nuevos registros
    dataTable.clear();

    if (data.length > 0) {
        data.forEach(diagnostico => {
            dataTable.row.add([
                diagnostico.diagnostico_id,
                diagnostico.usuario_id,
                diagnostico.Pregnancies,
                diagnostico.Glucose,
                diagnostico.BloodPressure,
                diagnostico.SkinThickness,
                diagnostico.Insulin,
                diagnostico.BMI,
                diagnostico.DiabetesPedigreeFunction,
                diagnostico.Age,
                diagnostico.resultado_diagnostico,
                diagnostico.fecha_diagnostico
            ]).draw();
        });
    }
}
