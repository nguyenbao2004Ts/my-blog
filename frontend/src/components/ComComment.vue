<template>
  <div class="comments-section">
    <h3>Bình luận</h3>

    <ul v-if="comments.length" class="comment-list">
      <li v-for="comment in comments" :key="comment._id" class="comment-item">
        <div class="comment-header">
          <span class="comment-user">{{ comment.username || 'Người dùng ẩn danh' }}</span>
          <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
          <button class="options-btn" @click="toggleOptions(comment._id)">...</button>

          <div v-if="activeOptionsCommentId === comment._id" class="options-menu">
            <button v-if="canEditComment(comment.authorId)" @click="startEdit(comment)" class="menu-btn">Sửa bình luận</button>
            <button v-if="canDeleteComment()" @click="deleteThisComment(comment._id)" class="menu-btn">Xóa bình luận</button>
          </div>
        </div>

        <div v-if="editingCommentId === comment._id" class="edit-section">
          <textarea v-model="editingCommentText" class="edit-input"></textarea>
          <div class="edit-actions">
            <button class="save-btn" @click="saveEdit(comment._id)">Lưu</button>
            <button class="cancel-btn" @click="cancelEdit">Hủy</button>
          </div>
        </div>

        <p v-else class="comment-text">{{ comment.comment }}</p>
      </li>
    </ul>
    <p v-else class="no-comments">Chưa có bình luận nào</p>

    <div class="comment-box">
      <textarea v-model="newComment" placeholder="Viết bình luận..." class="comment-input"></textarea>
      <button @click="submitComment" class="submit-button">Gửi bình luận</button>
    </div>
  </div>
</template>

<script>
import { getCommentsByArticleId, addComment, updateComment, deleteComment } from "@/api/commentApi";
import auth from "@/utils/auth";
import { useRouter } from "vue-router";

export default {
  props: {
    articleId: String,
  },
  data() {
    return {
      comments: [],
      newComment: "",
      editingCommentId: null,
      editingCommentText: "",
      activeOptionsCommentId: null,
    };
  },
  setup() {
    const router = useRouter();

    return { router };
  },
  watch: {
    articleId: {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.loadComments();
        }
      },
    },
  },
  methods: {
    async loadComments() {
      this.comments = await getCommentsByArticleId(this.articleId);
    },
    async submitComment() {
      if (!this.newComment.trim()) return;

      if (!auth.isAuthenticated()) {
        alert("Bạn cần đăng nhập để bình luận.");
        this.$router.push('/login');
        return;
      }

      try {
        await addComment(this.newComment, this.articleId);
        this.newComment = "";
        await this.loadComments();
      } catch (error) {
        if (error.response?.status === 401) {
          this.$router.push('/login');
          alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        } else {
          console.error("Lỗi khi gửi bình luận:", error);
          alert("Có lỗi xảy ra khi gửi bình luận");
        }
      }
    },
    startEdit(comment) {
      this.editingCommentId = comment._id;
      this.editingCommentText = comment.comment;
      this.activeOptionsCommentId = null;
    },
    cancelEdit() {
      this.editingCommentId = null;
      this.editingCommentText = "";
    },
    async saveEdit(commentId) {
      if (!this.editingCommentText.trim()) return;
      await updateComment(commentId, this.editingCommentText);
      this.editingCommentId = null;
      this.editingCommentText = "";
      this.loadComments();
    },
    toggleOptions(commentId) {
      this.activeOptionsCommentId = (this.activeOptionsCommentId === commentId) ? null : commentId;
    },
    async deleteThisComment(commentId) {
      await deleteComment(commentId);
      this.activeOptionsCommentId = null;
      this.loadComments();
    },
    formatDate(dateString) {
      return dateString ? new Date(dateString).toLocaleString("vi-VN") : "Không có thời gian";
    },
    canEditComment(commentAuthorId) {
      const user = this.$store.getters.currentUser;
      return this.$store.getters.isAdmin || (user && user._id === commentAuthorId);
    },
    canDeleteComment() {
      return this.$store.getters.isAdmin;
    },
  }
};
</script>

<style scoped>
.comments-section {
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  background: #f9f9f9;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.comment-list {
  list-style: none;
  padding: 0;
}

.comment-item {
  position: relative;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  background: white;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  font-weight: bold;
  color: #555;
}

.options-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0 5px;
  color: #007bff;
}

.options-btn:hover {
  color: #0056b3;
}

/* Dropdown menu cho tùy chọn */
.options-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.options-menu .menu-btn {
  display: block;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
}

.options-menu .menu-btn:hover {
  background: #f0f0f0;
}

.comment-text {
  font-size: 1rem;
  margin-top: 5px;
  line-height: 1.5;
}

.no-comments {
  text-align: center;
  font-style: italic;
  color: #888;
}

.comment-box {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
}

.comment-input {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  resize: none;
}

.submit-button {
  margin-top: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-button:hover {
  background: #0056b3;
}

/* Styles cho phần chỉnh sửa bình luận */
.edit-section {
  margin-top: 10px;
}

.edit-input {
  width: 100%;
  min-height: 60px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  resize: none;
}

.edit-actions {
  margin-top: 5px;
  display: flex;
  gap: 10px;
}

.save-btn, .cancel-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s;
}

.save-btn {
  background: #28a745;
  color: white;
}

.save-btn:hover {
  background: #218838;
}

.cancel-btn {
  background: #dc3545;
  color: white;
}

.cancel-btn:hover {
  background: #c82333;
}
</style>
