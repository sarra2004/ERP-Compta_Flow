package com.example.erp.compta_flow.services;

import com.example.erp.compta_flow.models.MouvementTresorerie;
import com.example.erp.compta_flow.repository.MouvementTresorerieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TresorerieService {

    @Autowired
    private MouvementTresorerieRepository repository;

    public List<MouvementTresorerie> findAll() {
        return repository.findAllByOrderByDateDesc();
    }

    public MouvementTresorerie create(MouvementTresorerie mouvement) {
        return repository.save(mouvement);
    }

    public List<MouvementTresorerie> findByPeriod(LocalDate start, LocalDate end) {
        return repository.findByDateBetween(start, end);
    }

    public List<MouvementTresorerie> findByType(MouvementTresorerie.TypeMouvement type) {
        return repository.findByType(type);
    }

    public Double calculateSolde() {
        List<MouvementTresorerie> mouvements = repository.findAll();
        return mouvements.stream()
            .mapToDouble(m -> m.getType() == MouvementTresorerie.TypeMouvement.ENTREE 
                ? m.getMontant() 
                : -m.getMontant())
            .sum();
    }
}
