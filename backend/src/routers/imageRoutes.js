const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const router = express.Router();

// Cấu hình Multer để lưu ảnh vào public/images
const storage = multer.diskStorage({
    destination: "public/images",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// ✅ API lấy danh sách ảnh
router.get("/", (req, res) => {
    const imageDir = path.join(process.cwd(), "public/images");

    if (!fs.existsSync(imageDir)) {
        return res.status(404).json({ error: "Không tìm thấy thư mục ảnh." });
    }

    fs.readdir(imageDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi đọc thư mục ảnh." });
        }

        if (files.length === 0) {
            return res.status(404).json({ error: "Thư mục ảnh trống." });
        }

        // Trả về danh sách ảnh
        const imageList = files.map(file => `/images/${file}`);
        res.json(imageList);
    });
});

// ✅ API tải ảnh lên
router.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Không có tệp nào được tải lên!" });
    }
    res.json({ imagePath: `/images/${req.file.filename}` });
});

// ✅ API xóa ảnh
router.delete("/delete/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(process.cwd(), "public/images", imageName);

    if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: "Ảnh không tồn tại!" });
    }

    fs.unlink(imagePath, (err) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi xóa ảnh." });
        }
        res.json({ message: "Ảnh đã được xóa thành công." });
    });
});

module.exports = router;
