package com.example.erp.compta_flow.controllers;

import com.example.erp.compta_flow.models.Facture;
import com.example.erp.compta_flow.services.FactureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/factures")

public class FactureController {
    @Autowired
    private FactureService factureService;

    // Créer une facture
    @PostMapping
    public ResponseEntity<Facture> create(@RequestBody Facture facture) {
        return ResponseEntity.ok(factureService.creerFacture(facture));
    }

    // Valider (déclenche rapprochement et écriture)
    @PutMapping("/{id}/valider")
    public ResponseEntity<Facture> valider(@PathVariable Long id) {
        return ResponseEntity.ok(factureService.validerFacture(id));
    }

    // Consulter (Archivage)
    @GetMapping
    public List<Facture> getAll() {
        return factureService.findAll(); 
    }

    // Rechercher avec des filtres (Archivage et Consultation)
    @GetMapping("/search")
    public ResponseEntity<List<Facture>> search(
            @RequestParam(required = false) String fournisseur,
            @RequestParam(required = false) Facture.EtatFacture etat,
            @RequestParam(required = false) String debut, // format yyyy-MM-dd
            @RequestParam(required = false) String fin) {
        
        LocalDate dateDebut = (debut != null) ? LocalDate.parse(debut) : null;
        LocalDate dateFin = (fin != null) ? LocalDate.parse(fin) : null;

        return ResponseEntity.ok(factureService.rechercherFactures(fournisseur, etat, dateDebut, dateFin));
    }

    // Enregistrer le paiement d'une facture
    @PutMapping("/{id}/payer")
    public ResponseEntity<Facture> payer(@PathVariable Long id) {
        try {
            Facture facturePayee = factureService.enregistrerPaiement(id);
            return ResponseEntity.ok(facturePayee);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
