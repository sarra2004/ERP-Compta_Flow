package com.example.erp.compta_flow.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "journal_entries")
public class JournalEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entry_number", unique = true, nullable = false)
    private String entryNumber;

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @ManyToOne
    @JoinColumn(name = "journal_account_id")
    private CompteComptable journalAccount; // The journal account (like Cash, Bank, Sales, etc.)

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status = Status.DRAFT;

    @OneToMany(mappedBy = "journalEntry", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JournalEntryLine> lines;

    public enum Status {
        DRAFT, POSTED
    }
}
