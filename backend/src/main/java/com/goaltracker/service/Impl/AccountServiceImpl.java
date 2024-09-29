package com.goaltracker.service.Impl;

import com.goaltracker.dto.AccountDTO;
import com.goaltracker.repository.AccountRepository;
import com.goaltracker.service.Interface.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public List<AccountDTO> getAllAccountsForQNTeam() {
        return accountRepository.findAll()
                .stream()
                .map(AccountDTO::new)
                .collect(Collectors.toList());
    }
}
