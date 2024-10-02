package com.goaltracker.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProjectWithGoalTrackerDTO {
    private int projectId;
    private String projectName;
    private String templateType;

    private int trackerId;
    private String goalTrackerName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private String rating;

    public ProjectWithGoalTrackerDTO(int projectId, String projectName, String templateType,
                                     int trackerId, String goalTrackerName,
                                     LocalDateTime startDate, LocalDateTime endDate, String status, String rating) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.templateType = templateType;
        this.trackerId = trackerId;
        this.goalTrackerName = goalTrackerName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.rating = rating;
    }
}
