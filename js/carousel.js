$(document).ready(function() {
    $(".owl-carousel").owlCarousel({
        items: 3, // Muestra 3 imágenes a la vez
        loop: true, // Bucle infinito
        margin: 10, // Espacio entre las imágenes
        autoplay: true, // Reproducción automática
        autoplayTimeout: 2000, // Tiempo de transición entre imágenes (en milisegundos)
        autoplayHoverPause: true, // Pausar en el hover
        nav: true,
    });
});