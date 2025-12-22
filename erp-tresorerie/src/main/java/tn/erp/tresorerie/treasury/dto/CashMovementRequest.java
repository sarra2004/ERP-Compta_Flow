package tn.erp.tresorerie.treasury.dto;

import tn.erp.tresorerie.treasury.entity.CashMovement.MovementType;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CashMovementRequest {

    private Long cashAccountId;
    private LocalDate movementDate;
    private MovementType type;
    private BigDecimal amount;
    private String reference;
    private String description;

    public CashMovementRequest() {
    }

    public Long getCashAccountId() {
        return cashAccountId;
    }

    public void setCashAccountId(Long cashAccountId) {
        this.cashAccountId = cashAccountId;
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
}
