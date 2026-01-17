package com.example.erp.compta_flow.controllers;

import com.example.erp.compta_flow.model.dto.ClosePeriodRequest;
import com.example.erp.compta_flow.model.entity.AccountingPeriod;
import com.example.erp.compta_flow.service.AccountingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/periods")
public class PeriodController {

    @Autowired
    private AccountingService accountingService;

    @GetMapping
    public ResponseEntity<?> listPeriods() {
        return ResponseEntity.ok(accountingService.getAllPeriods());
    }

    @PostMapping
    public ResponseEntity<?> createPeriod(@RequestBody ClosePeriodRequest request) {
        try {
            AccountingPeriod period = accountingService.createPeriod(
                request.getYear(), request.getMonth());
            
            return ResponseEntity.ok(period);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<?> closePeriodById(@PathVariable Long id) {
        try {
            AccountingPeriod period = accountingService.closePeriodById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Période clôturée avec succès");
            response.put("period", period);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PatchMapping("/{id}/reopen")
    public ResponseEntity<?> reopenPeriod(@PathVariable Long id) {
        try {
            AccountingPeriod period = accountingService.reopenPeriod(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Période réouverte avec succès");
            response.put("period", period);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
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
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
