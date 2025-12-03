<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

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
    }, 4000)
  }
})

onUnmounted(() => {
  if (interval.value) clearInterval(interval.value)
})

const goToSlide = (index) => {
  currentIndex.value = index
}

const goToEvent = (eventId) => {
  if (eventId) {
    router.push(`/events/${eventId}`)
  }
}
</script>

<template>
  <div class="relative overflow-hidden rounded-2xl shadow-2xl">
    <div class="flex transition-transform duration-700 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(event, i) in props.events" :key="event.id || i" class="w-full shrink-0">
        <div class="relative h-96">
      
          <img :src="event.bannerImageUrl || 'https://via.placeholder.com/1200x600/4f46e5/ffffff?text=No+Image'"
            :alt="event.title" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
          <div class="absolute bottom-8 left-8 right-8 text-white">
            <span class="inline-block bg-indigo-600 text-sm px-4 py-2 rounded-full mb-3">
              {{ event.category?.name || 'Event' }}
            </span>
            <h3 class="text-4xl font-bold mb-3 line-clamp-2">{{ event.title }}</h3>
            <p class="text-xl mb-6 opacity-90">
              {{ new Date(event.startDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) }}
            </p>

            <button @click.stop="goToEvent(event.id)"
              class="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
      <button v-for="(event, i) in props.events" :key="i" @click="goToSlide(i)" type="button"
        class="transition-all duration-300 rounded-full"
        :class="i === currentIndex ? 'bg-white w-10 h-3' : 'bg-white/50 w-3 h-3 hover:bg-white/80'"
        :aria-label="`Go to slide ${i + 1}`">
      </button>
    </div>
  </div>
</template>