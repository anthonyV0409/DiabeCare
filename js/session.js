local_storage = localStorage.getItem("Usuario");

if (local_storage !== undefined && local_storage !== null) {
  const usuarioData = JSON.parse(local_storage);
  const nombreUsuario = capitalizeFirstLetter(usuarioData.usuario.nombres);
  const apellidoUsuario = usuarioData.usuario.apellidos;

  // Muestra el nombre del usuario en el elemento "nombre-usuario"
  document.getElementById("nombre-usuario").textContent =
    nombreUsuario + " " + apellidoUsuario;
/*

  const cerrarSesionButtonIndex = document.getElementById("cerrar-sesion-index");
  cerrarSesionButtonIndex.addEventListener("click", function () {
   
  });
*/
/*
  const xcerrarSesionButton = document.getElementById("xcerrar-sesion");
  xcerrarSesionButton.addEventListener("click", function () {
   
  });
*/
  console.log(usuarioData);
} else {
  window.location.href = "html/login.html";
}

// Función para convertir la primera letra a mayúscula
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

window.addEventListener("unload", (event) => {
    local_storage = localStorage.getItem("Usuario");
    if (local_storage !== undefined) {
        window.location.href = "../index.html";
        console.log("funciona");
    }
});



function cerrardesdeindex() {
   // Limpiar localStorage y redirigir a la página de inicio de sesión
   localStorage.removeItem("Usuario");
   window.location.href ="html/login.html";
}

function cerrargeneral() {
  console.log("ghgh")
  // Limpiar localStorage y redirigir a la página de inicio de sesión
  localStorage.removeItem("Usuario");
  window.location.href ="login.html";
}