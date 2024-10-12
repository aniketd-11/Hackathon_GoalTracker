package com.goaltracker.service.Impl;

import com.goaltracker.service.Interface.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class FileStorageImpl implements FileStorageService {

    private final String uploadDirectory = "uploads/";  // Define the upload directory path

    @Override
    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null; // No file uploaded
        }

        // Get the absolute path to the "uploads" directory within the project folder
        String projectRootPath = System.getProperty("user.dir");  // Get the project root directory
        String absoluteUploadPath = Paths.get(projectRootPath, uploadDirectory).toString();

        // Ensure the upload directory exists, create it if it doesn't
        File directory = new File(absoluteUploadPath);
        if (!directory.exists()) {
            directory.mkdirs();  // Create the directory if it doesn't exist
        }

        // Generate a unique file name
        String fileName = System.currentTimeMillis() + "_" + sanitizeFileName(file.getOriginalFilename());
        String filePath = Paths.get(absoluteUploadPath, fileName).toString();

        // Save the file to the project's "uploads" folder
        File destFile = new File(filePath);
        file.transferTo(destFile);

        return filePath;  // Return the absolute path where the file is saved
    }




    /**
     * Sanitizes file name to prevent directory traversal and other issues.
     */
    private String sanitizeFileName(String originalFileName) {
        return originalFileName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
    }
}
