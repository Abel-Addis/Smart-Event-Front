<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../../BaseButton.vue'

const props = defineProps({
  events: Array
})

const router = useRouter()
const currentIndex = ref(0)
const interval = ref(null)

onMounted(() => {
  if (props.events?.length > 0) {
    interval.value = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % props.events.length
    }, 5000)
  }
})

onUnmounted(() => {
  if (interval.value) clearInterval(interval.value)
})

const goToSlide = (index) => {
  currentIndex.value = index
  if (interval.value) {
    clearInterval(interval.value)
    interval.value = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % props.events.length
    }, 5000)
  }
}

const goToEvent = (eventId) => {
  if (eventId) {
    router.push(`/events/${eventId}`)
  }
}
</script>

<template>
  <div class="relative overflow-hidden rounded-3xl shadow-2xl bg-gray-900 group border-2 border-gray-800/50">
    <div class="flex transition-transform duration-700 ease-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(event, i) in props.events" :key="event.id || i" class="w-full shrink-0 relative">
        <div class="relative h-[500px] md:h-[600px]">
          <img :src="event.bannerImageUrl || 'https://via.placeholder.com/1200x600/4f46e5/ffffff?text=No+Image'"
            :alt="event.title"
            class="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-1000 ease-out" />
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-900/30 via-transparent to-transparent"></div>

          <div class="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
            <div class="max-w-4xl mx-auto text-center md:text-left">
              <span
                class="inline-block bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider shadow-xl">
                {{ event.category?.name || 'Featured Event' }}
              </span>

              <h3 class="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
                {{ event.title }}
              </h3>

              <div class="flex flex-col md:flex-row items-center md:items-start gap-6 text-gray-200 mb-10 text-lg">
                <div class="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
                  <svg class="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="font-medium">{{ new Date(event.startDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month:
                      'long', day: 'numeric' }) }}</span>
                </div>
                <div class="hidden md:block w-2 h-2 rounded-full bg-white/40 mt-3"></div>
                <div class="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
                  <svg class="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="font-medium">{{ event.location }}</span>
                </div>
              </div>

              <BaseButton @click.stop="goToEvent(event.id)" size="xl"
                class="bg-white text-indigo-900 hover:bg-indigo-50 border-none font-bold shadow-2xl px-10">
                Get Tickets
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
      <button v-for="(event, i) in props.events" :key="i" @click="goToSlide(i)" type="button"
        class="transition-all duration-300 rounded-full shadow-lg backdrop-blur-sm"
        :class="i === currentIndex ? 'bg-indigo-500 w-10 h-2.5 border-2 border-white/30' : 'bg-white/30 w-2.5 h-2.5 hover:bg-white/60 border border-white/20'"
        :aria-label="`Go to slide ${i + 1}`">
      </button>
    </div>

    <button @click="currentIndex = (currentIndex - 1 + props.events.length) % props.events.length"
      class="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-all duration-300 border border-white/20 hover:scale-110 hidden md:flex items-center justify-center shadow-xl">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <button @click="currentIndex = (currentIndex + 1) % props.events.length"
      class="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-all duration-300 border border-white/20 hover:scale-110 hidden md:flex items-center justify-center shadow-xl">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>