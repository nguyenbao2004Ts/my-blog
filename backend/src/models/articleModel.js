const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },  // Lưu nội dung bài viết trực tiếp
    image: { type: String, required: true },// lưu đường dẫn ảnh trong public/images
    tag: { type: [String], required: true },
    time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('article', articleSchema);
