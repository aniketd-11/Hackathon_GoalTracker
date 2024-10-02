package com.goaltracker.controller;

import com.goaltracker.dto.AccountDTO;
import com.goaltracker.dto.ProjectWithGoalTrackerDTO;
import com.goaltracker.service.Interface.AccountService;
import com.goaltracker.service.Interface.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class AccountProjectController {

    private final ProjectService projectService;
    private final AccountService accountService;

    // Constructor injection
    public AccountProjectController(ProjectService projectService,AccountService accountService) {
        this.projectService = projectService;
        this.accountService = accountService;
    }

    @GetMapping("/qn/accounts")
    public ResponseEntity<List<AccountDTO>> getAllAccountsForQNTeam() {
        try {
            List<AccountDTO> accountList = accountService.getAllAccountsForQNTeam();
            return ResponseEntity.ok(accountList);
        } catch (Exception e) {
            // Return internal server error in case of exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/qn/projects")
    public ResponseEntity<List<ProjectWithGoalTrackerDTO>> getAllProjectsForQNTeam(@RequestParam int accountId) {
        try {
            List<ProjectWithGoalTrackerDTO> projectList = projectService.getAllProjectsForQNTeam(accountId);
            return ResponseEntity.ok(projectList);
        } catch (Exception e) {
            // Return internal server error in case of exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    // Endpoint for DM to get their assigned projects
    @GetMapping("/dm/projects")
    public ResponseEntity<?> getProjectsForDM(@RequestParam String email) {
        try{
            List<ProjectWithGoalTrackerDTO> projectList = projectService.getProjectsForDM(email);
            if (!projectList.isEmpty()) {
                return ResponseEntity.ok(projectList); // Return the list if not empty
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No projects found for the given DM");
            }
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching projects");
        }
    }
}

