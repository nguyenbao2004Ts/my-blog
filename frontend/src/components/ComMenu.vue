<template>
    <div class="menu-container" v-if="isAdmin">
      <button @click="toggleMenu" class="menu-button">
        ☰
      </button>
  
      <div v-if="isOpen" class="menu-popup" @click.stop>
        <ul>
          <li @click="navigateTo('/create-article')">📝 Đăng bài viết</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>

import { mapGetters } from "vuex";

  export default {
    computed: {
    ...mapGetters(['isAdmin'])
    },
    name: "ComMenu",
    data() {
      return {
        isOpen: false
      };
    },
    methods: {
      toggleMenu() {
        this.isOpen = !this.isOpen;
      },
      navigateTo(route) {
        this.$router.push(route);
        this.isOpen = false;
      },
      logout() {
        localStorage.removeItem("token"); // Xóa token
        this.$router.push("/login"); // Chuyển đến trang đăng nhập
        this.isOpen = false;
      },
      closeMenu(event) {
        if (!this.$el.contains(event.target)) {
          this.isOpen = false;
        }
      }
    },
    mounted() {
      document.addEventListener("click", this.closeMenu);
    },
    beforeUnmount() {
      document.removeEventListener("click", this.closeMenu);
    }
  };
  </script>
  
  <style scoped>
  .menu-container {
    position: relative;
    display: inline-block;
  }
  
  .menu-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 14px;
    font-size: 18px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .menu-popup {
  position: absolute;
  top: 40px;
  left: 0; /* Căn chỉnh menu ra ngoài không bị che khuất */
  background: white;
  border-radius: 6px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  width: 200px; /* Tăng kích thước */
  z-index: 1000; /* Đảm bảo hiển thị trên cùng */
  padding: 10px; /* Thêm padding để tránh bị cắt */
}
  
.menu-popup ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
  
.menu-popup li {
  padding: 12px 16px;
  cursor: pointer;
  font-size: 16px;
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}
  .menu-popup li:last-child {
    border-bottom: none;
  }
  
  .menu-popup li:hover {
    background: #f2f2f2;
  }
  </style>
  