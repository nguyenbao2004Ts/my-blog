const commentModel = require('../models/commentModel');
const articleModel = require('../models/articleModel');

class commentController {
    // Lấy tất cả bình luận
    async getAllComment(req, res) {
        try {
            const comments = await commentModel.find({});
            res.json(comments);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // Tạo bình luận mới
    async createComment(req, res) {
        try {
            const { comment, articleId } = req.body;
            const username = req.user?.username; // Lấy username từ middleware authenticate
    
            if (!username) {
                return res.status(401).json({ message: "Bạn cần đăng nhập để bình luận" });
            }
    
            // Kiểm tra xem articleId có tồn tại không
            const articleExists = await articleModel.findById(articleId);
            if (!articleExists) {
                return res.status(404).json({ message: "Bài viết không tồn tại" });
            }
    
            const newComment = new commentModel({ comment, articleId, username }); // Thêm username vào comment
            await newComment.save();
            res.status(201).json(newComment);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // Xóa bình luận theo ID
    async deleteCommentById(req, res) {
        try {
            const deletedComment = await commentModel.findByIdAndDelete(req.params.id);
            if (!deletedComment) {
                return res.status(404).json({ message: "Không tìm thấy bình luận" });
            }
            res.json({ message: "Bình luận đã xóa" });
        } catch (err) {
            res.status(500).json({ message: "Lỗi không xóa được bình luận" });
        }
    }

    // Cập nhật bình luận theo ID
    async updateCommentById(req, res) {
        try {
            const { comment } = req.body;
            const updatedComment = await commentModel.findByIdAndUpdate(
                req.params.id,
                { comment },
                { new: true }
            );
            if (!updatedComment) {
                return res.status(404).json({ message: "Không tìm thấy bình luận" });
            }
            res.json({ message: "Bình luận đã được cập nhật", updatedComment });
        } catch (err) {
            res.status(500).json({ message: "Lỗi không cập nhật được bình luận" });
        }
    }

    // Lấy tất cả bình luận của một bài viết (theo articleId)
    async getCommentsByArticleId(req, res) {
        try {
            const { articleId } = req.params;
            const comments = await commentModel.find({ articleId }).sort({ createdAt: -1 }); // Lấy mới nhất trước
            res.json(comments);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    
}

module.exports = new commentController();