

const baseUrl = 'http://localhost:8080/miembros';

// ** Crear Miembro **
document.getElementById('create-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Capturar valores de los campos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const activo = document.getElementById('activo_crear').checked;

    // Validaciones de entrada
    if (!nombre || !apellido || !email) {
        Swal.fire('Error', 'Todos los campos (nombre, apellido y email) son obligatorios.', 'error');
        return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        Swal.fire('Error', 'Por favor, ingresa un correo electrónico válido.', 'error');
        return;
    }

    const miembro = { nombre, apellido, email, activo };

    try {
        // Enviar solicitud POST al backend
        const response = await fetch(`${baseUrl}/crear`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(miembro),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            Swal.fire('Error', `No se pudo crear el miembro: ${errorMessage}`, 'error');
            return;
        }

        // Mostrar solo mensaje de éxito sin los detalles
        Swal.fire('Éxito', `Miembro añadido correctamente.`, 'success');

        // Limpiar los campos del formulario
        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
        document.getElementById('email').value = '';
        document.getElementById('activo_crear').checked = false;

    } catch (error) {
        Swal.fire('Error', 'Ocurrió un problema al crear el miembro. Intenta nuevamente.', 'error');
        console.error('Error de red o servidor:', error);
    }
});


// ** Consultar Miembro por ID **
document.getElementById('search-member-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('search-member-id').value.trim();

    if (!id) {
        Swal.fire('Error', 'Por favor, ingresa un ID válido.', 'error');
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/${id}`);

        if (!response.ok) {
            const errorMessage = await response.text();
            Swal.fire('Error', `No se encontró el miembro:`, 'error');
            return;
        }

        const miembro = await response.json();
        const memberInfo = document.getElementById('member-info');

        // Mostrar información del miembro en una tarjeta
        memberInfo.innerHTML = `
            <div class="miembro-card">
                <button class="close-button" onclick="this.parentElement.remove()">×</button>
                <div><strong>ID:</strong> ${miembro.id}</div>
                <div><strong>Nombre:</strong> ${miembro.nombre}</div>
                <div><strong>Apellido:</strong> ${miembro.apellido}</div>
                <div><strong>Email:</strong> ${miembro.email}</div>
                <div><strong>Activo:</strong> ${miembro.activo ? "Sí" : "No"}</div>
            </div>
        `;
    } catch (error) {
        Swal.fire('Error', 'Hubo un problema al consultar el miembro. Intenta nuevamente.', 'error');
        console.error('Error al consultar el miembro:', error);
    }
});

// ** Actualizar Miembro **
document.getElementById('update-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('update-id').value.trim();
    const nombre = document.getElementById('update-nombre').value.trim();
    const apellido = document.getElementById('update-apellido').value.trim();
    const email = document.getElementById('update-email').value.trim();
    const activo = document.getElementById('activo_actualizar').checked;

    // Validar que al menos un campo esté presente
    if (!nombre && !apellido && !email) {
        Swal.fire('Error', 'Debes ingresar al menos un campo para actualizar.', 'error');
        return;
    }

    const miembro = { nombre, apellido, email, activo };

    try {
        const response = await fetch(`${baseUrl}/actualizar/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(miembro),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            Swal.fire('Error', `No se pudo actualizar: ${errorMessage}`, 'error');
            return;
        }

        // Mostrar mensaje de éxito simple
        Swal.fire('Éxito', 'Miembro actualizado correctamente.', 'success');
    } catch (error) {
        Swal.fire('Error', 'Ocurrió un problema al actualizar el miembro. Intenta nuevamente.', 'error');
        console.error('Error inesperado:', error);
    }
});


// ** Eliminar Miembro **
document.getElementById('delete-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('delete-id').value.trim();

    if (!id) {
        Swal.fire('Error', 'Por favor, ingresa un ID válido.', 'error');
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/eliminar/${id}`, { method: 'DELETE' });

        if (response.status === 404) {
            Swal.fire('Error', 'Miembro no encontrado. No se pudo eliminar.', 'error');
            return;
        }

        if (!response.ok) {
            const errorMessage = await response.text();
            Swal.fire('Error', `No se pudo eliminar el miembro: ${errorMessage}`, 'error');
            return;
        }

        Swal.fire('Éxito', `Miembro con ID ${id} eliminado correctamente.`, 'success');
    } catch (error) {
        Swal.fire('Error', 'Ocurrió un problema al eliminar el miembro. Intenta nuevamente.', 'error');
        console.error('Error al eliminar:', error);
    }
});


