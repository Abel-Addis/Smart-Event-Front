<script setup>
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import useRegister from '../composables/useRegister'
import { useRouter } from 'vue-router'

const router = useRouter()
const { data: signupData, message: signupMessage, success: signupSuccess, error: signupError, registerUser } = useRegister()

const validationSchema = yup.object({
    fullName: yup.string().required("Name is required").min(2, "Minimum of two characters is required"),
    email: yup.string().email("enter a vaild email").required("Email is required"),
    phoneNumber: yup.string().required("Phone number is required").matches(/^(?:\+251[79]\d{8}|0[79]\d{8})$/, "Invalid Ethiopian phone number format"),
    password: yup.string().required('password required').min(6, "must be at least 6 digit"),
    passwordConfirm: yup.string().oneOf([yup.ref('password')], 'password must match').required()
})

const { handleSubmit, errors } = useForm({validationSchema})

const { value: fullName } = useField("fullName")
const { value: password } = useField("password")
const { value: email } = useField("email")
const { value: phoneNumber } = useField("phoneNumber")
const { value: passwordConfirm } = useField("passwordConfirm")

const onsubmit = handleSubmit(async (values) => {
    await registerUser(values)
    if (signupSuccess.value) {
        router.push('/dashboard')
    }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
      
      <h2 class="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-6">
        Sign Up
      </h2>

      <form @submit.prevent="onsubmit" class="space-y-5">

        <div>
          <label class="block text-gray-700 dark:text-gray-200 font-medium mb-1">
            Full Name
          </label>
          <input 
            type="text"
            v-model="fullName"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
          <p v-if="errors.fullName" class="text-sm text-red-500 mt-1">
            {{ errors.fullName }}
          </p>
        </div>

        <div>
          <label class="block text-gray-700 dark:text-gray-200 font-medium mb-1">
            Email
          </label>
          <input 
            type="text"
            v-model="email"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
          <p v-if="errors.email" class="text-sm text-red-500 mt-1">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label class="block text-gray-700 dark:text-gray-200 font-medium mb-1">
            Phone Number
          </label>
          <input 
            type="text"
            v-model="phoneNumber"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
          <p v-if="errors.phoneNumber" class="text-sm text-red-500 mt-1">
            {{ errors.phoneNumber }}
          </p>
        </div>

        <div>
          <label class="block text-gray-700 dark:text-gray-200 font-medium mb-1">
            Password
          </label>
          <input 
            type="password"
            v-model="password"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
          <p v-if="errors.password" class="text-sm text-red-500 mt-1">
            {{ errors.password }}
          </p>
        </div>

        <div>
          <label class="block text-gray-700 dark:text-gray-200 font-medium mb-1">
            Confirm Password
          </label>
          <input 
            type="password"
            v-model="passwordConfirm"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
          <p v-if="errors.passwordConfirm" class="text-sm text-red-500 mt-1">
            {{ errors.passwordConfirm }}
          </p>
        </div>

        <button 
          type="submit"
          class="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 
                 text-white font-semibold shadow-sm transition"
        >
          Sign Up
        </button>

      </form>

    </div>
  </div>
</template>
