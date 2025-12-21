package com.example.erp.compta_flow.controllers;

import com.example.erp.compta_flow.models.CompteComptable;
import com.example.erp.compta_flow.services.CompteComptableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
public class CompteComptableController {

    @Autowired
    private CompteComptableService service;

    @PostMapping
    public ResponseEntity<?> createAccount(@RequestBody CompteComptable acc) {
        try {
            CompteComptable created = service.createAccount(acc);
            return ResponseEntity.status(201).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable Long id, @RequestBody CompteComptable updated) {
        try {
            return ResponseEntity.ok(service.updateAccount(id, updated));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/disable")
    public ResponseEntity<?> disableAccount(@PathVariable Long id) {
        try {
            service.disableAccount(id);
            return ResponseEntity.ok("Account disabled");
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        try {
            service.deleteAccount(id);
            return ResponseEntity.ok("Account deleted");
        } catch (Exception e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping
    public List<CompteComptable> listAccounts() {
        return service.listAccounts();
    }
}

