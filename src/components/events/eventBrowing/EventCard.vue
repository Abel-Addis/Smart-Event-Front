<script setup>
const props = defineProps({
  event: Object
})

const emit = defineEmits(['click'])
</script>

<template>
  <div @click="$emit('click')" class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">

    <div class="relative h-64 overflow-hidden">
      <img :src="event.bannerImageUrl || '/placeholder-event.jpg'" :alt="event.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <div class="absolute top-4 left-4">
        <span class="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">{{ event?.categoryName || 'Event' }}</span>
      </div>
      <div class="absolute top-4 right-4">
        <span class="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">{{ event.lowestTicketPrice ? event.lowestTicketPrice + ' ETB' : 'Free' }}</span>
      </div>
    </div>

    
    <div class="p-6">
      <h3 class="text-xl font-bold mb-2 line-clamp-2">{{ event.title }}</h3>
      <p class="text-gray-600 mb-3 line-clamp-2">{{ event.description }}</p>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center text-gray-500">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
          <span>{{ event.location }}</span>
        </div>
        <div class="text-sm text-gray-500">
          {{ new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex -space-x-2">
          <img v-for="n in 3" :key="n" class="w-8 h-8 rounded-full border-2 border-white bg-gray-300" />
          <span class="text-sm text-gray-500 ml-2">{{ event.attendeeCount || 0 }} attending</span>
          // nati
        </div>
        <button class="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium">
          View Details
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>