package com.example.erp.compta_flow.repository;

import com.example.erp.compta_flow.models.MouvementTresorerie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MouvementTresorerieRepository extends JpaRepository<MouvementTresorerie, Long> {
    
    List<MouvementTresorerie> findAllByOrderByDateDesc();
    
    List<MouvementTresorerie> findByDateBetween(LocalDate start, LocalDate end);
    
    List<MouvementTresorerie> findByType(MouvementTresorerie.TypeMouvement type);
}
