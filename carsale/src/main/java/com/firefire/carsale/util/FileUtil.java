package com.firefire.carsale.util;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

public class FileUtil {

    public static String saveFile(MultipartFile file, String uploadDir) throws IOException {
        String originalName = file.getOriginalFilename();
        String ext = originalName.substring(originalName.lastIndexOf("."));
        String newName = UUID.randomUUID() + ext;
        File dest = new File(uploadDir + File.separator + newName);
        dest.getParentFile().mkdirs();
        file.transferTo(dest);
        return newName;
    }

    public static boolean deleteFile(String path) {
        File file = new File(path);
        return file.exists() && file.delete();
    }
}
