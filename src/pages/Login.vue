<script setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import useLogin from '../composables/useLogin';
import AuthLayout from '../layouts/AuthLayout.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';

const { data: loginResponse, loading: loginPending, error: loginError, message: loginMessage, log, success } = useLogin()
const router = useRouter()

const validationSchema = yup.object({
    email: yup.string().email('Invalid Email').required('Email is required'),
    password: yup.string().min(1, 'Password must be at least 6 characters').required('Password is required')
})

const { handleSubmit, errors } = useForm({ validationSchema })

const onSubmit = handleSubmit(async (values) => {
    await log(values)
    if (success.value) {
        setTimeout(() => router.push('/create-event'), 1000)
    }
})

const gotoForgetPassword = () => {
    router.push('/forgot-password')
}
</script>

<template>
    <AuthLayout>
        <div class="space-y-8">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h2>
                <p class="text-gray-600 dark:text-gray-400">Sign in to your account to continue</p>
            </div>

            <form @submit.prevent="onSubmit" class="space-y-6">
                <BaseInput
                    name="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    type="email"
                />

                <div>
                    <BaseInput
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                    />
                    <div class="flex justify-end mt-2">
                        <button type="button" @click="gotoForgetPassword"
                            class="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                            Forgot Password?
                        </button>
                    </div>
                </div>

                <BaseButton
                    type="submit"
                    variant="primary"
                    block
                    size="lg"
                    :loading="loginPending"
                >
                    {{ loginPending ? 'Signing in...' : 'Sign In' }}
                </BaseButton>

                <div v-if="loginError" class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                    <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    {{ loginMessage || 'An error occurred during login' }}
                </div>
            </form>
            
            <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                <p class="text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account? 
                    <router-link to="/signup" class="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                        Sign up
                    </router-link>
                </p>
            </div>
        </div>
    </AuthLayout>
</template>
