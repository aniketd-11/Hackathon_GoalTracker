package com.goaltracker.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ActionPlanRequestDTO {
    private int actionId;
    private String actionPlan;
    private LocalDateTime actionPlanETA;
}
