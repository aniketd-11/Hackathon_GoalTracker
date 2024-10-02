package com.goaltracker.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "template_actions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TemplateAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int actionId;

    @Enumerated(EnumType.STRING)
    private TemplateTypes templateTypes;

    private String actionName;

    @Enumerated(EnumType.STRING)
    private ActionType actionType;

    private String benchmarkValue;

    @Enumerated(EnumType.STRING)
    private ComparisonOperator comparisonOperator;

    private String additionalInfo;

    private String actionOptions;

    private LocalDateTime createdAt;

    // Enum for defining different types of actions
    public enum ActionType {
        STRING, NUMERIC, PERCENTAGE, COUNT,BOOLEAN
    }

    // Enum for different comparison operators
    public enum ComparisonOperator {
        GREATER_THAN_EQUAL, LESS_THAN_EQUAL, EQUAL, NOT_EQUAL
    }
}
