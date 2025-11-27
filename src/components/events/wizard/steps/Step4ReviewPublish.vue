<script setup>
import { useEventWizardStore } from '../../../../stores/useEventWizardStore'
import { useEventCreationApi } from '../../../../composables/useEventCreationApi'
import { ref } from 'vue'
const store = useEventWizardStore()
const api = useEventCreationApi()
const publishing = ref(false)

const publish = async () => {
  publishing.value = true
  try {
    await api.publishEvent(store.eventId)
    alert('🎉 Your event is now LIVE! Share the link with your audience.')
    store.reset()
    // Optional: router.push('/organizer/dashboard')
  } catch (err) {
    alert('Failed to publish event. Please try again.')
  } finally {
    publishing.value = false
  }
}
</script>

<template>
  <div class="text-center py-12">
    <h2 class="text-4xl font-bold mb-10">Ready to Go Live?</h2>

    <div class="bg-gray-50 rounded-2xl p-10 mx-auto max-w-3xl space-y-6 text-left">
      <p><strong>Title:</strong> {{ store.basicInfo.title }}</p>
      <!-- <p><strong>Category:</strong> {{ api.categories.find(c => c.id === store.basicInfo.categoryId)?.name || '-' }}</p> -->
      <p><strong>Location:</strong> {{ store.basicInfo.location }}</p>
      <p><strong>Dates:</strong> {{ store.basicInfo.startDate }} → {{ store.basicInfo.endDate }}</p>
      <p><strong>Tickets:</strong> {{ store.ticketTypes.length }} type(s)</p>
      <div v-for="tt in store.ticketTypes" :key="tt.id" class="ml-8">
        • {{ tt.name }} — {{ tt.basePrice }} ETB × {{ tt.quantity }} tickets
        <span v-if="tt.pricingRules.length"> ({{ tt.pricingRules.map(r => r.name).join(', ') }})</span>
      </div>
    </div>

    <div class="mt-12">
      <button @click="publish" :disabled="publishing"
        class="px-16 py-6 bg-green-600 hover:bg-green-700 text-white text-3xl font-bold rounded-2xl shadow-lg transform hover:scale-105 transition">
        {{ publishing ? 'Publishing...' : '🚀 PUBLISH EVENT NOW' }}
      </button>
      <p class="mt-6 text-gray-600 text-lg">Be sure about everything.</p>
    </div>
  </div>
</template>