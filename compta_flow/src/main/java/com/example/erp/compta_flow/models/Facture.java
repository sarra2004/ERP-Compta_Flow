package com.example.erp.compta_flow.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
@Data
@Entity
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroFacture;
    private LocalDate dateFacture;
    private Double montantHT;
    private Double montantTVA;
    private Double montantTTC;
    private Double montantBonCommande;
    
    private String fournisseur; // Ou une entité @ManyToOne Fournisseur
    private String compteComptable;
    private String numeroBonCommande; // Pour le rapprochement
    
    @Enumerated(EnumType.STRING)
    private EtatFacture etat = EtatFacture.BROUILLON;

    public enum EtatFacture {
        BROUILLON, VALIDEE, ERREUR_RAPPROCHEMENT, PAYEE
    }
}
