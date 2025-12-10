<script setup>
import BaseButton from '../../BaseButton.vue'

defineProps({
  event: Object
})

defineEmits(['click'])
</script>

<template>
  <div @click="$emit('click')"
    class="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700/50 flex flex-col h-full hover:border-indigo-200 dark:hover:border-indigo-800/50">
    <div class="relative h-64 overflow-hidden">
      <img :src="event.bannerImageUrl || '/placeholder-event.jpg'" :alt="event.title"
        class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>

      <!-- Category Badge -->
      <div class="absolute top-4 left-4">
        <span
          class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg border border-white/20">
          {{ event?.categoryName || 'Event' }}
        </span>
      </div>

      <!-- Price Badge -->
      <div class="absolute top-4 right-4">
        <span class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm border border-white/20">
          {{ event.lowestTicketPrice ? event.lowestTicketPrice + ' ETB' : 'Free' }}
        </span>
      </div>
    </div>

    <div class="p-6 flex-1 flex flex-col">
      <!-- Date -->
      <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 mr-3">
          <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span class="font-medium">{{ new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
      </div>

      <!-- Title -->
      <h3
        class="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
        {{ event.title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 dark:text-gray-400 mb-5 line-clamp-2 text-sm flex-1 leading-relaxed">
        {{ event.description }}
      </p>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-gray-700/50 mt-auto">
        <div class="flex items-center text-gray-500 dark:text-gray-400 text-sm">
          <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="truncate max-w-[140px] font-medium">{{ event.location }}</span>
        </div>

        <span
          class="text-indigo-600 dark:text-indigo-400 text-sm font-semibold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
          View Details
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>