package com.goaltracker.service.Impl;

import com.goaltracker.service.Interface.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;

@Service
public class FileStorageImpl implements FileStorageService {

    private final String uploadDirectory = "uploads/";  // Define the upload directory path

    @Override
    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null; // No file uploaded
        }

        byte[] fileBytes = file.getBytes();
        String base64EncodedImage = Base64.getEncoder().encodeToString(fileBytes);

        return base64EncodedImage;

    }

    /**
     * Sanitizes file name to prevent directory traversal and other issues.
     */
    private String sanitizeFileName(String originalFileName) {
        return originalFileName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
    }
}
