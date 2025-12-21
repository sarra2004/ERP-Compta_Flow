package com.example.erp.compta_flow.model.entity;

import com.example.erp.compta_flow.model.enums.PeriodStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounting_periods", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"year", "month"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountingPeriod {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Integer year;
    
    @Column(nullable = true)
    private Integer month; // null pour clôture annuelle
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PeriodStatus status = PeriodStatus.OPEN;
    
    @Column(name = "closing_date")
    private LocalDateTime closingDate;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}