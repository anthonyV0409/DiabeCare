document.getElementById("formulario-de-registro").addEventListener("submit", function (event) {
  event.preventDefault();

  // Verificar si todos los campos están llenos
  if (!validateForm()) {
    // Mostrar modal de error
    showErrorModal("Por favor, complete todos los campos.");
    return;
  }

  // Obtener datos del formulario
  const formData = new FormData(event.target);
  const jsonData = {};

  formData.forEach((value, key) => {
    jsonData[key] = value;
  });

  // Verificar si el usuario o correo ya existen
  verificarUsuarioCorreo(jsonData);

});

function verificarUsuarioCorreo(userData) {
  console.log("Verifying user and email...");
  fetch("http://127.0.0.1:8000/verificar_usuario_correo", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  .then(response => response.json())
  .then(data => {
    // Verificar si el usuario o correo ya existen
    if (data.usuario_existente || data.correo_existente) {
      // Mostrar modal de usuario o correo existente
      $('#usuarioCorreoExistenteModal').modal('show');
    } else {
      // Si no existen, proceder con el registro
      registrarUsuario(userData);
    }
  })
  .catch(error => {
    console.error("Error en la verificación de usuario y correo:", error);
  });
}

function registrarUsuario(userData) {
  // Registro de usuario
  fetch("http://127.0.0.1:8000/create_user", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Mostrar modal de registro exitoso
    $('#registroExitosoModal').modal('show');
    document.getElementById("formulario-de-registro").reset();
  })
  .catch(error => {
    console.error("Error en la solicitud de registro:", error);
  });
}

function validateForm() {
  // Obtener todos los campos del formulario
  console.log("Validating form...");
  const inputs = document.getElementById("formulario-de-registro").querySelectorAll("input");

  // Verificar si algún campo está vacío
  for (const input of inputs) {
    if (!input.value) {
      // Mostrar modal de error
      showErrorModal("Por favor, complete todos los campos.");
      return false;
    }
  }

  // Validar formato de correo electrónico
  const emailInput = document.getElementsByName("correo")[0];
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(emailInput.value)) {
    // Mostrar modal de correo electrónico inválido
    showErrorModal("Por favor, ingrese un correo electrónico válido.");
    return false;
  }

  // Validar formato de fecha de nacimiento (opcional)
  const dobInput = document.getElementsByName("fecha_nacimiento")[0];
  const dobDate = new Date(dobInput.value);
  const currentDate = new Date();
  if (dobDate >= currentDate) {
    // Mostrar modal de fecha de nacimiento inválida
    showErrorModal("La fecha de nacimiento debe ser anterior a la fecha actual.");
    return false;
  }

  // Validar formato de número de teléfono
  const phoneInput = document.getElementsByName("celular")[0];
  const phoneRegex = /^\d{10}$/; // Asumiendo un número de 10 dígitos
  if (!phoneRegex.test(phoneInput.value)) {
    // Mostrar modal de número inválido
    showErrorModal("Por favor, ingrese un número de teléfono válido (10 dígitos).");
    return false;
  }

  return true;
}


function showErrorModal(message) {
  // Muestra el modal de error con el mensaje específico
  console.log("Mostrando modal de error:", message);
  document.getElementById("errorModalBody").textContent = message;
  $('#errorModal').modal('show');
}


// Cerrar el modal al hacer clic en el botón "Cerrar" o en la 'x'
$('#registroExitosoModal').on('click', '.btn-primary, .close', function() {
  $('#registroExitosoModal').modal('hide');
  // Limpiar el formulario
  document.getElementById("formulario-de-registro").reset();
});

// Limpiar el formulario al cargar la página
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("formulario-de-registro").reset();
});