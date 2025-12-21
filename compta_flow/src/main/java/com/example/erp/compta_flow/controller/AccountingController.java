package com.example.erp.compta_flow.controller;

import com.example.erp.compta_flow.model.dto.ClosePeriodRequest;
import com.example.erp.compta_flow.model.entity.AccountingPeriod;
import com.example.erp.compta_flow.service.AccountingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/accounting")
@RequiredArgsConstructor
public class AccountingController {
    
    private final AccountingService accountingService;
    
    @PostMapping("/close")
    public ResponseEntity<?> closePeriod(@RequestBody ClosePeriodRequest request) {
        try {
            AccountingPeriod period = accountingService.closePeriod(
                request.getYear(), request.getMonth());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Période clôturée avec succès");
            response.put("periodId", period.getId());
            response.put("year", period.getYear());
            response.put("month", period.getMonth());
            response.put("closingDate", period.getClosingDate());
            response.put("note", "La validation complète sera ajoutée quand les autres modules seront disponibles");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/periods")
    public ResponseEntity<?> listPeriods() {
        return ResponseEntity.ok(accountingService.getAllPeriods());
    }
    
    @GetMapping("/bilan/{year}")
    public ResponseEntity<?> generateBilan(@PathVariable Integer year) {
        try {
            Map<String, Object> bilan = accountingService.generateBilan(year);
            return ResponseEntity.ok(bilan);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}