import { createStore } from 'vuex'

const store = createStore({
  state: {
    user: null,
    isAuthenticated: false
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    }
  },
  actions: {
    login({ commit }, userData) {
      // 这里可以添加登录逻辑
      commit('setUser', userData)
    },
    logout({ commit }) {
      commit('setUser', null)
    }
  },
  getters: {
    currentUser: state => state.user,
    isAuthenticated: state => state.isAuthenticated
  }
})

export default store 