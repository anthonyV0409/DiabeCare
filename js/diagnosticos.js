document.addEventListener("DOMContentLoaded", function () {
    const modalVisto = localStorage.getItem("recordatorioModalVisto");

    // ... (código existente)

    document.getElementById("diagnostic-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const formFields = ["pregnancies", "glucose", "blood_pressure", "skin_thickness", "insulin", "bmi", "diabetes_pedigree", "age"];
        const isAnyFieldEmpty = formFields.some(field => !document.getElementById(field).value.trim());

        if (isAnyFieldEmpty) {
            // Mostrar modal de error
            $('#errorModal').modal('show');
            return;
        }

        const formData = {
            "usuario_id": obtenerUsuarioId(),
            "Pregnancies": document.getElementById("pregnancies").value,
            "Glucose": document.getElementById("glucose").value,
            "BloodPressure": document.getElementById("blood_pressure").value,
            "SkinThickness": document.getElementById("skin_thickness").value,
            "Insulin": document.getElementById("insulin").value,
            "BMI": document.getElementById("bmi").value,
            "DiabetesPedigreeFunction": document.getElementById("diabetes_pedigree").value,
            "Age": document.getElementById("age").value,
        };

        fetch("http://127.0.0.1:8000/create_diagnosticos", {
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
            
            // Mostrar modal de registro exitoso
            $('#registroExitosoModal').modal('show');

            // Mostrar modal de resultado de diagnóstico y recomendaciones
            const diagnosisResultModal = $('#diagnosisResultModal');
            const diagnosisResultContent = $('#diagnosisResultContent');

            if (data.resultado_diagnostico === 0) {
                // La persona es saludable
                diagnosisResultModal.find('.modal-title').text('Resultado del Diagnóstico: Saludable');
                diagnosisResultContent.html('<p>¡Felicidades! Según nuestro diagnóstico, eres saludable.</p><p>Recomendaciones para mantener tu salud:</p><ul><li>Mantén una dieta equilibrada con una variedad de alimentos, incluyendo frutas, verduras, granos enteros y proteínas magras.</li><li>Realiza ejercicio regularmente para fortalecer tu cuerpo y mejorar tu bienestar general.</li><li>Asegúrate de dormir lo suficiente para mantener un buen equilibrio físico y mental.</li></ul>');
            } else if (data.resultado_diagnostico === 1) {
                // La persona es diabética
                diagnosisResultModal.find('.modal-title').text('Resultado del Diagnóstico: Diabético');
                diagnosisResultContent.html('<p>Lamentablemente, nuestro diagnóstico indica que podrías tener diabetes.</p><p>Recomendaciones para gestionar la diabetes:</p><ul><li>Mantén un monitoreo regular de tus niveles de azúcar en sangre</li><li>Sigue una dieta balanceada y controlada en carbohidratos.</li><li>Incluye proteínas magras en tus comidas: Las proteínas magras, como el pollo, el pescado y las legumbres, pueden ayudarte a sentirte satisfecho sin aumentar tus niveles de azúcar en sangre.</li><li>Incorpora actividad física regular en tu rutina, adaptada a tus necesidades y capacidades.</li></ul>');
            }
            
        
            // Mostrar el modal de resultado de diagnóstico
            diagnosisResultModal.modal('show');
            console.log("Resultado del diagnóstico:", data.resultado_diagnostico);

            // Limpiar el formulario después del registro exitoso
            document.getElementById("diagnostic-form").reset();
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            if (error.detail) {
                console.error("Detalles del error:", error.detail);
            }
            $('#errorModal').modal('show');
        });
    });

    

    function validateDiagnosticForm(pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigree, age) {
        // Agrega lógica de validación según tus requisitos
        // Por ejemplo, verifica que los valores sean números válidos y están dentro de un rango aceptable
        if (isNaN(pregnancies) || isNaN(glucose) || isNaN(bloodPressure) || isNaN(skinThickness) || isNaN(insulin) || isNaN(bmi) || isNaN(diabetesPedigree) || isNaN(age)) {
            return false;
        }
    
        return true;
    }
    
});

function obtenerUsuarioId() {
    // Implementa la lógica para obtener el ID del usuario según tus necesidades
    const usuarioData = JSON.parse(localStorage.getItem("Usuario"));
    return usuarioData.usuario.usuario_id;
}
