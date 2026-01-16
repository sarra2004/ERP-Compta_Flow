package com.example.erp.compta_flow.controllers;

import com.example.erp.compta_flow.models.MouvementTresorerie;
import com.example.erp.compta_flow.services.TresorerieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tresorerie")
public class TresorerieController {

    @Autowired
    private TresorerieService service;

    @GetMapping
    public ResponseEntity<List<MouvementTresorerie>> getAllMouvements() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<MouvementTresorerie> createMouvement(@RequestBody MouvementTresorerie mouvement) {
        try {
            MouvementTresorerie created = service.create(mouvement);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/solde")
    public ResponseEntity<Map<String, Double>> getSolde() {
        Map<String, Double> response = new HashMap<>();
        response.put("solde", service.calculateSolde());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/periode")
    public ResponseEntity<List<MouvementTresorerie>> getMouvementsByPeriod(
            @RequestParam String start,
            @RequestParam String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return ResponseEntity.ok(service.findByPeriod(startDate, endDate));
    }
}
