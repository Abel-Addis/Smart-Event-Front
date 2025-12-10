<script setup>
import { useEventWizardStore } from '../../../../stores/useEventWizardStore'
import { useEventCreationApi } from '../../../../composables/useEventCreationApi'
import { ref } from 'vue'
import BaseButton from '../../../BaseButton.vue'

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
  <div class="text-center py-8">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Ready to Go Live?</h2>

    <div
      class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 mx-auto max-w-3xl space-y-6 text-left border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Event Title</p>
          <p class="font-bold text-lg text-gray-900 dark:text-white">{{ store.basicInfo.title }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Location</p>
          <p class="font-bold text-lg text-gray-900 dark:text-white">{{ store.basicInfo.location }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
          <p class="font-bold text-lg text-gray-900 dark:text-white">{{ new
            Date(store.basicInfo.startDate).toLocaleString() }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">End Date</p>
          <p class="font-bold text-lg text-gray-900 dark:text-white">{{ new
            Date(store.basicInfo.endDate).toLocaleString() }}</p>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Ticket Configuration</p>
        <p class="font-bold text-lg text-gray-900 dark:text-white mb-2">{{ store.ticketTypes.length }} Ticket Type(s)
        </p>

        <div class="space-y-3">
          <div v-for="tt in store.ticketTypes" :key="tt.id"
            class="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">{{ tt.name }}</p>
              <p class="text-sm text-gray-500">{{ tt.quantity }} tickets available</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-indigo-600 dark:text-indigo-400">{{ tt.basePrice }} ETB</p>
              <p v-if="tt.pricingRules.length" class="text-xs text-purple-600 dark:text-purple-400 mt-1">
                {{ tt.pricingRules.length }} rule(s) active
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12 flex flex-col items-center gap-4">
      <BaseButton @click="publish" variant="secondary" size="lg" :loading="publishing"
        class="px-12 py-4 text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
        {{ publishing ? 'Publishing...' : '🚀 PUBLISH EVENT NOW' }}
      </BaseButton>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        By publishing, you agree to our terms and conditions.
      </p>
    </div>
  </div>
</template>