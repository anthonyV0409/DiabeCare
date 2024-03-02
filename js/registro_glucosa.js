document.addEventListener("DOMContentLoaded", function () {
    const modalVisto = localStorage.getItem("recordatorioModalVisto");

    // Si el modal no ha sido visto en esta sesión o está en modo prueba, mostrarlo
    if (!modalVisto || modalVisto === "test") {
        $('#recordatorioModal').modal('show');
        
        // Almacenar un indicador en localStorage
        localStorage.setItem("recordatorioModalVisto", "true");
    }

    // Agregar evento al cerrar el modal
    $('#recordatorioModal').on('hidden.bs.modal', function () {
        // Al cerrar el modal, reiniciar el indicador en localStorage
        localStorage.removeItem("recordatorioModalVisto");
    });

    // Agregar evento para la recarga de la página
    window.addEventListener("beforeunload", function () {
        // Antes de recargar la página, reiniciar el indicador en localStorage
        localStorage.removeItem("recordatorioModalVisto");
    });
});

document.getElementById("recordatorioModalEntendidoBtn").addEventListener("click", function () {
    // Al hacer clic en "Entendido", reiniciar el indicador en localStorage
    localStorage.removeItem("recordatorioModalVisto");
});

document.getElementById("cerrarModal").addEventListener("click", function () {
    // Al hacer clic en el enlace "Anote la lectura aquí" o en la "x" para cerrar, reiniciar el indicador en localStorage
    localStorage.removeItem("recordatorioModalVisto");
    $('#recordatorioModal').modal('hide');
});

document.getElementById("glucose-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const glucoseLevel = document.getElementById("glucose-level").value;

    if (!validateGlucoseForm(glucoseLevel)) {
        $('#errorModal').modal('show');
        return;
    }

    const formData = {
        "usuario_id": obtenerUsuarioId(),
        "nivel_glucosa": parseFloat(glucoseLevel),
    };

    fetch("http://127.0.0.1:8000/create_registro_glucosa", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        //Mostrar modal de registro exitoso
        $('#registroExitosoModal').modal('show');
        // Limpiar el formulario después del registro exitoso
        document.getElementById("glucose-form").reset();
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        if (error.detail) {
            console.error("Detalles del error:", error.detail);
        }
        $('#errorModal').modal('show');
    });
});

function validateGlucoseForm(glucoseLevel) {
    if (!glucoseLevel) {
        return false;
    }

    if (parseFloat(glucoseLevel) <= 0) {
        alert("Por favor, ingrese un nivel de glucosa válido.");
        return false;
    }

    return true;
}

function obtenerUsuarioId() {
    const usuarioData = JSON.parse(localStorage.getItem("Usuario"));
    return usuarioData.usuario.usuario_id;
}
