<template>
  <div class="about-container">
    <h2>About Me</h2>
    <div v-if="loading" class="loading">Đang tải...</div>
    <div v-else-if="!information" class="error">Không có dữ liệu.</div>
    <div v-else class="info-card">
      <h3 v-if="!isEditing">{{ information.title }}</h3>
      <input v-else v-model.trim="editedInfo.title" class="input-field" />

      <p><strong>Họ và tên:</strong> 
        <span v-if="!isEditing">{{ information.hovaten }}</span>
        <input v-else v-model.trim="editedInfo.hovaten" class="input-field" />
      </p>

      <p><strong>Ngày sinh:</strong> 
        <span v-if="!isEditing">{{ information.ngaysinh }}</span>
        <input v-else v-model.trim="editedInfo.ngaysinh" class="input-field" />
      </p>

      <p><strong>Nơi sinh:</strong> 
        <span v-if="!isEditing">{{ information.noisinh }}</span>
        <input v-else v-model.trim="editedInfo.noisinh" class="input-field" />
      </p>

      <p><strong>Địa chỉ hiện tại:</strong> 
        <span v-if="!isEditing">{{ information.diachihientai }}</span>
        <input v-else v-model.trim="editedInfo.diachihientai" class="input-field" />
      </p>

      <p><strong>Số điện thoại:</strong> 
        <span v-if="!isEditing">{{ information.sdt }}</span>
        <input v-else v-model.trim="editedInfo.sdt" class="input-field" />
      </p>

      <p><strong>Email:</strong> 
        <span v-if="!isEditing">{{ information.email }}</span>
        <input v-else v-model.trim="editedInfo.email" class="input-field" />
      </p>

      <p><strong>Nơi làm việc:</strong> 
        <span v-if="!isEditing">{{ information.workplace }}</span>
        <input v-else v-model.trim="editedInfo.workplace" class="input-field" />
      </p>

      <button @click="toggleEdit" class="edit-button" v-if="$store.getters.isAdmin">
        {{ isEditing ? "Lưu" : "Sửa" }}
      </button>
      <button v-if="isEditing" @click="cancelEdit" class="cancel-button">Hủy</button>
    </div>
  </div>
</template>

<script>
import { getAllInformation, updateInformation } from '@/api/informationApi';

export default {
  name: "ComInformation",
  data() {
    return {
      information: null,
      editedInfo: null,
      isEditing: false,
      loading: true
    };
  },
  async created() {
    await this.fetchInformation();
  },
  methods: {
    async fetchInformation() {
      try {
        this.loading = true;
        const data = await getAllInformation();
        if (data.length > 0) {
          this.information = { ...data[0] };
          this.editedInfo = { ...this.information };
        } else {
          this.information = null;
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin:", error);
      } finally {
        this.loading = false;
      }
    },
    async toggleEdit() {
      if (this.isEditing) {
        await this.updateInfo();
      } else {
        this.editedInfo = { ...this.information };
      }
      this.isEditing = !this.isEditing;
    },
    async updateInfo() {
      try {
        if (!this.editedInfo._id) {
          alert("Lỗi: Không tìm thấy ID dữ liệu cần cập nhật!");
          return;
        }
        const updatedData = await updateInformation(this.editedInfo);
        this.information = { ...updatedData };
        await this.fetchInformation();
        alert("Cập nhật thông tin thành công!");
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        alert("Cập nhật thất bại! Vui lòng kiểm tra lại.");
      }
    },
    cancelEdit() {
      this.isEditing = false;
      this.editedInfo = { ...this.information };
    }
  }
};
</script>

<style>
.about-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.info-card {
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 10px;
  background-color: #fafafa;
  text-align: left;
}

.input-field {
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.edit-button, .cancel-button {
  margin-top: 15px;
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.edit-button {
  background-color: #007bff;
  color: white;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.loading, .error {
  text-align: center;
  font-size: 16px;
  color: #777;
}
</style>
