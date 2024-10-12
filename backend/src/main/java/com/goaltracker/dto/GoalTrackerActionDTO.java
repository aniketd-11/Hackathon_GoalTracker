package com.goaltracker.dto;

import com.goaltracker.model.Rating;
import com.goaltracker.model.TemplateAction;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class GoalTrackerActionDTO {
    // Fields from GoalTrackerAction
    private String actionValue;
    private String actionRating;
    private Boolean isNotApplicable;  // Add the is_not_applicable field
    private String attachedDocument;

    // Fields from TemplateAction
    private int actionId;
    private String templateTypes;
    private String actionName;
    private String actionType;
    private String benchmarkValue;
    private String comparisonOperator;
    private String additionalInfo;
    private String actionOptions;
    private String actionCategory;
    private LocalDateTime createdAt;

    // Constructor to populate from entities
    public GoalTrackerActionDTO(String actionValue, Rating actionRating,Boolean isNotApplicable, String attachedDocument, TemplateAction templateAction) {
        this.actionValue = actionValue;

        // Convert Rating enum to String only if it's an enum; leave null if Rating is null
        this.actionRating = actionRating != null ? actionRating.toString() : null;
        this.isNotApplicable = isNotApplicable;
        this.attachedDocument = attachedDocument;

        // Fields from TemplateAction (direct assignment if they are already Strings)
        this.actionId = templateAction.getActionId();
        this.templateTypes = templateAction.getTemplateTypes() != null ? templateAction.getTemplateTypes().toString() : null;
        this.actionName = templateAction.getActionName();
        this.actionType = templateAction.getActionType() != null ? templateAction.getActionType().toString() : null;
        this.benchmarkValue = templateAction.getBenchmarkValue();  // Already a string
        this.comparisonOperator = templateAction.getComparisonOperator() != null ? templateAction.getComparisonOperator().toString() : null;
        this.additionalInfo = templateAction.getAdditionalInfo();  // Already a string
        this.actionOptions = templateAction.getActionOptions();    // Already a string
        this.actionCategory = templateAction.getActionCategory() != null ? templateAction.getActionCategory().toString() : null;
        this.createdAt = templateAction.getCreatedAt();  // Already a LocalDateTime object
    }
}
