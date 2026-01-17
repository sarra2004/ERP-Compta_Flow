package com.example.erp.compta_flow.services;

import com.example.erp.compta_flow.models.CompteComptable;
import com.example.erp.compta_flow.models.JournalEntry;
import com.example.erp.compta_flow.models.JournalEntryLine;
import com.example.erp.compta_flow.model.entity.AccountingPeriod;
import com.example.erp.compta_flow.model.enums.PeriodStatus;
import com.example.erp.compta_flow.repository.CompteComptableRepository;
import com.example.erp.compta_flow.repository.JournalEntryRepository;
import com.example.erp.compta_flow.repository.AccountingPeriodRepository;
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

    @Autowired
    private AccountingPeriodRepository periodRepository;

    public JournalEntry createEntry(JournalEntry entry) throws Exception {
        // Vérifier que la période existe et est ouverte
        if (entry.getPeriodId() == null) {
            throw new Exception("Une période comptable est obligatoire");
        }

        AccountingPeriod period = periodRepository.findById(entry.getPeriodId())
            .orElseThrow(() -> new Exception("Période comptable non trouvée"));

        if (period.getStatus() == PeriodStatus.CLOSED) {
            throw new Exception("Impossible de créer une écriture dans une période clôturée");
        }

        // Check unique entry number only if provided
        if (entry.getEntryNumber() != null && !entry.getEntryNumber().isEmpty()) {
            if (entryRepository.findByEntryNumber(entry.getEntryNumber()).isPresent()) {
                throw new Exception("Entry number already exists");
            }
        }

        // Check that debit = credit
        if (entry.getLines() == null || entry.getLines().isEmpty()) {
            throw new Exception("Entry must have at least one line");
        }
        
        BigDecimal totalDebit = entry.getLines().stream()
            .map(line -> line.getDebit() != null ? line.getDebit() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCredit = entry.getLines().stream()
            .map(line -> line.getCredit() != null ? line.getCredit() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (totalDebit.compareTo(totalCredit) != 0) {
            throw new Exception("Total debit must equal total credit");
        }

        // Link each line to entry
        for (JournalEntryLine line : entry.getLines()) {
            line.setJournalEntry(entry);
            if (line.getAccount() == null || line.getAccount().getId() == null) {
                throw new Exception("Each line must have a valid account");
            }
            if (!accountRepository.existsById(line.getAccount().getId())) {
                throw new Exception("Account " + line.getAccount().getId() + " does not exist");
            }
        }

        entry.setPeriodId(period.getId());
        return entryRepository.save(entry);
    }

    public JournalEntry updateEntry(Long id, JournalEntry updated) throws Exception {
        JournalEntry entry = entryRepository.findById(id).orElseThrow(() -> new Exception("Journal Entry not found"));

        if (entry.getStatus() == JournalEntry.Status.POSTED) {
            throw new Exception("Cannot modify a posted entry");
        }

        // Vérifier que la période n'est pas clôturée
        if (entry.getPeriodId() != null) {
            AccountingPeriod period = periodRepository.findById(entry.getPeriodId())
                .orElseThrow(() -> new Exception("Période non trouvée"));
            if (period.getStatus() == PeriodStatus.CLOSED) {
                throw new Exception("Cannot modify an entry in a closed period");
            }
        }

        // Optional: update fields
        entry.setEntryDate(updated.getEntryDate() != null ? updated.getEntryDate() : entry.getEntryDate());
        entry.setEntryNumber(updated.getEntryNumber() != null ? updated.getEntryNumber() : entry.getEntryNumber());
        entry.setJournalAccount(updated.getJournalAccount() != null ? updated.getJournalAccount() : entry.getJournalAccount());
        entry.setDescription(updated.getDescription() != null ? updated.getDescription() : entry.getDescription());

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
