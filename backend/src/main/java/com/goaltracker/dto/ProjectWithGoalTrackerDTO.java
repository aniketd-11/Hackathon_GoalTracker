package com.goaltracker.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProjectWithGoalTrackerDTO {
    private int projectId;
    private String projectName;
    private String templateType;
    private List<GoalTrackerDTO> goalTrackers;

    public ProjectWithGoalTrackerDTO(int projectId, String projectName, String templateType, List<GoalTrackerDTO> goalTrackers) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.templateType = templateType;
        this.goalTrackers = goalTrackers;
    }
}
