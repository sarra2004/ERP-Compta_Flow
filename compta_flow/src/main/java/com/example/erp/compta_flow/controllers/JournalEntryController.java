package com.example.erp.compta_flow.controllers;

import com.example.erp.compta_flow.models.JournalEntry;
import com.example.erp.compta_flow.models.JournalEntryLine;
import com.example.erp.compta_flow.models.CompteComptable;
import com.example.erp.compta_flow.dto.CreateJournalEntryRequest;
import com.example.erp.compta_flow.services.JournalEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/journal-entries")
public class JournalEntryController {

    @Autowired
    private JournalEntryService service;

    @PostMapping
    public ResponseEntity<?> createEntry(@RequestBody CreateJournalEntryRequest request) {
        try {
            // Convert DTO to JournalEntry
            JournalEntry entry = new JournalEntry();
            entry.setEntryDate(request.getEntryDate());
            entry.setEntryNumber(request.getEntryNumber());
            entry.setDescription(request.getDescription());
            entry.setPeriodId(request.getPeriod().getId());
            
            // Convert lines
            List<JournalEntryLine> lines = request.getLines().stream().map(lineReq -> {
                JournalEntryLine line = new JournalEntryLine();
                CompteComptable account = new CompteComptable();
                account.setId(lineReq.getAccount().getId());
                line.setAccount(account);
                line.setDescription(lineReq.getDescription());
                line.setDebit(lineReq.getDebit());
                line.setCredit(lineReq.getCredit());
                return line;
            }).collect(Collectors.toList());
            
            entry.setLines(lines);
            
            return ResponseEntity.status(201).body(service.createEntry(entry));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEntry(@PathVariable Long id, @RequestBody JournalEntry entry) {
        try {
            return ResponseEntity.ok(service.updateEntry(id, entry));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }

    @PatchMapping("/{id}/post")
    public ResponseEntity<?> postEntry(@PathVariable Long id) {
        try {
            service.postEntry(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Entry posted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEntry(@PathVariable Long id) {
        try {
            service.deleteEntry(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Entry deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    @Transactional
    public List<JournalEntry> listEntries() {
        return service.listEntries();
    }
}
