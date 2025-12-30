package com.example.erp.compta_flow.repository;

import com.example.erp.compta_flow.models.CompteComptable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompteComptableRepository extends JpaRepository<CompteComptable, Long> {
    Optional<CompteComptable> findByNumero(String numero);
}
