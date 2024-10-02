package com.goaltracker.service.Interface;

import com.goaltracker.dto.ProjectWithGoalTrackerDTO;

import java.util.List;

public interface ProjectService {
    List<ProjectWithGoalTrackerDTO> getProjectsForDM(String email);
    List<ProjectWithGoalTrackerDTO> getAllProjectsForQNTeam(int accountId);
}
