package com.example.erp.compta_flow.services;


import com.example.erp.compta_flow.models.Facture;
import com.example.erp.compta_flow.repository.FactureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FactureService {

    @Autowired
    private FactureRepository factureRepository;

    // Création / Saisie manuelle
    public Facture creerFacture(Facture facture) {
        // Correction : Utilisation de vérifications sécurisées
        if (facture.getMontantHT() != null) {
            double tva = (facture.getMontantTVA() != null) ? facture.getMontantTVA() : 0.0;
            
            // On calcule le TTC seulement s'il n'est pas déjà fourni
            if (facture.getMontantTTC() == null) {
                facture.setMontantTTC(facture.getMontantHT() + tva);
            }
        }
        return factureRepository.save(facture);
    }

    // Validation et Rapprochement
    public Facture validerFacture(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));

        // 1. Rapprochement avec Bon de Commande (Vérification existence)
        if (facture.getNumeroBonCommande() == null || facture.getNumeroBonCommande().isEmpty()) {
            facture.setEtat(Facture.EtatFacture.ERREUR_RAPPROCHEMENT);
            factureRepository.save(facture);
            throw new RuntimeException("Validation échouée : Aucun numéro de bon de commande fourni.");
        }

        // 2. Contrôle de conformité des montants (Facture vs BC)
        if (facture.getMontantBonCommande() == null || 
            Math.abs(facture.getMontantTTC() - facture.getMontantBonCommande()) > 0.01) {
            
            facture.setEtat(Facture.EtatFacture.ERREUR_RAPPROCHEMENT);
            factureRepository.save(facture);
            throw new RuntimeException("Alerte Rapprochement : Écart de montant entre la facture et le bon de commande.");
        }

        // 3. Simulation Enregistrement Écriture Comptable
        // On génère automatiquement l'écriture dans le journal des achats
        System.out.println("ERP : Génération automatique écriture journal des achats...");
        System.out.println("DEBIT Compte " + facture.getCompteComptable() + " / CREDIT Fournisseur " + facture.getFournisseur());

        facture.setEtat(Facture.EtatFacture.VALIDEE);
        return factureRepository.save(facture);
    }
    
    // Récupérer toutes les factures
    public List<Facture> findAll() {
        return factureRepository.findAll();
    }
    
    // Recherche avec filtres
    public List<Facture> rechercherFactures(String fournisseur, Facture.EtatFacture etat, LocalDate dateDebut, LocalDate dateFin) {
        if (fournisseur != null) {
            return factureRepository.findByFournisseurContainingIgnoreCase(fournisseur);
        } else if (etat != null) {
            return factureRepository.findByEtat(etat);
        } else if (dateDebut != null && dateFin != null) {
            return factureRepository.findByDateFactureBetween(dateDebut, dateFin);
        }
        return factureRepository.findAll();
    }

    // Enregistrement du Paiement
    public Facture enregistrerPaiement(Long id) {
        // 1. Recherche de la facture
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));

        // 2. Vérification de sécurité (Règle métier)
        // Une facture doit être validée comptablement avant d'être payée
        if (facture.getEtat() != Facture.EtatFacture.VALIDEE) {
            throw new RuntimeException("Erreur : Impossible de payer une facture qui n'est pas encore VALIDEE.");
        }

        // 3. Mise à jour de l'état (Suivi des paiements)
        facture.setEtat(Facture.EtatFacture.PAYEE);

        // 4. Simulation des actions ERP automatiques
        System.out.println("--- ENREGISTREMENT DU PAIEMENT ---");
        System.out.println("Action : Mise à jour du solde du compte fournisseur : " + facture.getFournisseur());
        System.out.println("Journal de Trésorerie : Crédit Banque / Débit Compte Fournisseur pour " + facture.getMontantTTC() + " TND");

        return factureRepository.save(facture);
    }
}