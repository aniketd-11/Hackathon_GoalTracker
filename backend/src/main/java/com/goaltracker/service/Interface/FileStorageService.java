package com.goaltracker.service.Interface;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {
    /**
     * Saves the uploaded file to the server's file system.
     *
     * @param file the file to be saved
     * @return the path where the file is saved, or null if no file was uploaded
     * @throws IOException if there is an error saving the file
     */
    String saveFile(MultipartFile file) throws IOException;
}
