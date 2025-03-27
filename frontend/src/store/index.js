// src/store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    searchQuery: "" // Thêm trạng thái tìm kiếm
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload.user;
      state.token = payload.token;
      localStorage.setItem('user', JSON.stringify(payload.user));
      localStorage.setItem('token', payload.token);
    },
    CLEAR_USER(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    setSearchQuery(state, query) { // Thêm mutation để cập nhật searchQuery
      state.searchQuery = query;
    }
  },
  actions: {
    login({ commit }, userData) {
      commit('SET_USER', {
        user: userData.user,
        token: userData.token
      });
    },
    logout({ commit }) {
      commit('CLEAR_USER');
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    isAdmin: state => state.user?.role === 'admin',
    isLoggedIn: state => !!state.user,
    searchQuery: state => state.searchQuery // Thêm getter để lấy searchQuery
  }
});