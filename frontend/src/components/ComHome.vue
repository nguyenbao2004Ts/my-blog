<template>
  <div class="home-container">
    <section class="articles">
      <h2 class="articles-title">Danh sách bài viết</h2>
      <div v-if="loading" class="loading">Đang tải...</div>
      <div v-else-if="filteredArticles.length === 0" class="no-articles">Không có bài viết nào.</div>
      <div v-else class="articles-list">
        <div class="article-card" v-for="article in filteredArticles" :key="article._id">
          <img :src="getImageUrl(article.image)" :alt="article.title" class="article-image" />
          <h3 class="article-title">{{ article.title }}</h3>
          <p class="article-description">{{ article.shortDescription }}</p>
          <router-link :to="`/article/${article._id}`" class="article-link">Xem chi tiết</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getAllArticles } from '@/api/articleApi';
import { mapGetters } from 'vuex';

export default {
  name: "ComHome",
  data() {
    return {
      articles: [],
      loading: true,
      defaultImage: '/default.jpg' // Ảnh mặc định
    };
  },
  computed: {
    ...mapGetters(['searchQuery']), // Lấy searchQuery từ Vuex store
    filteredArticles() {
      if (!this.searchQuery) {
        return this.articles;
      }
      return this.articles.filter(article =>
        article.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  async created() {
    try {
      this.articles = await getAllArticles();
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    getImageUrl(image) {
      if (!image) {
        return this.defaultImage;
      }
      if (image.startsWith("http")) {
        return image;
      }
      return `http://localhost:4000${image}`;
    }
  }
};
</script>
<style scoped>
.home-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.articles {
  padding: 50px 20px;
  text-align: center;
}

.articles-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
}

.articles-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); /* Điều chỉnh grid tự động */
  gap: 20px;
  justify-content: center;
}

.article-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.article-image {
  width: 100%;
  height: 250px; /* Kích thước ảnh lớn hơn */
  object-fit: cover;
  border-radius: 12px 12px 0 0;
}

.article-content {
  padding: 20px;
  text-align: left;
}

.article-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
}

.article-description {
  font-size: 16px;
  color: #555;
  margin-bottom: 15px;
  line-height: 1.5;
}

.article-link {
  display: inline-block;
  background: #ff7f50;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  transition: background 0.3s ease;
  border: none;
  cursor: pointer;
  text-decoration: none;
}

.article-link:hover {
  background: #ff6347;
}

.loading, .no-articles {
  font-size: 1.4rem;
  color: #666;
}

</style>
