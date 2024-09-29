package com.goaltracker.service.Interface;

import com.goaltracker.dto.ProjectDTO;

import java.util.List;

public interface ProjectService {
    List<ProjectDTO> getProjectsForDM(String email);
    List<ProjectDTO> getAllProjectsForQNTeam(int accountId);
}
