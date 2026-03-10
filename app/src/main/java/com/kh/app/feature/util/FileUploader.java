package com.kh.app.feature.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

public class FileUploader {

    public static String upload(MultipartFile profile , String filePath) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + UUID.randomUUID();
        String originName = profile.getOriginalFilename();
        String ext = originName.substring(originName.lastIndexOf("."));
        String changeName = fileName + ext;
        File targetFile = new File(filePath + changeName);
        profile.transferTo(targetFile);
        return changeName;
    }
}
