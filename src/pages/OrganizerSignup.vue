<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useUserStore } from '../store/user'
import { registerOrganizer } from '../api/auth'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const etPhoneRegex = /^(?:\+251[79]\d{8}|0[79]\d{8})$/


const validationSchema = yup.object({
  fullName: yup.string().required('Full Name is required'),
  businessName: yup.string().required('Business name is required'),
  businessEmail: yup.string().email('Invalid business email').required('Business email is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup.string().matches(etPhoneRegex, 'Invalid Ethiopian phone number format').required('Phone Number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
  idFront: yup.mixed().test('required', 'ID Front image is required', v => v && v.length > 0),
  idBack: yup.mixed().test('required', 'ID Back image is required', v => v && v.length > 0)
})


const { handleSubmit, errors } = useForm({ validationSchema })


const { value: fullName } = useField('fullName')
const { value: businessName } = useField('businessName')
const { value: businessEmail } = useField('businessEmail')
const { value: email } = useField('email')
const { value: phoneNumber } = useField('phoneNumber')
const { value: password } = useField('password')
const { value: confirmPassword } = useField('confirmPassword')
const { value: idFront } = useField('idFront')
const { value: idBack } = useField('idBack')


const handleIdFront = e => idFront.value = e.target.files
const handleIdBack = e => idBack.value = e.target.files


const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('FullName', values.fullName)
    formData.append('BusinessName', values.businessName)
    formData.append('BusinessEmail', values.businessEmail)
    formData.append('Email', values.email)
    formData.append('PhoneNumber', values.phoneNumber)
    formData.append('Password', values.password)
    if (values.idFront?.[0]) formData.append('KYCFrontImage', values.idFront[0])
    if (values.idBack?.[0]) formData.append('KYCBackImage', values.idBack[0])

    const response = await registerOrganizer(formData)

    if (response?.success) {
      localStorage.setItem('token', response.token)
      useUserStore().setUser(response)
      successMessage.value = 'Registration submitted! Awaiting approval.'
      setTimeout(() => router.push('/createEvent'), 1400)
    } else {
      errorMessage.value = response?.message || 'Registration failed'
    }
  } catch (err) {
    console.error('Organizer signup error:', err)
    errorMessage.value = err?.response?.data?.message || err.message || 'Registration failed'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div
    class="min-h-screen bg-linar-to-br from-indigo-100 to-purple-300 dark:from-gray-900 dark:to-gray-700 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">

      <h2 class="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
        Register as Organizer
      </h2>

      <form @submit.prevent="onSubmit" class="space-y-5">


        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Full Name</label>
          <input type="text" v-model="fullName"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <p v-if="errors.fullName" class="text-sm text-red-500 mt-1">{{ errors.fullName }}</p>
        </div>


        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Business Name</label>
          <input type="text" v-model="businessName"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <p v-if="errors.businessName" class="text-sm text-red-500 mt-1">{{ errors.businessName }}</p>
        </div>

        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Business Email</label>
          <input type="email" v-model="businessEmail"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <p v-if="errors.businessEmail" class="text-sm text-red-500 mt-1">{{ errors.businessEmail }}</p>
        </div>

        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Email</label>
          <input type="email" v-model="email"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <p v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Phone Number</label>
          <input type="text" v-model="phoneNumber" placeholder="+2519 or 09..."
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <p v-if="errors.phoneNumber" class="text-sm text-red-500 mt-1">{{ errors.phoneNumber }}</p>
        </div>

        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Password</label>
          <input type="password" v-model="password"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <p v-if="errors.password" class="text-sm text-red-500 mt-1">{{ errors.password }}</p>
        </div>

        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Confirm Password</label>
          <input type="password" v-model="confirmPassword"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <p v-if="errors.confirmPassword" class="text-sm text-red-500 mt-1">{{ errors.confirmPassword }}</p>
        </div>

        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1 font-medium">KYC Front Image</label>
          <input type="file" accept="image/*" @change="handleIdFront"
            class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700" />
          <p v-if="errors.idFront" class="text-sm text-red-500 mt-1">{{ errors.idFront }}</p>
        </div>

        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1 font-medium">KYC Back Image</label>
          <input type="file" accept="image/*" @change="handleIdBack"
            class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700" />
          <p v-if="errors.idBack" class="text-sm text-red-500 mt-1">{{ errors.idBack }}</p>
        </div>

        <button type="submit" :disabled="loading"
          class="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition shadow-md">
          {{ loading ? "Processing..." : "Register as Organizer" }}
        </button>

      </form>

      <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
      <p v-if="successMessage" class="mt-4 text-green-500 text-center">{{ successMessage }} <br> Wait for your Account
        to be Aproved</p>

      <p class="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
        Want to attend events?
        <router-link to="/signup" class="text-blue-600 dark:text-blue-400 hover:underline">
          Sign up as Attendee
        </router-link>
      </p>

    </div>
  </div>
</template>
