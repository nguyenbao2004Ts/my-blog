import axios from 'axios';

const API_URL = 'http://localhost:4000/api/information';

export const getAllInformation = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin:", error);
        return [];
    }
};

export const updateInformation = async (info) => {
    try {
        const response = await axios.put(`${API_URL}/67bd706dd064a480c459f45b`, info, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin:", error.response ? error.response.data : error.message);
        throw error;
    }
};
