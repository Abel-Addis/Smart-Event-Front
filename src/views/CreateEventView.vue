<script setup>
import { onMounted } from 'vue'
import EventWizard from '../components/events/wizard/EventWizard.vue'
import { useEventDataStore } from '../stores/useEventDataStore'

const dataStore = useEventDataStore()

onMounted(() => {
  dataStore.loadAll()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
          Create New Event
        </h1>
        <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
          Follow the steps to set up your amazing event.
        </p>
      </div>

      <EventWizard />
    </div>
  </div>
</template>