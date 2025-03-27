import axios from 'axios';
import router from '@/router';

const API_URL = 'http://localhost:4000/api/comment';

export const getCommentsByArticleId = async (articleId) => {
    try {
        const response = await axios.get(`${API_URL}/article/${articleId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy bình luận:", error);
        return [];
    }
};

export const addComment = async (comment, articleId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Bạn cần đăng nhập để bình luận.");
      router.push("/login");
      return;
    }

    const response = await axios.post(`${API_URL}/create`, { 
      comment, 
      articleId 
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      router.push("/login");
    }
    console.error("Lỗi API khi thêm bình luận:", error);
    throw error;
  }
};

export const updateComment = async (id, comment) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Bạn cần đăng nhập để chỉnh sửa bình luận.");
        router.push("/login");
        return;
      }

      const response = await axios.put(`${API_URL}/${id}`, { comment }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error("Lỗi cập nhật bình luận:", error);
      throw error;
    }
};
  
export const deleteComment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Bạn cần đăng nhập để xóa bình luận.");
        router.push("/login");
        return;
      }

      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error("Lỗi xóa bình luận:", error);
      throw error;
    }
};
