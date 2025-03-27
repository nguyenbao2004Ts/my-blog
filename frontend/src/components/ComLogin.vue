<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <div class="remember-me">
        <input type="checkbox" id="remember" v-model="rememberMe" />
        <label for="remember">Remember me</label>
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? "Logging in..." : "Login" }}
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    </form>
  </div>
</template>

<script>
import { login } from "@/api/accountApi";
import auth from "@/utils/auth";

export default {
  data() {
    return {
      username: "",
      password: "",
      rememberMe: false,
      loading: false,
      errorMessage: "",
    };
  },
  created() {
    // Xóa thông tin đăng nhập cũ nếu không chọn remember me
    if (!localStorage.getItem("rememberMe")) {
      auth.clearUserData();
    }
  },
  methods: {
  async handleLogin() {
    this.loading = true;
    this.errorMessage = "";
    try {
      const res = await login(this.username, this.password);
      
      // Dispatch action login với dữ liệu từ API
      this.$store.dispatch('login', {
        user: res.user,
        token: res.token
      });

      alert(`Đăng nhập thành công!`);
      this.$router.push("/");
    } catch (error) {
      this.errorMessage = error.response?.data?.message || error.message || "Đăng nhập thất bại";
    } finally {
      this.loading = false;
    }
  }
}
};
</script>

<style scoped>
/* Thêm style cho remember me */
.remember-me {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.remember-me input {
  margin-right: 8px;
  width: auto;
}

.remember-me label {
  font-size: 0.9rem;
  color: #555;
}
</style>

<style scoped>
.login-container {
  width: 100%;
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

button {
  padding: 10px;
  background: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #0056b3;
}

p {
  margin-top: 10px;
  font-size: 14px;
}

.error {
  color: red;
}

router-link {
  color: #007bff;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
}
</style>
