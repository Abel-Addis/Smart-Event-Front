import axios from 'axios'
import { ref } from 'vue'
import api from '../api/config'


export const useAuthApi = () => {
  const loading = ref(false)
  const error = ref(null)


  const sendOTP = async (email) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post('/Auth/send-otp', { email })
      return data
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to send OTP'
      throw err
    } finally {
      loading.value = false
    }
  }

  const verifyOTP = async (otpData) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post('/Auth/verify-otp', otpData)
      return data
    } catch (err) {
      error.value = err.response?.data?.error || 'Invalid OTP'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (resetData) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post('/Auth/reset-password', resetData)
      return data
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to reset password'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    sendOTP,
    verifyOTP,
    resetPassword
  }
}