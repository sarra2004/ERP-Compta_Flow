package com.example.erp.compta_flow.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@Table(name = "mouvement_tresorerie")
public class MouvementTresorerie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "libelle", nullable = false)
    private String libelle;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TypeMouvement type;

    @Column(name = "montant", nullable = false)
    private Double montant;

    @Column(name = "moyen_paiement", nullable = false)
    private String moyenPaiement;

    @Column(name = "reference")
    private String reference;

    public enum TypeMouvement {
        ENTREE, SORTIE
    }
}
