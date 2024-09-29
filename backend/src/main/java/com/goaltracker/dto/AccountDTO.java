package com.goaltracker.dto;

import com.goaltracker.model.Account;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class AccountDTO {
    private int accountId;
    private String accountName;

    public AccountDTO(Account account) {
        this.accountId = account.getAccountId();
        this.accountName = account.getAccount_name();
    }
}

