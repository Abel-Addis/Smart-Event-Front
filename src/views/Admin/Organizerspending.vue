<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAdminStore } from '../../stores/useAdminStore'
const store = useAdminStore()

onMounted(() => store.fetchPendingOrganizers())

const approve = async (id) => {
  if (confirm('Approve this organizer?')) {
    await store.approveOrganizer(id)
  }
}

const reject = async (id) => {
  if (confirm('Reject this organizer?')) {
    await store.rejectOrganizer(id)
  }
}

const seralize = (keyDocument) => {
  try {
    const x = JSON.parse(keyDocument)
    return x
  } catch (e) {
    return { FrontImage: '' }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Pending Requests</h2>
        <p class="mt-1 text-gray-500 dark:text-gray-400">Review and approve new organizer applications.</p>
      </div>
      <div class="flex gap-3">
        <span
          class="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">
          {{ store.pendingOrganizers.length }} Pending
        </span>
      </div>
    </div>

    <div v-if="store.loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="store.pendingOrganizers.length === 0"
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
      <div
        class="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">All caught up!</h3>
      <p class="mt-1 text-gray-500 dark:text-gray-400">There are no pending organizer requests at the moment.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6">
      <div v-for="org in store.pendingOrganizers" :key="org.id"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Left: Info -->
          <div class="flex-1">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20">
                  {{ org.fullName.charAt(0) }}
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ org.fullName }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ org.businessName || 'Individual Organizer' }}
                  </p>
                </div>
              </div>
              <span
                class="px-3 py-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-semibold border border-yellow-200 dark:border-yellow-900/50">
                Pending Review
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-300">{{ org.email }}</span>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-300">{{ org.phoneNumber }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 text-xs text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Applied on {{ new Date(org.createdAt).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day:
              'numeric' }) }}
            </div>
          </div>

          <!-- Right: Documents & Actions -->
          <div
            class="lg:w-80 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-700 pt-6 lg:pt-0 lg:pl-6">
            <div class="flex-1">
              <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-3">KYC Document</h4>
              <div
                class="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 aspect-video flex items-center justify-center">
                <img v-if="seralize(org.kycIdDocument).FrontImage" :src="seralize(org.kycIdDocument).FrontImage"
                  alt="KYC Document" class="w-full h-full object-cover">
                <div v-else class="text-gray-400 flex flex-col items-center">
                  <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-xs">No Image</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 mt-auto">
              <button @click="reject(org.id)"
                class="px-4 py-2.5 bg-white dark:bg-gray-800 text-red-600 border border-red-200 dark:border-red-900/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold text-sm transition-colors">
                Reject
              </button>
              <button @click="approve(org.id)"
                class="px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold text-sm shadow-md shadow-green-500/20 transition-all">
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>