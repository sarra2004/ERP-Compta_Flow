package com.example.erp.compta_flow.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.example.erp.compta_flow.model.entity.AccountingPeriod;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "journal_entries")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class JournalEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entry_number", unique = true, nullable = false)
    private String entryNumber;

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "journal_account_id")
    private CompteComptable journalAccount; // The journal account (like Cash, Bank, Sales, etc.)

    @Column(name = "period_id")
    private Long periodId; // Référence à la période comptable (sans contrainte pour faciliter la migration)

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status = Status.DRAFT;

    @OneToMany(mappedBy = "journalEntry", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<JournalEntryLine> lines = new ArrayList<>();

    public enum Status {
        DRAFT, POSTED
    }
}
