package com.example.erp.compta_flow.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class CreateJournalEntryRequest {
    private LocalDate entryDate;
    private String entryNumber;
    private String description;
    private PeriodRef period;
    private List<JournalEntryLineRequest> lines = new ArrayList<>();

    @Data
    @NoArgsConstructor
    public static class PeriodRef {
        private Long id;
    }

    @Data
    @NoArgsConstructor
    public static class JournalEntryLineRequest {
        private AccountRef account;
        private String description;
        private BigDecimal debit;
        private BigDecimal credit;

        @Data
        @NoArgsConstructor
        public static class AccountRef {
            private Long id;
        }
    }
}
