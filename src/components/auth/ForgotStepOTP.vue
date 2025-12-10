<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '../../stores/useAuthStore'



const emit = defineEmits(['next', 'back'])

const store = useAuthStore()

const schema = yup.object({
  otp: yup.string().required('OTP is required').length(6, 'Enter 6-digit OTP')
})

const onSubmit = async (values) => {
  try {
    await store.verifyOTP({ email: store.user?.email, otpCode: values.otp })
    emit('next')
  } catch (err) {
  
  }
}
</script>

<template>
  <Form :validation-schema="schema" @submit="onSubmit" class="space-y-6">
    <div class="text-center mb-6">
      <h3 class="text-lg font-medium">Enter the 6-digit code sent to</h3>
      <p class="text-indigo-600 font-semibold">{{ store.user?.email }}</p>
      <p class="text-sm text-gray-500 mt-2">Check your spam folder if not received</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">OTP Code</label>
      <Field
        name="otp"
        type="text"
        maxlength="6"
        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-2xl tracking-widest"
        placeholder="123456"
      />
      <ErrorMessage name="otp" class="text-red-600 text-sm mt-1 text-center" />
      <p v-if="store.error" class="text-red-600 text-sm mt-2 text-center">{{ store.error }}</p>
    </div>

    <div class="flex justify-between">
      <button @click="()=>emit('back')" class="px-6 py-2 text-gray-600 hover:underline">
        Back
      </button>
      <button
        type="submit"
        :disabled="store.loading"
        class="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium"
      >
        {{ store.loading ? 'Verifying...' : 'Verify OTP' }}
      </button>
    </div>
  </Form>
</template>