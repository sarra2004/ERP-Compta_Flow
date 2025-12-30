package com.example.erp.compta_flow.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@Entity
@Table(name = "journal_entry_lines")
public class JournalEntryLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "entry_id")
    private JournalEntry journalEntry;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private CompteComptable account;

    @Column(name = "debit", nullable = false)
    private BigDecimal debit = BigDecimal.ZERO;

    @Column(name = "credit", nullable = false)
    private BigDecimal credit = BigDecimal.ZERO;

    @Column(name = "description")
    private String description;
}
