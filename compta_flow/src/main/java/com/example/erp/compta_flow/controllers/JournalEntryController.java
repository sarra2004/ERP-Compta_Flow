package com.example.erp.compta_flow.controllers;

import com.example.erp.compta_flow.models.JournalEntry;
import com.example.erp.compta_flow.services.JournalEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entries")
public class JournalEntryController {

    @Autowired
    private JournalEntryService service;

    @PostMapping
    public ResponseEntity<?> createEntry(@RequestBody JournalEntry entry) {
        try {
            return ResponseEntity.status(201).body(service.createEntry(entry));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEntry(@PathVariable Long id, @RequestBody JournalEntry entry) {
        try {
            return ResponseEntity.ok(service.updateEntry(id, entry));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/post")
    public ResponseEntity<?> postEntry(@PathVariable Long id) {
        try {
            service.postEntry(id);
            return ResponseEntity.ok("Entry posted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEntry(@PathVariable Long id) {
        try {
            service.deleteEntry(id);
            return ResponseEntity.ok("Entry deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<JournalEntry> listEntries() {
        return service.listEntries();
    }
}
