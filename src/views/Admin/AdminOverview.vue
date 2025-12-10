<script setup>
import { onMounted } from 'vue'
import { useAdminStore } from '../../stores/useAdminStore'
import BaseCard from '../../components/BaseCard.vue'

const store = useAdminStore()

onMounted(() => {
    store.fetchPendingOrganizers()
    store.fetchAllOrganizers()
    store.fetchAllUsers()
})
</script>

<template>
    <div class="space-y-8">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
                <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">Welcome back to the admin panel</p>
            </div>
            <div class="flex gap-3">
                <BaseButton variant="outline" size="md">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Report
                </BaseButton>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Pending Organizers Card -->
            <div
                class="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 shadow-xl border border-gray-100/50 dark:border-gray-700/50 group hover:shadow-2xl transition-all duration-500 hover:border-indigo-200 dark:hover:border-indigo-800/50">
                <div
                    class="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all blur-2xl">
                </div>
                <div class="relative">
                    <div class="flex items-center justify-between mb-6">
                        <div
                            class="p-4 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 text-indigo-600 dark:text-indigo-400 shadow-lg">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span
                            class="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">+12%</span>
                    </div>
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Pending Organizers</p>
                    <p class="text-4xl font-extrabold text-gray-900 dark:text-white">{{ store.pendingOrganizers.length }}</p>
                </div>
            </div>

            <!-- Total Organizers Card -->
            <div
                class="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 shadow-xl border border-gray-100/50 dark:border-gray-700/50 group hover:shadow-2xl transition-all duration-500 hover:border-emerald-200 dark:hover:border-emerald-800/50">
                <div
                    class="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-all blur-2xl">
                </div>
                <div class="relative">
                    <div class="flex items-center justify-between mb-6">
                        <div
                            class="p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 text-emerald-600 dark:text-emerald-400 shadow-lg">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <span
                            class="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">+5%</span>
                    </div>
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Total Organizers</p>
                    <p class="text-4xl font-extrabold text-gray-900 dark:text-white">{{ store.allOrganizers.length }}</p>
                </div>
            </div>

            <!-- Total Users Card -->
            <div
                class="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 shadow-xl border border-gray-100/50 dark:border-gray-700/50 group hover:shadow-2xl transition-all duration-500 hover:border-purple-200 dark:hover:border-purple-800/50">
                <div
                    class="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all blur-2xl">
                </div>
                <div class="relative">
                    <div class="flex items-center justify-between mb-6">
                        <div
                            class="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 text-purple-600 dark:text-purple-400 shadow-lg">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <span
                            class="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">+8%</span>
                    </div>
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Total Users</p>
                    <p class="text-4xl font-extrabold text-gray-900 dark:text-white">{{ store.allUsers.length }}</p>
                </div>
            </div>
        </div>

        <!-- Recent Activity Section -->
        <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 overflow-hidden">
            <div class="p-6 border-b border-gray-100/50 dark:border-gray-700/50 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/50">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                <button class="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors flex items-center gap-1">
                    View All
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            <div class="p-6">
                <div class="space-y-6">
                    <div v-for="i in 3" :key="i" class="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div
                            class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center shrink-0 border-2 border-indigo-200/50 dark:border-indigo-800/50">
                            <span class="text-indigo-600 dark:text-indigo-400 text-sm font-bold">JD</span>
                        </div>
                        <div class="flex-1">
                            <p class="text-sm font-semibold text-gray-900 dark:text-white">John Doe registered as a new user</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">2 minutes ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
