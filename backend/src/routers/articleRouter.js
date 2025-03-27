const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

router.get('/', articleController.getAllArticle);
router.get('/:id', articleController.getArticleById);
router.post('/create', articleController.createArticle);
router.delete('/:id', articleController.deleteArticleById);
router.put('/:id', articleController.updateArticleById);

module.exports = router;
