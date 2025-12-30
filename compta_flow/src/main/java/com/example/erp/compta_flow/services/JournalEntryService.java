package com.example.erp.compta_flow.services;

import com.example.erp.compta_flow.models.CompteComptable;
import com.example.erp.compta_flow.models.JournalEntry;
import com.example.erp.compta_flow.models.JournalEntryLine;
import com.example.erp.compta_flow.repository.CompteComptableRepository;
import com.example.erp.compta_flow.repository.JournalEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class JournalEntryService {

    @Autowired
    private JournalEntryRepository entryRepository;

    @Autowired
    private CompteComptableRepository accountRepository;

    public JournalEntry createEntry(JournalEntry entry) throws Exception {
        // Check unique entry number
        if (entryRepository.findByEntryNumber(entry.getEntryNumber()).isPresent()) {
            throw new Exception("Entry number already exists");
        }

        // Check that debit = credit
        BigDecimal totalDebit = entry.getLines().stream().map(JournalEntryLine::getDebit).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCredit = entry.getLines().stream().map(JournalEntryLine::getCredit).reduce(BigDecimal.ZERO, BigDecimal::add);
        if (totalDebit.compareTo(totalCredit) != 0) {
            throw new Exception("Total debit must equal total credit");
        }

        // Link each line to entry
        for (JournalEntryLine line : entry.getLines()) {
            line.setJournalEntry(entry);
            if (!accountRepository.existsById(line.getAccount().getId())) {
                throw new Exception("Account " + line.getAccount().getId() + " does not exist");
            }
        }

        return entryRepository.save(entry);
    }

    public JournalEntry updateEntry(Long id, JournalEntry updated) throws Exception {
        JournalEntry entry = entryRepository.findById(id).orElseThrow(() -> new Exception("Journal Entry not found"));

        if (entry.getStatus() == JournalEntry.Status.POSTED) {
            throw new Exception("Cannot modify a posted entry");
        }

        // Optional: update fields
        entry.setEntryDate(updated.getEntryDate() != null ? updated.getEntryDate() : entry.getEntryDate());
        entry.setEntryNumber(updated.getEntryNumber() != null ? updated.getEntryNumber() : entry.getEntryNumber());
        entry.setJournalAccount(updated.getJournalAccount() != null ? updated.getJournalAccount() : entry.getJournalAccount());

        // Replace lines if provided
        if (updated.getLines() != null && !updated.getLines().isEmpty()) {
            entry.getLines().clear();
            for (JournalEntryLine line : updated.getLines()) {
                line.setJournalEntry(entry);
                entry.getLines().add(line);
            }
        }

        return entryRepository.save(entry);
    }

    public void postEntry(Long id) throws Exception {
        JournalEntry entry = entryRepository.findById(id).orElseThrow(() -> new Exception("Journal Entry not found"));
        if (entry.getStatus() == JournalEntry.Status.POSTED) {
            throw new Exception("Entry already posted");
        }

        // Check debit = credit before posting
        BigDecimal totalDebit = entry.getLines().stream().map(JournalEntryLine::getDebit).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCredit = entry.getLines().stream().map(JournalEntryLine::getCredit).reduce(BigDecimal.ZERO, BigDecimal::add);
        if (totalDebit.compareTo(totalCredit) != 0) {
            throw new Exception("Cannot post: total debit not equal total credit");
        }

        entry.setStatus(JournalEntry.Status.POSTED);
        entryRepository.save(entry);
    }

    public List<JournalEntry> listEntries() {
        return entryRepository.findAll();
    }

    public void deleteEntry(Long id) throws Exception {
        JournalEntry entry = entryRepository.findById(id).orElseThrow(() -> new Exception("Journal Entry not found"));
        if (entry.getStatus() == JournalEntry.Status.POSTED) {
            throw new Exception("Cannot delete a posted entry");
        }
        entryRepository.delete(entry);
    }
}
