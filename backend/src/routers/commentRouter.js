const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middlewares/middleware');

router.get('/', commentController.getAllComment);

router.post('/create', authenticate, commentController.createComment);

router.delete('/:id', commentController.deleteCommentById);

router.put('/:id', commentController.updateCommentById);

router.get('/article/:articleId', commentController.getCommentsByArticleId);

module.exports = router;    