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

const { handleSubmit, errors } = useForm({ validationSchema })

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
  <AuthLayout>
    <div class="space-y-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create your account</h2>
        <p class="text-gray-600 dark:text-gray-400">Join SmartEvent and discover amazing events</p>
      </div>

      <form @submit.prevent="onsubmit" class="space-y-5">
        <BaseInput
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          type="text"
          v-model="fullName"
        />
        <p v-if="errors.fullName" class="text-sm text-red-600 dark:text-red-400 font-medium -mt-3">
          {{ errors.fullName }}
        </p>

        <BaseInput
          name="email"
          label="Email Address"
          placeholder="you@example.com"
          type="email"
          v-model="email"
        />
        <p v-if="errors.email" class="text-sm text-red-600 dark:text-red-400 font-medium -mt-3">
          {{ errors.email }}
        </p>

        <BaseInput
          name="phoneNumber"
          label="Phone Number"
          placeholder="+251 9XX XXX XXX"
          type="text"
          v-model="phoneNumber"
        />
        <p v-if="errors.phoneNumber" class="text-sm text-red-600 dark:text-red-400 font-medium -mt-3">
          {{ errors.phoneNumber }}
        </p>

        <BaseInput
          name="password"
          label="Password"
          placeholder="Create a strong password"
          type="password"
          v-model="password"
        />
        <p v-if="errors.password" class="text-sm text-red-600 dark:text-red-400 font-medium -mt-3">
          {{ errors.password }}
        </p>

        <BaseInput
          name="passwordConfirm"
          label="Confirm Password"
          placeholder="Confirm your password"
          type="password"
          v-model="passwordConfirm"
        />
        <p v-if="errors.passwordConfirm" class="text-sm text-red-600 dark:text-red-400 font-medium -mt-3">
          {{ errors.passwordConfirm }}
        </p>

        <BaseButton
          type="submit"
          variant="primary"
          block
          size="lg"
        >
          Create Account
        </BaseButton>

        <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
          <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            Want to create events?
            <router-link to="/signupo" class="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
              Sign up as Organizer
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>
