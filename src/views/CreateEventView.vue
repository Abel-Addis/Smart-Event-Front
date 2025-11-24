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
  <div class="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100 py-12">
    <div class="max-w-5xl mx-auto px-4">
      <h1 class="text-5xl font-bold text-center mb-12">Create New Event</h1>
      <EventWizard />
    </div>
  </div>
</template>