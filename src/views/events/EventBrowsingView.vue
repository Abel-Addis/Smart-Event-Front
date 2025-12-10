<script setup>
import { onMounted, ref, computed } from 'vue'
import { useEventBrowsingStore } from '../../stores/useEventBrowsingStore'
import { useRouter } from 'vue-router'
import UpcomingCarousel from '../../components/events/eventBrowing/UpcomingCarousel.vue'
import EventCard from '../../components/events/eventBrowing/EventCard.vue'
import SearchFilter from '../../components/events/eventBrowing/SearchFilter.vue'
import BaseButton from '../../components/BaseButton.vue'

const store = useEventBrowsingStore()
const router = useRouter()

const filters = ref({
  query: '',
  category: 'All',
  date: 'Any Date'
})

onMounted(async () => {
  await Promise.all([
    store.fetchActiveEvents(),
    store.fetchUpcomingEvents()
  ])
})

const handleFilter = (newFilters) => {
  filters.value = newFilters
  // In a real app, you would trigger a store action to filter events here
  // For now, we'll just filter locally or log it
  console.log('Filters applied:', newFilters)
}

const filteredEvents = computed(() => {
  let events = store.activeEvents

  if (filters.value.query) {
    const q = filters.value.query.toLowerCase()
    events = events.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q)
    )
  }

  if (filters.value.category !== 'All') {
    // Assuming event has a categoryName or similar property
    events = events.filter(e => e.categoryName === filters.value.category)
  }

  return events
})

const goToDetail = (eventId) => {
  router.push(`/events/${eventId}`)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950 font-sans">
    <!-- Hero Section -->
    <section class="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <!-- Background Image with Parallax-like effect -->
      <div class="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Concert Crowd" class="w-full h-full object-cover scale-105" />
        <div class="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/90"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-transparent"></div>
      </div>

      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 right-20 w-72 h-72 bg-indigo-500/20 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <span
          class="inline-block py-2 px-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold tracking-wider uppercase mb-8 shadow-lg">
          Discover Experiences
        </span>
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-8 leading-tight drop-shadow-2xl">
          Unforgettable Events <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">Await You</span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          Explore the best concerts, festivals, workshops, and gatherings in your city. Book tickets seamlessly and
          create memories.
        </p>
      </div>
    </section>

    <!-- Search Filter Overlay -->
    <div class="px-4 sm:px-6 lg:px-8 relative z-20 -mt-12">
      <SearchFilter @filter="handleFilter" @search="handleFilter(filters)" />
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">

      <!-- Upcoming / Featured Section -->
      <section v-if="store.upcomingEvents.length > 0">
        <div class="flex items-end justify-between mb-10">
          <div>
            <h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Trending Now</h2>
            <p class="mt-3 text-lg text-gray-600 dark:text-gray-400">Popular events happening soon</p>
          </div>
          <button
            class="hidden md:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group">
            View all
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
        <UpcomingCarousel :events="store.upcomingEvents" />
      </section>

      <!-- All Events Grid -->
      <section>
        <div class="flex items-end justify-between mb-10">
          <div>
            <h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Explore Events</h2>
            <p class="mt-3 text-lg text-gray-600 dark:text-gray-400">Find your next adventure</p>
          </div>
        </div>

        <div v-if="store.loading" class="flex justify-center py-32">
          <div class="flex flex-col items-center gap-6">
            <div class="relative">
              <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400"></div>
              <div class="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-indigo-400 opacity-20"></div>
            </div>
            <p class="text-gray-600 dark:text-gray-400 font-medium text-lg">Loading events...</p>
          </div>
        </div>

        <div v-else-if="filteredEvents.length === 0"
          class="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-100 dark:border-gray-700/50 shadow-xl">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 mb-6">
            <svg class="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">No events found</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">We couldn't find any events matching your
            criteria. Try adjusting your filters.</p>
          <BaseButton @click="filters = { query: '', category: 'All', date: 'Any Date' }" variant="primary">
            Clear Filters
          </BaseButton>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <EventCard v-for="event in filteredEvents" :key="event.eventId" :event="event"
            @click="goToDetail(event.eventId)" class="h-full" />
        </div>
      </section>
    </div>
  </div>
</template>