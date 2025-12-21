package com.example.erp.compta_flow.repository;

import com.example.erp.compta_flow.models.JournalEntryLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JournalEntryLineRepository extends JpaRepository<JournalEntryLine, Long> {
}
