<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventBrowsingStore } from '../../stores/useEventBrowsingStore'
import BookingForm from '../../components/events/eventBrowing/BookingForm.vue'

const route = useRoute()
const router = useRouter()
const store = useEventBrowsingStore()

onMounted(async () => {
  if (route.params.eventId) {
    await store.fetchEventDetail(route.params.eventId)
  }
})
</script>

<template>
  <div v-if="store.selectedEvent" class="min-h-screen bg-gray-50">
    
    <div class="relative h-96 md:h-screen max-h-screen overflow-hidden">
      <img
        :src="store.selectedEvent.media.coverImage"
        :alt="store.selectedEvent.title"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"></div>

      
      <div class="absolute bottom-0 left-0 right-0 text-white p-6 md:p-12">
        <div class="max-w-6xl mx-auto">
          <span class="inline-block bg-indigo-600 px-4 py-2 rounded-full text-sm font-bold mb-4">
            {{ store.selectedEvent.category?.name || 'better if returned from the backend' }}
          </span>
          <h1 class="text-4xl md:text-6xl font-bold mb-4">{{ store.selectedEvent.title }}</h1>
          <div class="flex flex-wrap items-center gap-6 text-lg md:text-xl">
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
              <span>{{ new Date(store.selectedEvent.startDate).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</span>
            </div>
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
              <span>{{ store.selectedEvent.location }}</span>
            </div>
          </div>
          <p class="mt-6 text-xl">Starting from <strong>{{ store.selectedEvent.lowestTicketPrice }} ETB</strong></p>
        </div>
      </div>
    </div>


    <div class="max-w-6xl mx-auto px-4 py-12 -mt-20 relative z-10">
      <div class="grid lg:grid-cols-3 gap-10">

        <div class="lg:col-span-2 space-y-10">

          <div class="bg-white rounded-2xl shadow-xl p-8">
            <h2 class="text-3xl font-bold mb-6">About This Event</h2>
            <p class="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
              {{ store.selectedEvent.description }}
            </p>
          </div>


          <div v-if="store.selectedEvent.media.additionalImages?.length" class="bg-white rounded-2xl shadow-xl p-8">
            <h2 class="text-3xl font-bold mb-6">Gallery</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <img
                v-for="(img, i) in store.selectedEvent.media.additionalImages"
                :key="i"
                :src="img"
                class="w-full h-64 object-cover rounded-xl shadow hover:scale-105 transition"
              />
            </div>
          </div>


          <div class="bg-white rounded-2xl shadow-xl p-8">
            <h2 class="text-3xl font-bold mb-6">Organizer</h2>
            <div class="flex items-center gap-6">
              <div class="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {{ store.selectedEvent.organizerName?.[0] || '?' }}
              </div>
              <div>
                <p class="text-2xl font-bold">{{ store.selectedEvent.organizerName || 'Unknown Organizer' }}</p>
                <p class="text-gray-600">Event Host</p>
              </div>
            </div>
          </div>
        </div>

        
        <div class="lg:col-span-1">
          <div class="sticky top-6">
            <BookingForm :event="store.selectedEvent" />
          </div>
        </div>
      </div>
    </div>
  </div>

  
  <div v-else-if="store.loading" class="flex justify-center items-center min-h-screen">
    <div class="text-2xl text-gray-600">Loading event details...</div>
  </div>
  <div v-else class="flex justify-center items-center min-h-screen">
    <div class="text-2xl text-red-600">Event not found</div>
  </div>
</template>