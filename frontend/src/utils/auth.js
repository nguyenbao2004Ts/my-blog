// src/utils/auth.js
import { login } from '@/api/accountApi';
import router from '@/router';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:4000',
  withCredentials: true
});

// Mã hóa dữ liệu
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), process.env.VUE_APP_CRYPTO_SECRET || 'secret_key').toString();
};

// Giải mã dữ liệu
const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.VUE_APP_CRYPTO_SECRET || 'secret_key');
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Lưu thông tin user vào localStorage (đã mã hóa)
const saveUserData = (userData) => {
  const encryptedUser = encryptData(userData.user);
  localStorage.setItem('user', encryptedUser);
  localStorage.setItem('token', userData.token);
  localStorage.setItem('role', userData.user.role);
  localStorage.setItem('lastActivity', Date.now().toString());
  
  // Thiết lập tự động đăng xuất
  setupAutoLogout();
};

// Xóa thông tin user khi logout
const clearUserData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('lastActivity');
  clearTimeout(window.logoutTimer);
};

// Lấy thông tin user từ localStorage (đã giải mã)
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? decryptData(user) : null;
};

// Lấy token từ localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Kiểm tra role hiện tại
const getCurrentRole = () => {
  return localStorage.getItem('role');
};

// Kiểm tra có phải admin không
const isAdmin = () => {
  return getCurrentRole() === 'admin';
};

// Hàm kiểm tra đã đăng nhập
const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  // Kiểm tra token hết hạn
  if (isTokenExpired(token)) {
    clearUserData();
    return false;
  }
  
  return true;
};

// Hàm kiểm tra token hết hạn
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (e) {
    return true;
  }
};

// Hàm tự động refresh token
const refreshToken = async () => {
  try {
    const response = await API.post('/api/account/refresh-token', {}, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    if (response.data.token) {
      saveUserData(response.data);
      return true;
    }
    return false;
  } catch (error) {
    clearUserData();
    return false;
  }
};

// Hàm đăng nhập
const userLogin = async (username, password) => {
  try {
    const response = await login(username, password);
    if (response.token) {
      saveUserData(response);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

// Hàm đăng xuất
const userLogout = () => {
  clearUserData();
  router.push('/login');
};

// Thiết lập tự động đăng xuất
const setupAutoLogout = () => {
  // Clear timeout cũ nếu có
  if (window.logoutTimer) {
    clearTimeout(window.logoutTimer);
  }
  
  // 1 giờ = 3600000 ms
  const timeout = 3600000; 
  window.logoutTimer = setTimeout(() => {
    userLogout();
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }, timeout);
};

// Middleware kiểm tra quyền truy cập route
const checkAuth = (to, from, next) => {
  const token = getToken();
  const requiredRole = to.meta.requiresRole;
  const currentRole = getCurrentRole();

  // Nếu route yêu cầu auth mà không có token
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    return next('/login');
  }

  // Nếu route yêu cầu role cụ thể
  if (requiredRole && currentRole !== requiredRole) {
    alert('Bạn không có quyền truy cập trang này!');
    return next(from.path || '/');
  }

  // Kiểm tra token hết hạn
  if (token && isTokenExpired(token)) {
    clearUserData();
    return next('/login');
  }

  // Cập nhật thời gian hoạt động cuối cùng
  localStorage.setItem('lastActivity', Date.now().toString());
  
  next();
};

// Kiểm tra quyền cho các action
const can = {
  viewArticle: () => true, // Ai cũng xem được bài viết
  createArticle: () => isAdmin(),
  editArticle: (articleAuthorId) => {
    const user = getUser();
    return isAdmin() || (user && user.id === articleAuthorId);
  },
  deleteArticle: () => isAdmin(),
  createComment: () => isAuthenticated(),
  editComment: (commentAuthorId) => {
    const user = getUser();
    return isAdmin() || (user && user.id === commentAuthorId);
  },
  deleteComment: () => isAdmin(),
  manageUsers: () => isAdmin(),
  manageAllContent: () => isAdmin()
};

export default {
  encryptData,
  decryptData,
  saveUserData,
  clearUserData,
  getUser,
  getToken,
  getCurrentRole,
  isAdmin,
  isAuthenticated,
  isTokenExpired,
  refreshToken,
  userLogin,
  userLogout,
  checkAuth,
  can,
  setupAutoLogout
};

