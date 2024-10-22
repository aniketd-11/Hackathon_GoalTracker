package com.goaltracker.service.Impl;

import com.goaltracker.dto.GoalTrackerActionDTO;
import com.goaltracker.dto.GoalTrackerDTO;
import com.goaltracker.dto.ProjectWithGoalTrackerDTO;
import com.goaltracker.model.TemplateAction;
import com.goaltracker.service.Interface.ExcelService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelServiceImpl implements ExcelService {

    public ByteArrayInputStream generateExcel(List<ProjectWithGoalTrackerDTO> projects, List<TemplateAction> templateActions) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Goal Trackers");

            // Create header row for Project Name, Tracker Name, and Action Names from TemplateAction
            createHeaderRow(sheet, workbook, templateActions);

            // Add rows for each project and goal tracker
            int rowIdx = 1;
            for (ProjectWithGoalTrackerDTO project : projects) {
                for (GoalTrackerDTO tracker : project.getGoalTrackers()) {
                    rowIdx = createTrackerRow(sheet, rowIdx, project, tracker, templateActions, workbook);
                }
            }

            // Resize all columns to fit the content
            for (int i = 0; i < templateActions.size() + 5; i++) { // +5 for Project Name, Tracker Name, and Date columns
                sheet.setColumnWidth(i,5000);
            }

            // Write to ByteArrayOutputStream
            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                workbook.write(outputStream);
                return new ByteArrayInputStream(outputStream.toByteArray());
            }
        }
    }

    private void createHeaderRow(Sheet sheet, Workbook workbook, List<TemplateAction> templateActions) {
        Row headerRow = sheet.createRow(0);
        CellStyle headerStyle = createHeaderCellStyle(workbook);

        // Create fixed columns: Project Name, Tracker Name, Goal, Start Date, and End Date
        headerRow.createCell(0).setCellValue("Project Name");
        headerRow.createCell(1).setCellValue("Tracker Name");
        headerRow.createCell(2).setCellValue("Goal (Sprint/Release)");
        headerRow.createCell(3).setCellValue("Start Date");
        headerRow.createCell(4).setCellValue("End Date");


        // Create dynamic columns for each TemplateAction
        int colIdx = 5;
        for (TemplateAction action : templateActions) {
            headerRow.createCell(colIdx).setCellValue(action.getActionName());

            // Apply color based on the actionCategory (MAJOR -> Red, MINOR -> Yellow)
            if ("MAJOR".equalsIgnoreCase(action.getActionCategory().toString())) {
                headerRow.getCell(colIdx).setCellStyle(createRedStyle(workbook));
            } else if ("MINOR".equalsIgnoreCase(action.getActionCategory().toString())) {
                headerRow.getCell(colIdx).setCellStyle(createYellowStyle(workbook));
            } else {
                headerRow.getCell(colIdx).setCellStyle(headerStyle);  // Default style for other categories
            }

            colIdx++;
        }

        // Apply style to the fixed columns
        for (int i = 0; i < 5; i++) {
            headerRow.getCell(i).setCellStyle(headerStyle);
        }
    }

    private int createTrackerRow(Sheet sheet, int rowIdx, ProjectWithGoalTrackerDTO project, GoalTrackerDTO tracker, List<TemplateAction> templateActions, Workbook workbook) {
        Row trackerRow = sheet.createRow(rowIdx++);

        CellStyle ratingStyle = getRatingStyle(tracker, workbook);

        // Apply rating style to the Project Name cell
        Cell projectNameCell = trackerRow.createCell(0);
        projectNameCell.setCellValue(project.getProjectName());
        projectNameCell.setCellStyle(ratingStyle);

        // Fill in the fixed columns: Project Name, Tracker Name, Goal (Sprint/Release), Start Date, and End Date
        trackerRow.createCell(1).setCellValue(tracker.getGoalTrackerName());
        trackerRow.createCell(2).setCellValue(tracker.getTrackerType());
        trackerRow.createCell(3).setCellValue(tracker.getStartDate().toString());
        trackerRow.createCell(4).setCellValue(tracker.getEndDate().toString());

        // Fill in action values for each TemplateAction
        int colIdx = 5;
        for (TemplateAction templateAction : templateActions) {
            // Find the corresponding action value for this templateAction
            GoalTrackerActionDTO actionDTO = findActionForTemplateAction(tracker.getActions(), templateAction);

            if (actionDTO != null) {
                // Set the action value in the cell
                trackerRow.createCell(colIdx).setCellValue(actionDTO.getActionValue());
            } else {
                // Leave cell empty if no corresponding action is found
                trackerRow.createCell(colIdx).setCellValue("");
            }
            colIdx++;
        }

        return rowIdx;
    }

    private GoalTrackerActionDTO findActionForTemplateAction(List<GoalTrackerActionDTO> actions, TemplateAction templateAction) {
        // Find the action that matches the templateAction based on actionId
        return actions.stream()
                .filter(actionDTO -> actionDTO.getActionId() == templateAction.getActionId())
                .findFirst()
                .orElse(null);
    }

    private CellStyle createHeaderCellStyle(Workbook workbook) {
        Font font = workbook.createFont();
        font.setBold(true);
        CellStyle style = workbook.createCellStyle();
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setWrapText(true);
        return style;
    }

    private CellStyle getRatingStyle(GoalTrackerDTO tracker, Workbook workbook) {
        // Check if the tracker has a rating and return the appropriate style
        if (tracker.getRating() != null) {
            switch (tracker.getRating().toUpperCase()) {
                case "RED":
                    return createRedStyle(workbook);
                case "GREEN":
                    return createGreenStyle(workbook);
                case "YELLOW":
                    return createYellowStyle(workbook);
                default:
                    return createHeaderCellStyle(workbook);
            }
        } else {
            // Default style if no rating is present
            return createHeaderCellStyle(workbook);
        }
    }

    private CellStyle createGreenStyle(Workbook workbook) {
        Font font = workbook.createFont();
        font.setBold(true);
        CellStyle style = workbook.createCellStyle();
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setFillForegroundColor(IndexedColors.GREEN.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setWrapText(true);
        return style;
    }

    private CellStyle createRedStyle(Workbook workbook) {
        Font font = workbook.createFont();
        font.setBold(true);
        CellStyle style = workbook.createCellStyle();
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setFillForegroundColor(IndexedColors.RED.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setWrapText(true);
        return style;
    }

    private CellStyle createYellowStyle(Workbook workbook) {
        Font font = workbook.createFont();
        font.setBold(true);
        CellStyle style = workbook.createCellStyle();
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setFillForegroundColor(IndexedColors.YELLOW.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setWrapText(true);
        return style;
    }

}
