package com.example.erp.compta_flow.repository;

import com.example.erp.compta_flow.models.Facture;
import com.example.erp.compta_flow.models.Facture.EtatFacture;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    // Filtre par fournisseur
    List<Facture> findByFournisseurContainingIgnoreCase(String fournisseur);
    // Filtre par état (VALIDEE, PAYEE, etc.)
    List<Facture> findByEtat(Facture.EtatFacture etat);
    // Filtre par plage de dates
    List<Facture> findByDateFactureBetween(LocalDate debut, LocalDate fin);

    // Filtre par montant supérieur à
    List<Facture> findByMontantTTCGreaterThan(Double montant);
}
