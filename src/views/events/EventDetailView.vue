<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEventBrowsingStore } from '../../stores/useEventBrowsingStore'
import BookingForm from '../../components/events/eventBrowing/BookingForm.vue'
import BaseButton from '../../components/BaseButton.vue'

const route = useRoute()
const store = useEventBrowsingStore()

onMounted(async () => {
  if (route.params.eventId) {
    await store.fetchEventDetail(route.params.eventId)
  }
})
</script>

<template>
  <div v-if="store.selectedEvent" class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950 font-sans">
    <!-- Hero Header -->
    <div class="relative h-[65vh] lg:h-[75vh] w-full overflow-hidden">
      <img :src="store.selectedEvent.media.coverImage" :alt="store.selectedEvent.title"
        class="w-full h-full object-cover scale-105" />
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-transparent to-transparent"></div>

      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse"></div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-20 text-white z-10">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-wrap items-center gap-4 mb-8">
            <span
              class="bg-white/15 backdrop-blur-md border border-white/30 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider text-white shadow-xl">
              {{ store.selectedEvent.category?.name || 'Event' }}
            </span>
            <span v-if="store.selectedEvent.lowestTicketPrice === 0"
              class="bg-gradient-to-r from-emerald-500 to-emerald-600 backdrop-blur-md px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-xl border border-emerald-400/30">
              Free Entry
            </span>
          </div>

          <h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-10 leading-tight drop-shadow-2xl max-w-5xl">
            {{ store.selectedEvent.title }}
          </h1>

          <div class="flex flex-wrap gap-6 text-lg md:text-xl font-medium tracking-wide">
            <div
              class="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 shadow-xl">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-500/30 backdrop-blur-sm">
                <svg class="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span>{{ new Date(store.selectedEvent.startDate).toLocaleString('en-US', {
                weekday: 'long', month: 'long',
                day: 'numeric', hour: '2-digit', minute: '2-digit'
              }) }}</span>
            </div>
            <div
              class="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 shadow-xl">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-500/30 backdrop-blur-sm">
                <svg class="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span>{{ store.selectedEvent.location }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-20">
      <div class="grid lg:grid-cols-12 gap-8 lg:gap-10">
        <!-- Left Column (Main Content) -->
        <div class="lg:col-span-8 space-y-8">
          <!-- About -->
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100/50 dark:border-gray-700/50">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white">About This Event</h2>
            </div>
            <div
              class="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {{ store.selectedEvent.description }}
            </div>
          </div>

          <!-- Gallery -->
          <div v-if="store.selectedEvent.media.additionalImages?.length"
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100/50 dark:border-gray-700/50">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Event Gallery</h2>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="(img, i) in store.selectedEvent.media.additionalImages" :key="i"
                class="relative group overflow-hidden rounded-2xl aspect-square cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-indigo-300 dark:hover:border-indigo-700">
                <img :src="img"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>

          <!-- Organizer -->
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100/50 dark:border-gray-700/50">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Hosted By</h2>
            </div>
            <div class="flex items-center gap-6">
              <div
                class="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-indigo-500/30 border-2 border-white/20">
                {{ store.selectedEvent.organizerName?.[0] || '?' }}
              </div>
              <div class="flex-1">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ store.selectedEvent.organizerName ||
                  'Unknown Organizer' }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <svg class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd" />
                  </svg>
                  <p class="text-gray-600 dark:text-gray-400 font-semibold">Verified Organizer</p>
                </div>
              </div>
              <BaseButton variant="outline" class="hidden sm:flex">Contact Host</BaseButton>
            </div>
          </div>
        </div>

        <!-- Right Column (Booking) -->
        <div class="lg:col-span-4">
          <div class="sticky top-24 space-y-6">
            <div
              class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100/50 dark:border-gray-700/50 relative overflow-hidden">
              <div class="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>

              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 relative z-10">Get Tickets</h3>
              <BookingForm :event="store.selectedEvent" />
            </div>

            <div
              class="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30 text-center backdrop-blur-sm">
              <p class="text-indigo-900 dark:text-indigo-300 font-semibold mb-4 text-lg">Share this event</p>
              <div class="flex justify-center gap-4">
                <button
                  class="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
                <button
                  class="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </button>
                <button
                  class="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4h16v16h-16v-16zm2 2v12h12v-12h-12z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="store.loading" class="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center gap-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="text-gray-500 dark:text-gray-400">Loading event details...</p>
    </div>
  </div>

  <div v-else class="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Event Not Found</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-6">The event you're looking for doesn't exist or has been removed.
      </p>
      <BaseButton @click="$router.push('/events')">Browse Events</BaseButton>
    </div>
  </div>
</template>