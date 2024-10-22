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
    private boolean isLatest;
    private String templateType;
    private String trackerType;
    private String qnNotes;
    private String dmNotes;
    private List<GoalTrackerActionDTO> actions;

    // Constructor for setting goal tracker and actions
    public GoalTrackerDTO(GoalTrackerMaster goalTracker, List<GoalTrackerActionDTO> actions) {
        this.trackerId = goalTracker.getTrackerId();
        this.goalTrackerName = goalTracker.getGoalTrackerName();
        this.startDate = goalTracker.getStartDate();
        this.endDate = goalTracker.getEndDate();
        this.status = goalTracker.getStatus() != null ? goalTracker.getStatus().toString() : null;
        this.rating = goalTracker.getRating() != null ? goalTracker.getRating().toString() : null;
        this.isLatest = goalTracker.isLatest();
        this.templateType = goalTracker.getTemplateType() != null ? goalTracker.getTemplateType().toString() : null;
        this.trackerType = goalTracker.getTrackerType();
        this.qnNotes = goalTracker.getQn_notes();
        this.dmNotes = goalTracker.getDm_notes();
        this.actions = actions;
    }

    // Constructor for setting goal tracker only
    public GoalTrackerDTO(GoalTrackerMaster goalTracker) {
        this.trackerId = goalTracker.getTrackerId();
        this.goalTrackerName = goalTracker.getGoalTrackerName();
        this.startDate = goalTracker.getStartDate();
        this.endDate = goalTracker.getEndDate();
        this.status = goalTracker.getStatus() != null ? goalTracker.getStatus().toString() : null;
        this.rating = goalTracker.getRating() != null ? goalTracker.getRating().toString() : null;
        this.isLatest = goalTracker.isLatest();
        this.templateType = goalTracker.getTemplateType() != null ? goalTracker.getTemplateType().toString() : null;
        this.trackerType = goalTracker.getTrackerType();
        this.qnNotes = goalTracker.getQn_notes();
        this.dmNotes = goalTracker.getDm_notes();
    }
}
