package com.goaltracker.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProjectWithGoalTrackerDTO {
    private int projectId;
    private String projectName;
    private String templateType;
    private String projectRating;
    private List<GoalTrackerDTO> goalTrackers;

    public ProjectWithGoalTrackerDTO(int projectId, String projectName, String templateType,String projectRating,
                                     List<GoalTrackerDTO> goalTrackers) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.templateType = templateType;
        this.projectRating = projectRating;
        this.goalTrackers = goalTrackers;
    }
}
