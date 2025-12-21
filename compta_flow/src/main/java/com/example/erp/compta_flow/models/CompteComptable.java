package com.example.erp.compta_flow.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "compte_comptable")
public class CompteComptable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero", unique = true, nullable = false, length = 20)
    private String numero;

    @Column(name = "intitule", nullable = false, length = 255)
    private String intitule;

    @Column(name = "classe", nullable = false)
    private Integer classe;

    @Column(name = "type", length = 50)
    private String type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status = Status.ACTIVE;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Status {
        ACTIVE, INACTIVE
    }
}
