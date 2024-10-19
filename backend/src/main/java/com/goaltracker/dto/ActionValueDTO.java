package com.goaltracker.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ActionValueDTO {
    private String actionValue;
    private int actionId;
    private Boolean isNotApplicable;
    private Boolean isExcluded;
    private String additionalInfoValue;
    private String customBenchMarkValue;
    private String actionPlan;
    private LocalDateTime actionPlanETA;
}
