<template>
  <div class="create-article">
    <h2>Đăng bài viết mới</h2>
    <form @submit.prevent="submitArticle">
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
        <input type="text" v-model="tagInput" placeholder="Nhập tag, cách nhau bởi dấu phẩy" @change="updateTags" />
      </div>

      <div>
        <label>Ảnh:</label>
        <input type="file" @change="handleFileUpload" accept="image/*" />
      </div>

      <button type="submit">Đăng bài</button>
    </form>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import { createArticle } from "@/api/articleApi";
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
        image: null
      },
      tagInput: "",
      message: ""
    };
  },
  methods: {
    handleFileUpload(event) {
      this.article.image = event.target.files[0];
    },
    updateTags() {
      this.article.tag = this.tagInput.split(",").map(tag => tag.trim());
    },
    async submitArticle() {
      const response = await createArticle(this.article);
      if (response) {
        this.message = "Bài viết đã được đăng!";
        this.article = { title: "", shortDescription: "", content: "", tag: [], image: null };
        this.tagInput = "";
      } else {
        this.message = "Có lỗi xảy ra!";
      }
    }
  }
};
</script>

<style scoped>
.create-article {
  max-width: 500px;
  margin: auto;
}
input, textarea {
  width: 100%;
  margin: 5px 0;
  padding: 8px;
}
button {
  background-color: blue;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}
</style>
