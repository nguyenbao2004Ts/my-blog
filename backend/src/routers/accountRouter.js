const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { authMiddleware, adminMiddleware } = require('../middlewares/middleware');

router.get('/', authMiddleware, adminMiddleware, accountController.getAllAccount);

router.post('/create', authMiddleware, adminMiddleware, accountController.createAccount);

router.post('/register', accountController.registerUser);

router.delete('/:id', authMiddleware, adminMiddleware, accountController.deleteAccountById);

router.put('/:id', authMiddleware, adminMiddleware, accountController.updateAccountById);

router.post('/login', accountController.loginAccount);


module.exports = router;