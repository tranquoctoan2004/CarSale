package com.firefire.carsale.util;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path; // Sửa lỗi import ở đây
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

public class FileUtil {

    public static String saveFile(MultipartFile file, String uploadDir) throws IOException {
        String projectRoot = System.getProperty("user.dir");
        Path uploadPath = Paths.get(projectRoot, uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Làm sạch tên file (xóa khoảng trắng)
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");

        try (InputStream inputStream = file.getInputStream()) {
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);

            // TRẢ VỀ ĐƯỜNG DẪN CHUẨN: /uploads/cars/tên_file.jpg
            return "/" + uploadDir + "/" + fileName;
        }
    }

    public static boolean deleteFile(String relativePath) {
        if (relativePath == null || relativePath.isEmpty())
            return false;

        // Chuyển đường dẫn tương đối từ DB thành đường dẫn tuyệt đối trên ổ đĩa
        String projectRoot = System.getProperty("user.dir");
        // relativePath thường bắt đầu bằng "/", cần xóa nó để nối chuỗi đúng
        String cleanPath = relativePath.startsWith("/") ? relativePath.substring(1) : relativePath;

        File file = new File(projectRoot + File.separator + cleanPath);
        return file.exists() && file.delete();
    }
}