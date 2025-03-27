const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'article', required: true },
    username: { type: String, required: true } // Thêm trường username
}, { timestamps: true }); // Thêm timestamps để tự động lưu thời gian

module.exports = mongoose.model('comment', commentSchema);
