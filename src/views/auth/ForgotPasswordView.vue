<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore'
import ForgotStepEmail from '../../components/auth/ForgotStepEmail.vue'
import ForgotStepOTP from '../../components/auth/ForgotStepOTP.vue'
import ForgotStepPassword from '../../components/auth/ForgotStepPassword.vue'

const router = useRouter()
const store = useAuthStore()

const currentStep = ref(1)

const steps = [ForgotStepEmail, ForgotStepOTP, ForgotStepPassword]
const currentComponent = computed(() => {
  return steps[currentStep.value - 1]
})

const goToNext = (data) => {
  if (currentStep.value === 1) {
    store.user = data || null
  }
  currentStep.value = Math.min(currentStep.value + 1, steps.length)
}

const goBack = () => {
  currentStep.value = Math.max(currentStep.value - 1, 1)
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full space-y-8">

      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">Reset Your Password</h2>
        <p class="mt-2 text-sm text-gray-600">
          Enter your email to get started
        </p>
      </div>


      <div class="flex justify-center mb-8">
        <div class="flex space-x-2">
          <div
            v-for="step in 3"
            :key="step"
            class="w-12 h-2 rounded-full transition-colors"
            :class="step <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'"
          ></div>
        </div>
      </div>


      <component
        :is="currentComponent"
        :current-step="currentStep"
        @next="goToNext"
        @back="goBack"
      />


      <div class="text-center">
        <button @click="goToLogin" class="text-indigo-600 hover:underline text-sm">
          Back to Login
        </button>
      </div>
    </div>
  </div>
</template>