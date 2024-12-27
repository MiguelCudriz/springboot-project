package com.example.demo.controlador;

import com.example.demo.Miembro;
import com.example.demo.repositorio.MiembroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/miembros")
public class MiembroController {

    @Autowired
    private MiembroRepository repository;

    /**
     * Crear un nuevo miembro.
     * @param miembro Datos del miembro a crear.
     * @return El miembro creado.
     */
    @PostMapping("/crear")
    public Miembro crearMiembro(@RequestBody Miembro miembro) {
        return repository.save(miembro);
    }

    /**
     * Obtener un miembro por ID.
     * @param id Identificador del miembro.
     * @return Los datos del miembro si existe, o un mensaje de error si no.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerMiembro(@PathVariable int id) {
        Optional<Miembro> miembroOpt = repository.findById(id);

        if (miembroOpt.isPresent()) {
            return ResponseEntity.ok(miembroOpt.get());
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("timestamp", LocalDateTime.now());
            errorResponse.put("status", HttpStatus.NOT_FOUND.value());
            errorResponse.put("error", "Not Found");
            errorResponse.put("message", "El miembro con ID " + id + " no existe");
            errorResponse.put("path", "/miembros/" + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    /**
     * Actualizar los datos de un miembro por ID.
     * Solo se actualizan los campos proporcionados.
     * @param id Identificador del miembro.
     * @param miembro Datos a actualizar.
     * @return El miembro actualizado, o un mensaje de error si no se encuentra.
     */
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<?> actualizarMiembro(@PathVariable int id, @RequestBody Miembro miembro) {
        // Validar que al menos un campo esté presente para actualizar
        if ((miembro.getNombre() == null || miembro.getNombre().isEmpty()) &&
                (miembro.getApellido() == null || miembro.getApellido().isEmpty()) &&
                (miembro.getEmail() == null || miembro.getEmail().isEmpty())) {
            return ResponseEntity.badRequest().body("Debes proporcionar al menos un campo válido para actualizar.");
        }

        // Buscar el miembro por ID en la base de datos
        return repository.findById(id).map(miembroExistente -> {
            // Actualizar solo los campos no nulos o vacíos
            if (miembro.getNombre() != null && !miembro.getNombre().isEmpty()) {
                miembroExistente.setNombre(miembro.getNombre());
            }
            if (miembro.getApellido() != null && !miembro.getApellido().isEmpty()) {
                miembroExistente.setApellido(miembro.getApellido());
            }
            if (miembro.getEmail() != null && !miembro.getEmail().isEmpty()) {
                miembroExistente.setEmail(miembro.getEmail());
            }

            // Actualizar el estado "activo"
            miembroExistente.setActivo(miembro.isActivo());

            // Guardar los cambios
            Miembro miembroActualizado = repository.save(miembroExistente);

            // Retornar la respuesta con los datos actualizados
            return ResponseEntity.ok(miembroActualizado);
        }).orElseGet(() -> {
            // Si no se encuentra el miembro, retornar un error 404
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "El miembro con ID " + id + " no existe");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body((Miembro) errorResponse);
        });
    }

    /**
     * Eliminar un miembro por ID.
     * @param id Identificador del miembro.
     */
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarMiembro(@PathVariable int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok("Miembro eliminado correctamente.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Miembro no encontrado.");
        }
    }

}

