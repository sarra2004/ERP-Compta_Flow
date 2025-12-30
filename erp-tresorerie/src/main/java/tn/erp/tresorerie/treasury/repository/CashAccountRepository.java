package tn.erp.tresorerie.treasury.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.erp.tresorerie.treasury.entity.CashAccount;

public interface CashAccountRepository extends JpaRepository<CashAccount, Long> {
    // plus tard : méthodes de recherche spécifiques si besoin
}
