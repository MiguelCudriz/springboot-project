
    document.getElementById('update-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que se recargue la página (opcional si manejas la lógica por JS)

    // Aquí puedes ejecutar la lógica de tu acción, como enviar datos al backend
    console.log("Formulario enviado");

    // Limpia los campos del formulario
    this.reset();
});

