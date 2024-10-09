package com.goaltracker.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GoalTrackerRequestDTO {
    private String goalTrackerName;
    private String type;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int projectId;
}