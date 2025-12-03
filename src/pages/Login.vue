<script setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import useLogin from '../composables/useLogin';
import { ref } from 'vue';


const { data: loginResponse, loading: loginPending, error: loginError, message: loginMessage, log, success } = useLogin()
const router = useRouter()

const validationSchema = yup.object({
    email: yup.string().email('Invalid Email').required('Email is required'),
    password: yup.string().min(1, 'password must be at least 6 characters').required('password is required')
})

const { handleSubmit, errors, submitCount } = useForm({ validationSchema })

const { value: email } = useField('email')
const { value: password } = useField('password')

const onSubmit = handleSubmit(async (values) => {
    await log(values)
    if (success.value) {
        setTimeout(() => router.push('/create-event'), 3000)
    }
})
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <div class="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">

            <h2 class="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-6">
                Login
            </h2>

            <form @submit.prevent="onSubmit" class="space-y-5">

                <div>
                    <label class="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                        Email
                    </label>
                    <input type="text" v-model="email" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <p v-if="errors.email" class="text-sm text-red-500 mt-1">
                        {{ errors.email }}
                    </p>
                </div>

             
                <div>
                    <label class="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                        Password
                    </label>
                    <input type="password" v-model="password" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <p v-if="errors.password" class="text-sm text-red-500 mt-1">
                        {{ errors.password }}
                    </p>
                </div>

       
                <button type="submit" class="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 
                 text-white font-semibold shadow-sm transition disabled:opacity-50" :disabled="loginPending">
                    <span v-if="loginPending">Logging in...</span>
                    <span v-else>Login</span>
                </button>

            </form>

        </div>
    </div>
</template>
