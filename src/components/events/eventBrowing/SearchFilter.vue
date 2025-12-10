<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['search', 'filter'])

const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedDate = ref('Any Date')

const categories = ['All', 'Music', 'Technology', 'Business', 'Arts', 'Sports', 'Food & Drink']
const dates = ['Any Date', 'Today', 'Tomorrow', 'This Weekend', 'Next Week']

watch([searchQuery, selectedCategory, selectedDate], () => {
    emit('filter', {
        query: searchQuery.value,
        category: selectedCategory.value,
        date: selectedDate.value
    })
})
</script>

<template>
    <div
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 -mt-12 relative z-20 border border-gray-100/50 dark:border-gray-700/50 max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <!-- Search Input -->
            <div class="md:col-span-5 relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input v-model="searchQuery" type="text"
                    class="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 sm:text-sm transition-all shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
                    placeholder="Search events, organizers, venues...">
            </div>

            <!-- Category Select -->
            <div class="md:col-span-3 relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                </div>
                <select v-model="selectedCategory"
                    class="block w-full pl-12 pr-10 py-4 text-base border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 sm:text-sm rounded-xl bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white appearance-none cursor-pointer shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                    <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            <!-- Date Select -->
            <div class="md:col-span-3 relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <select v-model="selectedDate"
                    class="block w-full pl-12 pr-10 py-4 text-base border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 sm:text-sm rounded-xl bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white appearance-none cursor-pointer shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                    <option v-for="date in dates" :key="date" :value="date">{{ date }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            <!-- Search Button -->
            <div class="md:col-span-1">
                <button @click="$emit('search')"
                    class="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/50 transform hover:scale-105 active:scale-95">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>
