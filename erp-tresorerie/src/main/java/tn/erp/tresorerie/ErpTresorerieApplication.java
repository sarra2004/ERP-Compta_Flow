package tn.erp.tresorerie;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import tn.erp.tresorerie.treasury.entity.CashAccount;
import tn.erp.tresorerie.treasury.entity.CashAccount.AccountType;
import tn.erp.tresorerie.treasury.repository.CashAccountRepository;

import java.math.BigDecimal;

@SpringBootApplication
public class ErpTresorerieApplication {

    public static void main(String[] args) {
        SpringApplication.run(ErpTresorerieApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(CashAccountRepository cashAccountRepository) {
        return args -> {
            if (cashAccountRepository.count() == 0) {

                CashAccount caisse = new CashAccount(
                        "Caisse principale",
                        AccountType.CASH,
                        null,
                        "TND",
                        new BigDecimal("0.00")
                );

                cashAccountRepository.save(caisse);
                System.out.println(" Compte de trésorerie créé avec ID : " + caisse.getId());
            }
        };
    }
}
