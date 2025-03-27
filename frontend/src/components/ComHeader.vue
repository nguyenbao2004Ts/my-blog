<template>
  <header>
    <div class="header-container">
      <!-- Phần bên trái: Menu & Navigation -->
      <div class="header-left">
        <ComMenu class="menu-container" />
        <nav class="nav-menu">
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/about">About</router-link></li>
          </ul>
        </nav>
      </div>

      <!-- Phần giữa: Thanh tìm kiếm -->
      <div class="header-center">
        <input
          type="text"
          class="search-bar"
          v-model="searchQuery"
          placeholder="Nhập tiêu đề bài viết..."
        />
      </div>

      <!-- Phần bên phải: User info và nút chuyển chế độ -->
      <div class="header-right">
        <!-- Nút chuyển chế độ sáng/tối -->
        <button @click="toggleDarkMode" class="dark-mode-btn">
          <i :class="darkModeIcon"></i>
        </button>

        <div v-if="isLoggedIn" class="user-info">
          <div class="user-avatar" @click="toggleUserMenu">
            <span>{{ userInitial }}</span>
          </div>
          <div v-if="showUserMenu" class="user-menu">
            <div class="user-details">
              <span class="username">{{ currentUser.username }}</span>
              <span class="role">{{ currentUser.role.toUpperCase() }}</span>
            </div>
            <button @click="logout" class="logout-btn">
              <i class="fas fa-sign-out-alt"></i> Đăng xuất
            </button>
          </div>
        </div>
        <button v-else @click="goToLogin" class="login-btn">
          <i class="fas fa-sign-in-alt"></i> Đăng nhập
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import ComMenu from "@/components/ComMenu.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    ComMenu,
  },
  data() {
    return {
      showUserMenu: false,
      darkMode: false // Trạng thái chế độ tối, mặc định là tắt
    };
  },
  computed: {
    // Giữ nguyên các getter cũ
    ...mapGetters(['isLoggedIn', 'currentUser', 'isAdmin']),
    // computed cho searchQuery có getter và setter
    searchQuery: {
      get() {
        return this.$store.getters.searchQuery;
      },
      set(value) {
        this.$store.commit('setSearchQuery', value);
      }
    },
    userInitial() {
      return this.currentUser && this.currentUser.username
        ? this.currentUser.username.charAt(0).toUpperCase()
        : "";
    },
    // computed icon cho dark mode: nếu đang bật thì hiển thị icon sun, ngược lại hiển thị moon
    darkModeIcon() {
      return this.darkMode ? "fas fa-sun" : "fas fa-moon";
    }
  },
  methods: {
    ...mapActions(['logout']),
    goToLogin() {
      this.$router.push("/login");
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    closeUserMenu(e) {
      if (!this.$el.contains(e.target)) {
        this.showUserMenu = false;
      }
    },
    // Hàm chuyển đổi chế độ sáng/tối: thêm hoặc xóa class "dark-mode" trên body
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    }
  },
  mounted() {
    document.addEventListener("click", this.closeUserMenu);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeUserMenu);
  }
};
</script>

<style scoped>
/* Giữ nguyên CSS cũ */
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: #f8f9fa;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
}

.menu-container {
  margin-right: 15px;
}

.nav-menu ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-menu ul li {
  margin: 0 15px;
}

.nav-menu ul li a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  padding: 10px 15px;
  transition: all 0.3s ease;
  border-radius: 5px;
}

.nav-menu ul li a:hover {
  background-color: #ff7f50;
  color: white;
}

.header-center {
  flex: 1;
  text-align: center;
}

.search-bar {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  width: 300px;
  transition: all 0.3s;
}

.search-bar:focus {
  border-color: #ff7f50;
  box-shadow: 0 0 5px rgba(255, 127, 80, 0.5);
}

.header-right {
  display: flex;
  align-items: center;
  position: relative;
}

/* Style cho nút chuyển chế độ sáng/tối */
.dark-mode-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  margin-right: 15px;
  color: #333;
  outline: none;
  transition: color 0.3s;
}

.dark-mode-btn:hover {
  color: #ff7f50;
}

.user-info {
  display: flex;
  align-items: center;
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ff7f50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.user-avatar:hover {
  transform: scale(1.1);
}

.user-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 15px;
  min-width: 200px;
  z-index: 1001;
}

.user-details {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.user-details .username {
  font-weight: bold;
  color: #333;
  font-size: 1.1rem;
}

.user-details .role {
  font-size: 0.8rem;
  color: #666;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 10px;
  display: inline-block;
  margin-top: 5px;
  align-self: flex-start;
}

.login-btn,
.logout-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-btn {
  background: #007bff;
  color: white;
}

.login-btn:hover {
  background: #0056b3;
}

.logout-btn {
  background: #dc3545;
  color: white;
  width: 100%;
  justify-content: center;
}

.logout-btn:hover {
  background: #c82333;
}

.fas {
  font-size: 0.9rem;
}
</style>
