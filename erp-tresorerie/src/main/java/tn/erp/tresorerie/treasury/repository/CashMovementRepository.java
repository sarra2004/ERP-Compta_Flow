package tn.erp.tresorerie.treasury.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.erp.tresorerie.treasury.entity.CashAccount;
import tn.erp.tresorerie.treasury.entity.CashMovement;

public interface CashMovementRepository extends JpaRepository<CashMovement, Long> {
    List<CashMovement> findByCashAccountOrderByMovementDateDesc(CashAccount account);
    // plus tard : filtrer par compte, par date, etc.
}
