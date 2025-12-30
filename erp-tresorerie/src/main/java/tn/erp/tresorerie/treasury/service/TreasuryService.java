package tn.erp.tresorerie.treasury.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.erp.tresorerie.treasury.dto.CashMovementRequest;
import tn.erp.tresorerie.treasury.entity.CashAccount;
import tn.erp.tresorerie.treasury.entity.CashMovement;
import tn.erp.tresorerie.treasury.repository.CashAccountRepository;
import tn.erp.tresorerie.treasury.repository.CashMovementRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TreasuryService {

    private final CashAccountRepository cashAccountRepository;
    private final CashMovementRepository cashMovementRepository;

    public TreasuryService(CashAccountRepository cashAccountRepository,
                           CashMovementRepository cashMovementRepository) {
        this.cashAccountRepository = cashAccountRepository;
        this.cashMovementRepository = cashMovementRepository;
    }

    @Transactional
    public CashMovement createMovement(CashMovementRequest request) {

        // 1. Vérifier que le compte existe
        CashAccount account = cashAccountRepository.findById(request.getCashAccountId())
                .orElseThrow(() -> new EntityNotFoundException("Compte de trésorerie introuvable"));

        // 2. Vérifier montant > 0
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Le montant doit être strictement positif.");
        }

        // 3. Créer l'entité mouvement
        CashMovement movement = new CashMovement();
        movement.setCashAccount(account);
        movement.setMovementDate(request.getMovementDate());
        movement.setType(request.getType());
        movement.setAmount(request.getAmount());
        movement.setReference(request.getReference());
        movement.setDescription(request.getDescription());

        // 4. Mettre à jour le solde
        BigDecimal newBalance = account.getCurrentBalance();
        if (request.getType() == CashMovement.MovementType.IN) {
            // Encaissement → on ajoute
            newBalance = newBalance.add(request.getAmount());
        } else { // OUT = décaissement
            newBalance = newBalance.subtract(request.getAmount());

            // 🔴 Empêcher solde négatif
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalStateException("Solde insuffisant sur ce compte.");
            }
        }

        // Appliquer le nouveau solde
        account.setCurrentBalance(newBalance);

        // 5. Sauvegarder dans la BD (transactionnelle)
        cashAccountRepository.save(account);
        return cashMovementRepository.save(movement);
    }

    public List<CashMovement> getAccountMovements(Long accountId) {
        CashAccount account = cashAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        return cashMovementRepository.findByCashAccountOrderByMovementDateDesc(account);
    }
}
