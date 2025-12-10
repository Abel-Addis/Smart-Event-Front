<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminStore } from '../../stores/useAdminStore'

const route = useRoute()
const store = useAdminStore()

onMounted(() => {
  store.fetchOrganizerById(route.params.id)
})
</script>

<template>
  <div v-if="store.selectedOrganizer" class="space-y-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Organizer Profile</h2>
        <p class="mt-1 text-gray-500 dark:text-gray-400">Detailed information about the organizer.</p>
      </div>
      <div class="flex gap-3">
        <span class="px-4 py-2 rounded-lg text-sm font-medium border"
          :class="store.selectedOrganizer.isApproved
            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50'
            : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50'">
          {{ store.selectedOrganizer.status === 1 ? 'Approved' : 'Pending' }}
        </span>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Profile Card -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div class="flex flex-col items-center text-center">
            <div
              class="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-indigo-500/20">
              {{ store.selectedOrganizer.fullName.charAt(0) }}
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ store.selectedOrganizer.fullName }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ store.selectedOrganizer.email }}</p>

            <div class="w-full mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4">
              <div class="text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Events</p>
                <p class="text-lg font-bold text-gray-900 dark:text-white mt-1">12</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Rating</p>
                <p class="text-lg font-bold text-gray-900 dark:text-white mt-1">4.8</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Contact Info</h4>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ store.selectedOrganizer.phoneNumber }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Business Email</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ store.selectedOrganizer.businessEmail ||
                  '—' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Details -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Business Details</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/50">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Business Name</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ store.selectedOrganizer.businessName ||
                'Not Provided' }}</p>
            </div>

            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/50">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Verification Date</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ new
                Date(store.selectedOrganizer.verificationDate).toLocaleDateString(undefined, {
                  year: 'numeric', month:
                'long', day: 'numeric' }) }}</p>
            </div>
          </div>

          <div class="mt-8">
            <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-4">KYC Documents</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Placeholder for KYC documents if available in the future -->
              <div
                class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <svg class="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-sm text-gray-500 dark:text-gray-400">Document Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>