<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '../../stores/useAuthStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useAuthStore()

const schema = yup.object({
  password: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required')
})

const onSubmit = async (values) => {
  try {
    await store.resetPassword({
      email: store.user?.email || '', 
      newPassword: values.password
    })
    alert('Password reset successful!')
    router.push('/login')
  } catch (err) {

  }
}
</script>

<template>
  <Form :validation-schema="schema" @submit="onSubmit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
      <Field
        name="password"
        type="password"
        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter new password"
      />
      <ErrorMessage name="password" class="text-red-600 text-sm mt-1" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
      <Field
        name="confirmPassword"
        type="password"
        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Confirm new password"
      />
      <ErrorMessage name="confirmPassword" class="text-red-600 text-sm mt-1" />
    </div>

    <div class="text-center text-sm text-gray-500 mb-6">
      Password must be at least 8 characters with uppercase, lowercase, and number
    </div>

    <button
      type="submit"
      :disabled="store.loading"
      class="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium"
    >
      {{ store.loading ? 'Resetting...' : 'Reset Password' }}
    </button>

    <p v-if="store.error" class="text-center text-red-600 text-sm mt-2">{{ store.error }}</p>
  </Form>
</template>