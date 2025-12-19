package com.example.erp.compta_flow.services;

import com.example.erp.compta_flow.models.CompteComptable;
import com.example.erp.compta_flow.repository.CompteComptableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompteComptableService {

    @Autowired
    private CompteComptableRepository repository;

    public CompteComptable createAccount(CompteComptable acc) throws Exception {
        if (repository.findByNumero(acc.getNumero()).isPresent()) {
            throw new Exception("Account number already exists");
        }
        return repository.save(acc);
    }

    public CompteComptable updateAccount(Long id, CompteComptable updated) throws Exception {
        CompteComptable acc = repository.findById(id).orElseThrow(() -> new Exception("Account not found"));

        if (updated.getNumero() != null && !updated.getNumero().equals(acc.getNumero())) {
            if (repository.findByNumero(updated.getNumero()).isPresent()) {
                throw new Exception("New account number already exists");
            }
            acc.setNumero(updated.getNumero());
        }

        if (updated.getIntitule() != null && !updated.getIntitule().isBlank()) {
            acc.setIntitule(updated.getIntitule());
        }

        if (updated.getClasse() != null && updated.getClasse() >= 1 && updated.getClasse() <= 8) {
            acc.setClasse(updated.getClasse());
        }

        if (updated.getType() != null) {
            acc.setType(updated.getType());
        }

        return repository.save(acc);
    }

    public void disableAccount(Long id) throws Exception {
        CompteComptable acc = repository.findById(id).orElseThrow(() -> new Exception("Account not found"));
        acc.setStatus(CompteComptable.Status.INACTIVE);
        repository.save(acc);
    }

    public void deleteAccount(Long id) throws Exception {
        CompteComptable acc = repository.findById(id).orElseThrow(() -> new Exception("Account not found"));
        if (accountIsUsed(id)) {
            throw new Exception("Cannot delete an account with linked entries");
        }
        repository.delete(acc);
    }

    public List<CompteComptable> listAccounts() {
        return repository.findAll();
    }

    private boolean accountIsUsed(Long id) {
        // TODO: implement your logic to check if account has linked entries
        return false;
    }
}

