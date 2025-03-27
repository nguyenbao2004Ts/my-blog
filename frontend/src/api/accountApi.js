import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/account",
  withCredentials: true, // Đảm bảo gửi cookies (nếu có)
});

// Hàm xử lý lỗi chung
const handleRequest = async (requestFunc) => {
  try {
    const response = await requestFunc();
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data?.message || "Lỗi không xác định!";
  }
};

// API đăng nhập
export const login = (username, password) =>
  handleRequest(() => API.post("/login", { username, password }));

// API đăng ký
export const register = (userData, token) =>
  handleRequest(() =>
    API.post("/create", userData, { headers: { Authorization: `Bearer ${token}` } })
  );

// API lấy danh sách tài khoản (chỉ admin)
export const getAllAccounts = (token) =>
  handleRequest(() =>
    API.get("/", { headers: { Authorization: `Bearer ${token}` } })
  );

// API xóa tài khoản
export const deleteAccount = (id, token) =>
  handleRequest(() =>
    API.delete(`/${id}`, { headers: { Authorization: `Bearer ${token}` } })
  );

// API cập nhật tài khoản
export const updateAccount = (id, data, token) =>
  handleRequest(() =>
    API.put(`/${id}`, data, { headers: { Authorization: `Bearer ${token}` } })
  );

export const registerUser = (userData) =>
  handleRequest(() => API.post("/register", userData));