<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <input type="text" v-model="username" placeholder="Username" required minlength="4" />
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required minlength="6" />
      <input type="password" v-model="confirmPassword" placeholder="Confirm Password" required />
      <select v-model="role" v-if="isAdminCreatingAccount">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" :disabled="loading || password !== confirmPassword">
        {{ loading ? "Registering..." : "Register" }}
      </button>
      <p v-if="password && confirmPassword && password !== confirmPassword" class="error">
        Mật khẩu không khớp!
      </p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </form>
  </div>
</template>

<script>
import { register, registerUser } from "@/api/accountApi";
import auth from "@/utils/auth";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      loading: false,
      errorMessage: "",
    };
  },
  computed: {
    isAdminCreatingAccount() {
      return auth.isAdmin();
    }
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Mật khẩu không khớp";
        return;
      }

      this.loading = true;
      this.errorMessage = "";
      try {
        // Sử dụng API khác nhau tùy vào người đăng ký
      const apiCall = this.isAdminCreatingAccount 
        ? register 
        : registerUser;

        const res = await apiCall({
          username: this.username,
          email: this.email,
          password: this.password,
          role: this.role,
        });
        alert(res.message || "Đăng ký thành công!");
        this.$router.push(this.isAdminCreatingAccount ? "/" : "/login");
      } catch (error) {
        this.errorMessage = error.response?.data?.message || error.message || "Đăng ký thất bại";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
  
  <style scoped>
  .login-container, .register-container {
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

input, select {
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

router-link {
  color: #007bff;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
}

  </style>
  