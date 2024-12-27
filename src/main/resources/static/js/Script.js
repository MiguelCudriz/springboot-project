// URL base de la API
const baseUrl = 'http://localhost:8080/miembros';

// Función para validar que un campo solo reciba texto sin números
function configurarValidacionCampo(input, mensajeError) {
    input.addEventListener('input', () => {
        if (!input.value.trim()) {
            input.setCustomValidity(mensajeError);
        } else {
            input.setCustomValidity('');
        }
    });
}

// Configurar validación en los campos de actualizar miembro
const updateNombre = document.getElementById('update-nombre');
const updateApellido = document.getElementById('update-apellido');
const updateEmail = document.getElementById('update-email');
configurarValidacionCampo(updateNombre, 'Debes completar este campo.');
configurarValidacionCampo(updateApellido, 'Debes completar este campo.');
configurarValidacionCampo(updateEmail, 'Debes completar este campo.');

// ** Crear Miembro **
document.getElementById('create-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const activo = document.getElementById('activo_crear').checked;

    if (!nombre || !apellido || !email) {
        Swal.fire('Error', 'Todos los campos (nombre, apellido y email) son obligatorios.', 'error');
        return;
    }

    const miembro = { nombre, apellido, email, activo };

    try {
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

// ** Actualizar Miembro **
document.getElementById('update-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('update-id').value.trim();
    const nombre = updateNombre.value.trim();
    const apellido = updateApellido.value.trim();
    const email = updateEmail.value.trim();
    const activo = document.getElementById('activo_actualizar').checked;

    // Si algún campo está vacío, no se envía el formulario
    if (!nombre || !apellido || !email) {
        Swal.fire('Error', 'Todos los campos (nombre, apellido y email) son obligatorios.', 'error');
        return;
    }

    const miembro = { nombre, apellido, email, activo };

    try {
        const response = await fetch(`${baseUrl}/actualizar/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(miembro),
        });

        if (response.status === 404) {
            Swal.fire('Error', 'Miembro no encontrado, error al actualizar', 'error');
            return;
        }

        if (!response.ok) {
            Swal.fire('Error', 'Error al actualizar el miembro. Intenta nuevamente.', 'error');
            return;
        }

        Swal.fire('Éxito', 'Miembro actualizado correctamente.', 'success');
    } catch (error) {
        Swal.fire('Error', 'Ocurrió un problema al actualizar el miembro. Intenta nuevamente.', 'error');
        console.error('Error inesperado:', error);
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
            Swal.fire('Error', 'Miembro no encontrado', 'error');
            return;
        }

        const miembro = await response.json();
        const memberInfo = document.getElementById('member-info');

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

// Manejo de funcionalidad de paneles desplegables
document.querySelectorAll('.panel-header').forEach(header => {
    header.addEventListener('click', () => {
        const panelContent = header.nextElementSibling;
        panelContent.classList.toggle('active');
    });
});
