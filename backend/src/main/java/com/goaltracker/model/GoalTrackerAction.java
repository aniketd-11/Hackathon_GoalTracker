package com.goaltracker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    private Boolean isNotApplicable;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String attachedDocument;

}
