package com.goaltracker.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "goal_tracker_master")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalTrackerMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int trackerId;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    private String goalTrackerName;

    // Start date and end date selected by the user via UI and set from the request
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Enumerated(EnumType.STRING)
    private Rating rating;

    private boolean isLatest;

}

