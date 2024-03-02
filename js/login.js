document.getElementById("formulario-de-login").addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const jsonData = {};

    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    fetch("http://127.0.0.1:8000/login", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data.mensaje === "Inicio de sesión satisfactorio") {
                console.log('Rol ID del usuario:', data.usuario.rol_id);
                localStorage.setItem("Usuario", JSON.stringify(data));

                if (data.usuario.rol_id === 1 || data.usuario.rol_id === 2) {
                    // Mostrar el modal exitoso y pasar el rol como parámetro
                    mostrarModalExito(data.usuario.usuario, data.usuario.rol_id);
                } else {
                    alert('Inicio de sesión exitoso, pero el rol no está definido');
                }
            } else {
                mostrarModalError();
            }
        })  
        .catch(error => {
            console.error("Error en la solicitud:", error);
            if (error.detail) {
                console.error("Detalles del error:", error.detail);
            }
        });
});

function mostrarModalExito(nombreUsuario, rolUsuario) {
  const modalExito = new bootstrap.Modal(document.getElementById("modal-exito"));
  document.getElementById("nombre-usuario-modal").textContent = nombreUsuario;
  modalExito.show();

  // Establecer un temporizador para redirigir después de 2 segundos (2000 milisegundos)
  setTimeout(function () {
      if (rolUsuario === 1) {
          // Usuario
          window.location.href = '../index.html';
      } else if (rolUsuario === 2) {
          // Administrador
          window.location.href = '../sistema/principal.html';
      }
  }, 1000);
}

function mostrarModalError() {
    const modalError = new bootstrap.Modal(document.getElementById("modal-error"));
    modalError.show();
}