const articleModel = require('../models/articleModel');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Cấu hình Multer để lưu ảnh vào public/images
const storage = multer.diskStorage({
    destination: "public/images",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage }).single("image");

class articleController {
    // Lấy tất cả bài viết
    async getAllArticle(req, res) {
        try {
            const articles = await articleModel.find({});
            res.json(articles);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Lấy bài viết theo ID
    async getArticleById(req, res) {
        try {
            const article = await articleModel.findById(req.params.id);
            if (!article) {
                return res.status(404).json({ message: "Bài viết không tồn tại" });
            }
            res.json(article);
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy bài viết", error });
        }
    }

    // Tạo bài viết mới
    async createArticle(req, res) {
        upload(req, res, async (err) => {
            if (err) return res.status(500).json({ error: "Lỗi tải ảnh lên" });
            try {
                const { title, shortDescription, content, tag } = req.body;
                if (!title || !shortDescription || !content || !req.file || !tag) {
                    return res.status(400).json({ error: "Thiếu thông tin bài viết!" });
                }
                const newArticle = new articleModel({
                    title,
                    shortDescription,
                    content,
                    image: `/images/${req.file.filename}`,
                    tag: JSON.parse(tag),
                    time: new Date()
                });
                await newArticle.save();
                res.json({ message: "Bài viết đã được tạo!", newArticle });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    }

    async updateArticleById(req, res) {
        upload(req, res, async (err) => {
            if (err) return res.status(500).json({ error: "Lỗi tải ảnh lên" });
    
            try {
                console.log("🔍 ID bài viết cần cập nhật:", req.params.id);
                console.log("📥 Dữ liệu gửi lên:", req.body);
    
                const article = await articleModel.findById(req.params.id);
                if (!article) {
                    return res.status(404).json({ message: "Không tìm thấy bài viết" });
                }
    
                // Dữ liệu cập nhật
                const updateData = {
                    title: req.body.title || article.title,
                    shortDescription: req.body.shortDescription || article.shortDescription,
                    content: req.body.content || article.content,
                    tag: req.body.tag ? JSON.parse(req.body.tag) : article.tag,
                    time: new Date()
                };
    
                // Nếu có ảnh mới, xóa ảnh cũ và cập nhật ảnh mới
                if (req.file) {
                    console.log("🖼 Cập nhật ảnh mới:", req.file.filename);
                    const oldImagePath = path.join(__dirname, "../../public", article.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                    updateData.image = `/images/${req.file.filename}`;
                } else {
                    console.log("📌 Không có ảnh mới, giữ ảnh cũ.");
                    updateData.image = article.image;
                }
    
                // Cập nhật bài viết
                const updatedArticle = await articleModel.findByIdAndUpdate(
                    req.params.id,
                    { $set: updateData },
                    { new: true }
                );
    
                console.log("✅ Bài viết đã cập nhật:", updatedArticle);
                res.json({ message: "Bài viết đã được cập nhật", updatedArticle });
            } catch (err) {
                console.error("❌ Lỗi khi cập nhật bài viết:", err.message);
                res.status(500).json({ message: "Lỗi không cập nhật được bài viết", error: err.message });
            }
        });
    }
        
    

    // Xóa bài viết theo ID
    async deleteArticleById(req, res) {
        try {
            const article = await articleModel.findById(req.params.id);
            if (!article) return res.status(404).json({ message: "Không tìm thấy bài viết" });

            const imagePath = path.join(__dirname, "../../public", article.image);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

            await articleModel.findByIdAndDelete(req.params.id);
            res.json({ message: "Bài viết đã xóa" });
        } catch (err) {
            res.status(500).json({ message: "Lỗi không xóa được bài viết" });
        }
    }
}

module.exports = new articleController();
