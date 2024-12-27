package com.example.demo.repositorio;

import com.example.demo.Miembro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MiembroRepository extends JpaRepository<Miembro, Integer> {
}

