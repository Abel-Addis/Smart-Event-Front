import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useAuthApi } from '../composables/useAuthApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const isAuthenticated = ref(!!token.value)

  const { loading, error, login, register, sendOTP, verifyOTP, resetPassword } = useAuthApi()

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    isAuthenticated.value = !!newToken
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    isAuthenticated.value = false
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    sendOTP,
    verifyOTP,
    resetPassword,
    setToken,
    logout
  }
})
export const useUserData = defineStore('userData', () => {
  const data = reactive({
    email: ""
  })

  return { data }
})