package com.example.erp.compta_flow.service;

import com.example.erp.compta_flow.exception.AccountingException;
import com.example.erp.compta_flow.model.entity.AccountingPeriod;
import com.example.erp.compta_flow.model.enums.PeriodStatus;
import com.example.erp.compta_flow.repository.AccountingPeriodRepository;
import com.example.erp.compta_flow.models.JournalEntry;
import com.example.erp.compta_flow.repository.JournalEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountingService {
    
    private final AccountingPeriodRepository periodRepository;
    private final JournalEntryRepository entryRepository;
    
    /**
     * Clôturer une période avec validation séquentielle obligatoire
     */
    @Transactional
    public AccountingPeriod closePeriod(Integer year, Integer month) {
        // 1. Vérifier/créer la période
        AccountingPeriod period = periodRepository
            .findByYearAndMonth(year, month)
            .orElseGet(() -> {
                AccountingPeriod newPeriod = AccountingPeriod.builder()
                    .year(year)
                    .month(month)
                    .status(PeriodStatus.OPEN)
                    .build();
                return periodRepository.save(newPeriod);
            });
        
        // 2. Vérifier si déjà clôturée
        if (period.getStatus() == PeriodStatus.CLOSED) {
            throw new AccountingException("Période déjà clôturée");
        }
        
        // 3. VALIDATION SÉQUENTIELLE: tous les mois précédents doivent être clôturés
        if (month != null && month > 1) {
            for (int i = 1; i < month; i++) {
                Optional<AccountingPeriod> precedent = periodRepository.findByYearAndMonth(year, i);
                if (precedent.isPresent() && precedent.get().getStatus() != PeriodStatus.CLOSED) {
                    throw new AccountingException(
                        "Impossible de clôturer cette période. Veuillez d'abord clôturer : " + 
                        getMonthName(i) + " " + year);
                } else if (precedent.isEmpty()) {
                    throw new AccountingException(
                        "Les périodes précédentes doivent être clôturées. Manquante : " + 
                        getMonthName(i) + " " + year);
                }
            }
        }
        
        // 4. VÉRIFICATION DES ÉCRITURES : Toutes les écritures doivent être POSTED (validées)
        List<JournalEntry> entriesInPeriod = entryRepository.findAll().stream()
            .filter(e -> e.getPeriodId() != null && e.getPeriodId().equals(period.getId()))
            .toList();
        
        long draftEntriesCount = entriesInPeriod.stream()
            .filter(e -> e.getStatus() == JournalEntry.Status.DRAFT)
            .count();
        
        if (draftEntriesCount > 0) {
            throw new AccountingException(
                "Impossible de clôturer cette période. " + draftEntriesCount + 
                " écriture(s) en brouillon (DRAFT) doivent être validées (POSTED)");
        }
        
        // 5. Marquer comme clôturée
        period.setStatus(PeriodStatus.CLOSED);
        period.setClosingDate(LocalDateTime.now());
        
        return periodRepository.save(period);
    }
    
    /**
     * Générer un bilan simplifié (à compléter avec les comptes)
     */
    public Map<String, Object> generateBilan(Integer year) {
        // Vérifier que l'année est clôturée
        AccountingPeriod annualPeriod = periodRepository
            .findByYearAndMonth(year, null)
            .orElseThrow(() -> new AccountingException("Période annuelle non trouvée"));
        
        if (annualPeriod.getStatus() != PeriodStatus.CLOSED) {
            throw new AccountingException("L'année doit être clôturée pour générer le bilan");
        }
        
        Map<String, Object> bilan = new HashMap<>();
        bilan.put("year", year);
        bilan.put("generatedAt", LocalDateTime.now());
        bilan.put("actif", "À implémenter avec les comptes de vos collègues");
        bilan.put("passif", "À implémenter avec les comptes de vos collègues");
        bilan.put("totalActif", 0.0);
        bilan.put("totalPassif", 0.0);
        
        return bilan;
    }
    
    /**
     * Lister toutes les périodes
     */
    public List<AccountingPeriod> getAllPeriods() {
        return periodRepository.findAllByOrderByYearDescMonthDesc();
    }
    
    /**
     * Créer une nouvelle période ouverte avec validation de séquence
     */
    @Transactional
    public AccountingPeriod createPeriod(Integer year, Integer month) {
        // Vérifier si la période existe déjà
        if (periodRepository.findByYearAndMonth(year, month).isPresent()) {
            throw new AccountingException("Une période existe déjà pour " + year + "/" + month);
        }
        
        // Validation de séquence : Les mois précédents doivent exister pour cette année
        if (month != null && month > 1) {
            for (int i = 1; i < month; i++) {
                Optional<AccountingPeriod> precedent = periodRepository.findByYearAndMonth(year, i);
                if (precedent.isEmpty()) {
                    throw new AccountingException(
                        "Les périodes précédentes doivent être créées d'abord. Manquante : " + 
                        getMonthName(i) + " " + year);
                }
            }
        }
        
        AccountingPeriod period = AccountingPeriod.builder()
            .year(year)
            .month(month)
            .status(PeriodStatus.OPEN)
            .build();
        
        return periodRepository.save(period);
    }
    
    /**
     * Nom du mois en français
     */
    private String getMonthName(Integer month) {
        String[] months = {"", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
                          "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"};
        return month >= 1 && month <= 12 ? months[month] : "Mois " + month;
    }
    
    /**
     * Clôturer une période existante par son ID (avec validation séquentielle)
     */
    @Transactional
    public AccountingPeriod closePeriodById(Long id) {
        AccountingPeriod period = periodRepository.findById(id)
            .orElseThrow(() -> new AccountingException("Période non trouvée"));
        
        if (period.getStatus() == PeriodStatus.CLOSED) {
            throw new AccountingException("Période déjà clôturée");
        }
        
        // VALIDATION SÉQUENTIELLE: tous les mois précédents doivent être clôturés
        if (period.getMonth() != null && period.getMonth() > 1) {
            for (int i = 1; i < period.getMonth(); i++) {
                Optional<AccountingPeriod> precedent = periodRepository
                    .findByYearAndMonth(period.getYear(), i);
                if (precedent.isPresent() && precedent.get().getStatus() != PeriodStatus.CLOSED) {
                    throw new AccountingException(
                        "Impossible de clôturer cette période. Veuillez d'abord clôturer : " + 
                        getMonthName(i) + " " + period.getYear());
                }
            }
        }
        
        period.setStatus(PeriodStatus.CLOSED);
        period.setClosingDate(LocalDateTime.now());
        
        return periodRepository.save(period);
    }
    
    /**
     * Rouvrir une période clôturée (avec restriction)
     */
    @Transactional
    public AccountingPeriod reopenPeriod(Long id) {
        AccountingPeriod period = periodRepository.findById(id)
            .orElseThrow(() -> new AccountingException("Période non trouvée"));
        
        if (period.getStatus() == PeriodStatus.OPEN) {
            throw new AccountingException("Cette période est déjà ouverte");
        }
        
        // Protection : on ne peut rouvrir que si c'est le dernier mois clôturé de l'année
        if (period.getMonth() != null) {
            List<AccountingPeriod> allPeriodsThisYear = periodRepository.findByYear(period.getYear());
            boolean isLastClosedMonth = allPeriodsThisYear.stream()
                .filter(p -> p.getMonth() != null && p.getMonth() > period.getMonth() && p.getStatus() == PeriodStatus.CLOSED)
                .findAny()
                .isEmpty();
            
            if (!isLastClosedMonth) {
                throw new AccountingException(
                    "Vous ne pouvez rouvrir que le dernier mois clôturé. Rouvrez d'abord les mois ultérieurs.");
            }
        }
        
        period.setStatus(PeriodStatus.OPEN);
        period.setClosingDate(null);
        
        return periodRepository.save(period);
    }
}