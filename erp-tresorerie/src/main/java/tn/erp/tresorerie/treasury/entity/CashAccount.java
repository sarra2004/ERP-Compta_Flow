package tn.erp.tresorerie.treasury.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cash_accounts")
public class CashAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ex : "Banque BIAT", "Caisse principale"
    @Column(nullable = false)
    private String name;

    // BANK ou CASH
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType type;

    // RIB pour les comptes bancaires (optionnel)
    private String accountNumber;

    @Column(nullable = false)
    private String currency = "TND";

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal initialBalance = BigDecimal.ZERO;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal currentBalance = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus status = AccountStatus.ACTIVE;

    // ========= Constructeurs =========

    public CashAccount() {
    }

    public CashAccount(String name, AccountType type, String accountNumber,
                       String currency, BigDecimal initialBalance) {
        this.name = name;
        this.type = type;
        this.accountNumber = accountNumber;
        this.currency = currency;
        this.initialBalance = initialBalance != null ? initialBalance : BigDecimal.ZERO;
        this.currentBalance = this.initialBalance;
        this.status = AccountStatus.ACTIVE;
    }

    // ========= Getters & Setters =========

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AccountType getType() {
        return type;
    }

    public void setType(AccountType type) {
        this.type = type;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getInitialBalance() {
        return initialBalance;
    }

    public void setInitialBalance(BigDecimal initialBalance) {
        this.initialBalance = initialBalance;
    }

    public BigDecimal getCurrentBalance() {
        return currentBalance;
    }

    public void setCurrentBalance(BigDecimal currentBalance) {
        this.currentBalance = currentBalance;
    }

    public AccountStatus getStatus() {
        return status;
    }

    public void setStatus(AccountStatus status) {
        this.status = status;
    }

    // ========= Enums internes =========

    public enum AccountType {
        BANK,   // Compte bancaire
        CASH    // Caisse
    }

    public enum AccountStatus {
        ACTIVE,
        INACTIVE
    }
}
