package com.goaltracker.dto;

import com.goaltracker.model.Project;
import com.goaltracker.model.TemplateTypes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private int projectId;
    private String projectName;
    private TemplateTypes templateType;

    public ProjectDTO(Project project) {
        this.projectId = project.getProjectId();
        this.projectName = project.getProjectName();
        this.templateType = project.getTemplateType();
    }
}
