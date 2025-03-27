const accountModel = require('../models/accountModel');
const bcrypt = require('bcrypt');
const auth = require('../utils/auth');

class accountController {
    async getAllAccount(req, res) {
        try {
            const accounts = await accountModel.find({});
            res.json(accounts);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async createAccount(req, res) {
        try {
            const newAccount = new accountModel(req.body);
            await newAccount.save();
            res.json(newAccount);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async registerUser(req, res) {
        try {
            // Đặt role mặc định là 'user'
            const userData = { ...req.body, role: 'user' };
            const newAccount = new accountModel(userData);
            await newAccount.save();
            res.status(201).json({
                message: "Đăng ký thành công!",
                account: newAccount
            });
        } catch (err) {
            res.status(400).json({ 
                message: "Đăng ký thất bại",
                error: err.message 
            });
        }
    }

    async deleteAccountById(req, res) {
        try {
            const deletedAccount = await accountModel.findByIdAndDelete(req.params.id);
            if (!deletedAccount) {
                return res.status(404).json({ message: "Không tìm thấy account" });
            }
            res.json({ message: "Account đã xóa" });
        } catch (err) {
            res.status(500).json({ message: "Lỗi không xóa được account" });
        }
    }

    async updateAccountById(req, res) {
        try {
            const updatedAccount = await accountModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updatedAccount) {
                return res.status(404).json({ message: "Không tìm thấy account" });
            }
            res.json({ message: "Account đã được cập nhật", updatedAccount });
        } catch (err) {
            res.status(500).json({ message: "Lỗi không cập nhật được account" });
        }
    }

    async loginAccount(req, res) {
        const { username, password } = req.body;
        try {
            const account = await accountModel.findOne({ username });
            if (!account) {
                return res.status(400).json({ message: "Username không tồn tại!" });
            }
    
            const checkPassword = await bcrypt.compare(password, account.password);
            if (!checkPassword) {
                return res.status(400).json({ message: "Mật khẩu không đúng!" });
            }
    
            const payload = {
                id: account._id,
                username: account.username,
                email: account.email,
                role: account.role
            };
    
            const token = auth.generateAccessToken(payload);
    
            res.cookie('accessToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    
            // Tạo thông báo theo role
            const roleMessage = account.role === 'admin' ? "Đăng nhập Admin thành công!" : "Đăng nhập User thành công!";
    
            res.status(200).json({
                message: roleMessage,
                token: token,
                user: {
                  id: account._id,
                  username: account.username,
                  role: account.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
}

module.exports = new accountController();