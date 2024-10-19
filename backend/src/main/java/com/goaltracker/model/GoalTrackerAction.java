package com.goaltracker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "goal_tracker_action")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalTrackerAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int actionValueId;

    @ManyToOne
    @JoinColumn(name = "tracker_id")
    private GoalTrackerMaster goalTracker;

    @ManyToOne
    @JoinColumn(name = "action_id")
    private TemplateAction templateAction;

    // Single column to store any type of value as a string for now
    private String actionValue;

    @Enumerated(EnumType.STRING)
    private Rating actionRating;

    private String additionalInfoValue;
    private String customBenchMarkValue;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String attachedDocument;

    @Column(columnDefinition = "TEXT")
    private String actionPlan;

    private LocalDateTime actionplanETA;

    private Boolean isExcluded;
    private Boolean isNotApplicable;

}
