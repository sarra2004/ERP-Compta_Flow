package com.example.erp.compta_flow.repository;

import com.example.erp.compta_flow.model.entity.AccountingPeriod;
import com.example.erp.compta_flow.model.enums.PeriodStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountingPeriodRepository extends JpaRepository<AccountingPeriod, Long> {
    
    // Trouver une période par année et mois
    Optional<AccountingPeriod> findByYearAndMonth(Integer year, Integer month);
    
    // Trouver toutes les périodes d'une année
    List<AccountingPeriod> findByYear(Integer year);
    
    // Trouver les périodes par statut
    List<AccountingPeriod> findByStatus(PeriodStatus status);
    
    // Trier par année et mois (descendant)
    List<AccountingPeriod> findAllByOrderByYearDescMonthDesc();
}