package com.goaltracker.service.Interface;

import com.goaltracker.dto.ProjectWithGoalTrackerDTO;
import com.goaltracker.model.TemplateAction;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

public interface ExcelService {
    /**
     * Generates an Excel file for the given list of projects with their goal trackers and actions.
     *
     * @param projects List of ProjectWithGoalTrackerDTO objects containing project and goal tracker data
     * @return ByteArrayInputStream of the generated Excel file
     * @throws IOException If an error occurs during the creation of the Excel file
     */
    ByteArrayInputStream generateExcel(List<ProjectWithGoalTrackerDTO> projects, List<TemplateAction> templateActions) throws IOException;
}
