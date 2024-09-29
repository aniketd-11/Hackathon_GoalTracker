package com.goaltracker.service.Interface;

import com.goaltracker.dto.AccountDTO;
import com.goaltracker.dto.ProjectDTO;

import java.util.List;

public interface AccountService {
    List<AccountDTO> getAllAccountsForQNTeam();
}
