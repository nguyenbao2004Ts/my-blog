import axios from 'axios';

const API_URL = 'http://localhost:4000/api/article'; // URL backend

// Lấy tất cả bài viết
export const getAllArticles = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
        return [];
    }
};

// Lấy chi tiết bài viết theo ID
export const getArticleById = async (id) => {
    console.log("Fetching article with ID:", id); // Kiểm tra ID
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết bài viết:', error);
        return null;
    }
};


export const createArticle = async (article) => {
    try {
        const formData = new FormData();
        formData.append("title", article.title);
        formData.append("shortDescription", article.shortDescription);
        formData.append("content", article.content);
        formData.append("tag", JSON.stringify(article.tag)); // Chuyển mảng sang chuỗi JSON
        if (article.image) {
            formData.append("image", article.image);
        }

        const response = await axios.post(`${API_URL}/create`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi API:", error.response?.data || error.message);
        return null;
    }
};


// export const updateArticle = async (id, articleData) => {
//     try {
//         const formData = new FormData();
        
//         // Thêm các trường dữ liệu vào formData
//         formData.append("title", articleData.title || "");
//         formData.append("shortDescription", articleData.shortDescription || "");
//         formData.append("content", articleData.content || "");
        
//         // Xử lý tags - giữ nguyên nếu không có thay đổi
//         const tags = articleData.tag || [];
//         formData.append("tag", JSON.stringify(tags));
        
//         // Chỉ thêm ảnh nếu có file mới được chọn
//         if (articleData.image instanceof File) {
//             formData.append("image", articleData.image);
//         } else if (typeof articleData.image === 'string') {
//             // Nếu là string (URL ảnh cũ), không cần gửi lại
//             console.log("Giữ nguyên ảnh cũ");
//         }

//         const response = await axios.put(`${API_URL}/${id}`, formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data"
//             }
//         });

//         return response.data;
//     } catch (error) {
//         console.error("❌ Lỗi khi cập nhật bài viết:", error.response?.data || error.message);
//         throw error; // Ném lỗi để component có thể bắt và xử lý
//     }
// };
export const updateArticle = async (id, formData) => {
    try {
      // Thêm timestamp để tránh cache
      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      // Kiểm tra kết quả trả về
      if (!response.data || !response.data.updatedArticle) {
        throw new Error("Không nhận được dữ liệu cập nhật từ server");
      }
      
      return response.data.updatedArticle;
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  };
// Xóa bài viết theo ID
export const deleteArticle = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa bài viết:', error.response?.data || error.message);
        return null;
    }
};
