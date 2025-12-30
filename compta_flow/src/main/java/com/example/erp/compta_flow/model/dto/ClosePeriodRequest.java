package com.example.erp.compta_flow.model.dto;

import lombok.Data;

@Data
public class ClosePeriodRequest {
    private Integer year;
    private Integer month; // optional pour clôture mensuelle
}