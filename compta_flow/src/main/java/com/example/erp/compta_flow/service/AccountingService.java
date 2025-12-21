package com.example.erp.compta_flow.service;

import com.example.erp.compta_flow.exception.AccountingException;
import com.example.erp.compta_flow.model.entity.AccountingPeriod;
import com.example.erp.compta_flow.model.enums.PeriodStatus;
import com.example.erp.compta_flow.repository.AccountingPeriodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AccountingService {
    
    private final AccountingPeriodRepository periodRepository;
    
    /**
     * Clôturer une période comptable
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
        
        // 3. ICI : Logique de validation (à compléter quand vos collègues auront poussé leur code)
        // - Vérifier que toutes les écritures sont validées
        // - Vérifier que débit = crédit pour chaque écriture
        // - Calculer les soldes
        // Pour l'instant, on simule un succès
        
        System.out.println("TODO: Vérifier les écritures non validées pour " + year + "/" + month);
        System.out.println("TODO: Vérifier l'équilibre des écritures");
        
        // 4. Marquer comme clôturée
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
}