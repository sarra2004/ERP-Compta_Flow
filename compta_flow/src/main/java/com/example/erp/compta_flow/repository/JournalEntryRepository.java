package com.example.erp.compta_flow.repository;

import com.example.erp.compta_flow.models.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    Optional<JournalEntry> findByEntryNumber(String entryNumber);
}
