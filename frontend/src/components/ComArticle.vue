<template>
  <div class="article-container">
    <div v-if="loading" class="loading">Đang tải...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="article">
      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-actions" v-if="showActionMenu()">
          <button @click="toggleMenu">...</button>
          <div v-if="menuVisible" class="menu-dropdown">
            <button @click="editArticle">Sửa bài viết</button>
            <button @click="deleteArticle">Xóa bài viết</button>
          </div>
        </div>
      </div>
      
      <img v-if="article.image" :src="getImageUrl(article.image)" alt="Ảnh bài viết" class="article-image" />
      <p class="article-meta">Đăng lúc: {{ formatDate(article.time) }}</p>
      <p class="article-tag">Tags: {{ article.tag.join(', ') }}</p>
      <div class="article-content" v-html="article.content"></div>

      <ComComment :articleId="article._id" />
    </div>
  </div>
</template>

<script>
import { getArticleById, deleteArticle } from '@/api/articleApi';
import ComComment from '@/components/ComComment.vue';
// import auth from '@/utils/auth';

export default {
  name: "ComArticle",
  components: {
    ComComment
  },
  data() {
    return {
      article: null,
      loading: true,
      error: null,
      menuVisible: false
    };
  },
  async created() {
    try {
      const articleId = this.$route.params.id;
      this.article = await getArticleById(articleId);
      if (!this.article) {
        this.error = "Bài viết không tồn tại.";
      }
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
      this.error = "Có lỗi xảy ra khi tải bài viết.";
    } finally {
      this.loading = false;
    }
  },
  methods: {
    getImageUrl(image) {
      if (!image) return "/default.jpg";
      if (image.startsWith("http")) return image;
      return `http://localhost:4000${image}`;
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    editArticle() {
      this.$router.push({ name: 'UpdateArticle', params: { id: this.article._id } });
    },
    async deleteArticle() {
    //   if (!auth.can.deleteArticle()) {
    //   alert("Bạn không có quyền xóa bài viết này!");
    //   return;
    // }
      if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
        const response = await deleteArticle(this.article._id);
        if (response) {
          alert("Bài viết đã bị xóa.");
          this.$router.push('/');
        } else {
          alert("Lỗi khi xóa bài viết.");
        }
      }
    },
    showActionMenu() {
    return this.$store.getters.isAdmin; // Chỉ hiển thị menu cho admin
  }
  }
};
</script>

<style scoped>
.article-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.article-actions {
  position: relative;
}
.menu-dropdown {
  position: absolute;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  padding: 5px;
  display: flex;
  flex-direction: column;
}
.article-title {
  font-size: 2rem;
  margin-bottom: 15px;
  text-align: center;
}
.article-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 15px;
}
.article-meta {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}
.article-tag {
  font-size: 1rem;
  color: #007bff;
  text-align: center;
}
.article-content {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  text-align: justify;
  padding: 10px;
  border-left: 4px solid #fad5af;
}
</style>
