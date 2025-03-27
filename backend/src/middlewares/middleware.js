const auth = require('../utils/auth');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json("Access denied");
    }

    const user = auth.verifyToken(token);
    if (!user) {
        return res.status(403).json("Invalid token");
    }

    req.user = user;
    req.locals = user;
    next();
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json("Access denied. Admin only.");
    }
    next();
};
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Không có token xác thực' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded; // Lưu thông tin user vào request
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token không hợp lệ' });
    }
};
module.exports = {
    authMiddleware,
    adminMiddleware,
    authenticate
};