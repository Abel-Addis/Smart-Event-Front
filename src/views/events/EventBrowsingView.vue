<script setup>
import { onMounted } from 'vue'
import { useEventBrowsingStore } from '../../stores/useEventBrowsingStore'
import { useRouter } from 'vue-router'
import UpcomingCarousel from '../../components/events/eventBrowing/UpcomingCarousel.vue'
import EventCard from '../../components/events/eventBrowing/EventCard.vue'

const store = useEventBrowsingStore()
const router = useRouter()

onMounted(async () => {
  await Promise.all([
    store.fetchActiveEvents(),
    store.fetchUpcomingEvents()
  ])
})

const goToDetail = (eventId) => {
  router.push(`/events/${eventId}`)
}
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-indigo-50 to-purple-50">
    <section class="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-20">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold mb-6">Discover Amazing Events</h1>
        <p class="text-xl mb-8">Find concerts, festivals, workshops, and more in Ethiopia</p>
        <div class="flex justify-center gap-4">
          <button class="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100 transition">
            Explore Events
          </button>
        </div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8 text-center">Upcoming Events</h2>
        <UpcomingCarousel :events="store.upcomingEvents" />
      </div>
    </section>


    <section class="py-16">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8 text-center">Live Events</h2>
        <div v-if="store.loading" class="text-center py-12">Loading events...</div>
        <div v-else-if="store.activeEvents.length === 0" class="text-center py-12 text-gray-500">
          No active events right now. Check back soon!
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventCard
            v-for="event in store.activeEvents"
            :key="event.eventId"
            :event="event"
            @click="goToDetail(event.eventId)"
          />
        </div>
      </div>
    </section>
  </div>
</template>