<script setup>
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

// Use vee-validate if inside a form context, otherwise fallback to v-model
const { value, errorMessage, handleBlur, handleChange } = useField(() => props.name, undefined, {
  syncVModel: true
})
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="name" class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 tracking-wide">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="name"
        :name="name"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        @input="handleChange"
        @blur="handleBlur"
        class="w-full px-4 py-3.5 rounded-xl border-2 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 ease-out shadow-sm hover:border-gray-400 dark:hover:border-gray-600 dark:border-gray-700"
        :class="{ 
          'border-red-400 focus:ring-red-500/50 focus:border-red-500 dark:border-red-500': errorMessage,
          'border-gray-200 dark:border-gray-700': !errorMessage
        }"
      />
      <div v-if="errorMessage" class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    <p v-if="errorMessage" class="mt-2 text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      {{ errorMessage }}
    </p>
  </div>
</template>
