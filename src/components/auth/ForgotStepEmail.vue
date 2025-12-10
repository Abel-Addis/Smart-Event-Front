<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore, useUserData } from '../../stores/useAuthStore'


const emit = defineEmits(['next'])
const store = useAuthStore()
const userData=useUserData()
const schema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email')
})

const onSubmit = async (values) => {
  try {
    await store.sendOTP(values.email)
    
    userData.data.email=values.email
    
    emit('next', { email: values.email })
  } catch (err) {
    
  }
}
</script>

<template>
  <Form :validation-schema="schema" :initial-values="{email:userData.data.email}" @submit="onSubmit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
      <Field
        name="email"
        type="email"
        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter your email"
      />
      <ErrorMessage name="email" class="text-red-600 text-sm mt-1" />
      <p v-if="store.error" class="text-red-600 text-sm mt-2">{{ store.error }}</p>
    </div>

    <button
      type="submit"
      :disabled="store.loading"
      class="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium"
    >
      {{ store.loading ? 'Sending...' : 'Send OTP' }}
    </button>
  </Form>
</template>