<template>
  <div class="update-article">
    <h2>Chỉnh sửa bài viết</h2>
    
    <form @submit.prevent="submitUpdate">
      <div>
        <label>Tiêu đề:</label>
        <input type="text" v-model="article.title" required />
      </div>

      <div>
        <label>Mô tả ngắn:</label>
        <input type="text" v-model="article.shortDescription" required />
      </div>

      <div>
        <label>Nội dung:</label>
        <textarea v-model="article.content" required></textarea>
      </div>

      <div>
        <label>Tags:</label>
        <input 
          type="text" 
          v-model="tagInput" 
          placeholder="Nhập tag, cách nhau bởi dấu phẩy" 
          @blur="updateTags" 
        />
      </div>

      <div>
        <label>Ảnh hiện tại:</label>
        <img 
          v-if="currentImageUrl" 
          :src="currentImageUrl" 
          alt="Ảnh bài viết" 
          class="article-image" 
        />
      </div>

      <div>
        <label>Cập nhật ảnh (nếu muốn thay đổi):</label>
        <input 
          type="file" 
          @change="handleFileUpload" 
          accept="image/*" 
          ref="fileInput"
        />
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Đang cập nhật...' : 'Lưu thay đổi' }}
      </button>
    </form>

    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { getArticleById, updateArticle } from "@/api/articleApi";
import store from "@/store";

export default {
  beforeRouteEnter(to, from, next) {
  const isAdmin = store.getters.isAdmin;
  if (!isAdmin) {
    next('/');
    alert('Bạn không có quyền truy cập trang này!');
  } else {
    next();
  }
  },
  data() {
    return {
      article: {
        title: "",
        shortDescription: "",
        content: "",
        tag: [],
        image: ""
      },
      tagInput: "",
      message: "",
      messageType: "",
      isSubmitting: false,
      newImageFile: null,
      currentImageUrl: ""
    };
  },
  async created() {
    await this.loadArticleData();
  },
  methods: {
    async loadArticleData() {
      try {
        const articleId = this.$route.params.id;
        const fetchedArticle = await getArticleById(articleId);
        
        if (fetchedArticle) {
          this.article = { ...fetchedArticle };
          this.tagInput = this.article.tag.join(", ");
          this.currentImageUrl = this.getImageUrl(this.article.image);
        } else {
          this.showMessage("Không tìm thấy bài viết!", "error");
          this.$router.push("/");
        }
      } catch (error) {
        this.showMessage("Lỗi khi tải bài viết!", "error");
        console.error("Lỗi khi tải bài viết:", error);
      }
    },
    handleFileUpload(event) {
      if (event.target.files && event.target.files[0]) {
        this.newImageFile = event.target.files[0];
        this.currentImageUrl = URL.createObjectURL(this.newImageFile);
      }
    },
    updateTags() {
      this.article.tag = this.tagInput.split(",")
        .map(tag => tag.trim())
        .filter(tag => tag);
    },
    getImageUrl(image) {
      if (!image) return "/default.jpg";
      if (image.startsWith("http")) return image;
      return `http://localhost:4000${image}`;
    },
    showMessage(text, type) {
      this.message = text;
      this.messageType = type;
      setTimeout(() => {
        this.message = "";
        this.messageType = "";
      }, 3000);
    },
    async submitUpdate() {
  this.isSubmitting = true;
  
  try {
    const formData = new FormData();
    formData.append("title", this.article.title);
    formData.append("shortDescription", this.article.shortDescription);
    formData.append("content", this.article.content);
    formData.append("tag", JSON.stringify(this.article.tag));
    
    if (this.newImageFile) {
      formData.append("image", this.newImageFile);
    }

    // Thêm timestamp để tránh cache
    formData.append("timestamp", Date.now());

    const updatedArticle = await updateArticle(this.$route.params.id, formData);
    
    // Cập nhật dữ liệu local với dữ liệu mới từ server
    this.article = { ...updatedArticle };
    this.currentImageUrl = this.getImageUrl(updatedArticle.image);
    this.tagInput = updatedArticle.tag.join(", ");
    
    this.showMessage("Bài viết đã được cập nhật thành công!", "success");
    
    // Tải lại dữ liệu để đảm bảo nhất
    setTimeout(() => {
      this.loadArticleData();
    }, 500);
  } catch (error) {
    console.error("Lỗi khi cập nhật bài viết:", error);
    let errorMessage = "Có lỗi xảy ra khi cập nhật bài viết";
    if (error.response?.data?.message) {
      errorMessage += `: ${error.response.data.message}`;
    }
    this.showMessage(errorMessage, "error");
  } finally {
    this.isSubmitting = false;
  }
}
  }
};
</script>

<style scoped>
.update-article {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

label {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  min-height: 150px;
  resize: vertical;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.article-image {
  max-width: 100%;
  max-height: 200px;
  display: block;
  margin: 10px 0;
  border-radius: 4px;
}

.message {
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
}

.message.success {
  background-color: #dff0d8;
  color: #3c763d;
}

.message.error {
  background-color: #f2dede;
  color: #a94442;
}
</style>