package tn.erp.tresorerie.treasury.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.erp.tresorerie.treasury.dto.CashMovementRequest;
import tn.erp.tresorerie.treasury.entity.CashAccount;
import tn.erp.tresorerie.treasury.entity.CashMovement;
import tn.erp.tresorerie.treasury.repository.CashAccountRepository;
import tn.erp.tresorerie.treasury.service.TreasuryService;

import java.util.List;

@RestController
@RequestMapping("/api/treasury")
public class TreasuryController {

    private final TreasuryService treasuryService;
    private final CashAccountRepository cashAccountRepository;

    public TreasuryController(TreasuryService treasuryService,
                              CashAccountRepository cashAccountRepository) {
        this.treasuryService = treasuryService;
        this.cashAccountRepository = cashAccountRepository;
    }

    // 👉 1) Lister les comptes de trésorerie
    @GetMapping("/accounts")
    public List<CashAccount> getAccounts() {
        return cashAccountRepository.findAll();
    }

    // 👉 2) Créer un mouvement (IN / OUT)
    @PostMapping("/movements")
    public ResponseEntity<CashMovement> createMovement(@RequestBody CashMovementRequest request) {
        CashMovement movement = treasuryService.createMovement(request);
        return ResponseEntity.ok(movement);
    }
    @GetMapping("/accounts/{accountId}/movements")
    public List<CashMovement> getMovementsByAccount(@PathVariable Long accountId) {
    return treasuryService.getAccountMovements(accountId);
}

}
