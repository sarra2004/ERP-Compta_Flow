package tn.erp.tresorerie.treasury.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cash_movements")
public class CashMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Date du mouvement (ex : 2025-12-22)
    @Column(nullable = false)
    private LocalDate movementDate;

    // IN = encaissement, OUT = décaissement
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementType type;

    // Montant du mouvement
    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    // Référence (ex : n° chèque, virement...)
    private String reference;

    // Description du mouvement (facultatif)
    private String description;

    // Lien vers le compte de trésorerie concerné
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cash_account_id", nullable = false)
    private CashAccount cashAccount;

    public CashMovement() {
    }

    // ======= Getters / Setters =======

    public Long getId() {
        return id;
    }

    public LocalDate getMovementDate() {
        return movementDate;
    }

    public void setMovementDate(LocalDate movementDate) {
        this.movementDate = movementDate;
    }

    public MovementType getType() {
        return type;
    }

    public void setType(MovementType type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CashAccount getCashAccount() {
        return cashAccount;
    }

    public void setCashAccount(CashAccount cashAccount) {
        this.cashAccount = cashAccount;
    }

    // ======= Enum interne =======

    public enum MovementType {
        IN,   // Encaissement
        OUT   // Décaissement
    }
}
