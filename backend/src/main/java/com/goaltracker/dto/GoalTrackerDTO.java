package com.goaltracker.dto;

import com.goaltracker.model.GoalTrackerMaster;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class GoalTrackerDTO {
    private int trackerId;
    private String goalTrackerName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private String rating;
    private List<GoalTrackerActionDTO> actions;

    // Constructor for setting goal tracker and actions
    public GoalTrackerDTO(GoalTrackerMaster goalTracker, List<GoalTrackerActionDTO> actions) {
        this.trackerId = goalTracker.getTrackerId();
        this.goalTrackerName = goalTracker.getGoalTrackerName();
        this.startDate = goalTracker.getStartDate();
        this.endDate = goalTracker.getEndDate();
        this.status = goalTracker.getStatus() != null ? goalTracker.getStatus().toString() : null;
        this.rating = goalTracker.getRating() != null ? goalTracker.getRating().toString() : null;
        this.actions = actions;
    }
}

