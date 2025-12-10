<script setup>
import { computed, ref } from 'vue'
import { Field, Form, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useEventWizardStore } from '../../../../stores/useEventWizardStore'
import { useEventDataStore } from '../../../../stores/useEventDataStore'
import { useEventCreationApi } from '../../../../composables/useEventCreationApi'
import BaseInput from '../../../BaseInput.vue'
import BaseButton from '../../../BaseButton.vue'

const emit = defineEmits(['next'])

const store = useEventWizardStore()
const dataStore = useEventDataStore()
const api = useEventCreationApi()

const loading = ref(false)
const selectedTicketTypeId = ref(null)
const selectedRuleId = ref(null)

const currentRuleName = computed(() => {
  if (!selectedRuleId.value) return ''
  const rule = dataStore.defaultPricingRules.find(r => r.id === selectedRuleId.value)
  return rule?.ruleType?.toLowerCase() || ''
})

const ruleSchema = yup.object({
  discountPercentage: yup.number().when([], {
    is: () => currentRuleName.value.includes('lastminute') || currentRuleName.value.includes('earlybird'),
    then: (schema) => schema.required('Discount % is required').min(1).max(99),
    otherwise: (schema) => schema.nullable()
  }),
  lastNDaysBeforeEvent: yup.number().when([], {
    is: () => currentRuleName.value.includes('lastminute'),
    then: (schema) => schema.required('Last N days is required').min(1),
    otherwise: (schema) => schema.nullable()
  }),
  earlyBirdStartDays: yup.string().when([], {
    is: () => currentRuleName.value.includes('earlybird'),
    then: (schema) => schema.required('Start days is required').min(1),
    otherwise: (schema) => schema.nullable()
  }),
  earlyBirdEndDays: yup.string().when([], {
    is: () => currentRuleName.value.includes('earlybird'),
    then: (schema) => schema.required('End days is required').min(1),
    otherwise: (schema) => schema.nullable()
  }),
  demandThresholdPercentage: yup.number().when([], {
    is: () => currentRuleName.value.includes('demandbased'),
    then: (schema) => schema.required('Threshold % is required').min(1).max(99),
    otherwise: (schema) => schema.nullable()
  }),
  priceIncreasePercentage: yup.number().when([], {
    is: () => currentRuleName.value.includes('demandbased'),
    then: (schema) => schema.required('Increase % is required').min(1),
    otherwise: (schema) => schema.nullable()
  }),
})

const onSubmit = async (values) => {
  loading.value = true
  try {
    const payload = { ruleType: currentRuleName.value }

    if (currentRuleName.value.includes('lastminute')) {
      payload.discountPercent = values.discountPercentage
      payload.lastNDaysBeforeEvent = values.lastNDaysBeforeEvent
    } else if (currentRuleName.value.includes('earlybird')) {
      payload.discountPercent = values.discountPercentage
      payload.startDate = new Date(values.earlyBirdStartDays)
      payload.endDate = new Date(values.earlyBirdEndDays)
    } else if (currentRuleName.value.includes('demandbased')) {
      payload.thresholdPercentage = values.demandThresholdPercentage
      payload.priceIncreasePercent = values.priceIncreasePercentage
    }

    await api.addPricingRule(selectedTicketTypeId.value, payload)

    const tt = store.ticketTypes.find(t => t.id === selectedTicketTypeId.value)
    const ruleDef = dataStore.defaultPricingRules.find(r => r.id === selectedRuleId.value)
    tt.pricingRules.push({ name: ruleDef.ruleType, details: payload })

    selectedRuleId.value = null
    selectedTicketTypeId.value = null
  } catch (err) {
    alert('Failed to add pricing rule')
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Current Rules -->
    <div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Current Pricing Rules</h3>
      <div v-if="store.ticketTypes.every(tt => tt.pricingRules.length === 0)"
        class="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
        <p class="text-gray-500 dark:text-gray-400">No pricing rules configured</p>
      </div>
      <div v-else class="grid gap-4">
        <div v-for="tt in store.ticketTypes" :key="tt.id"
          class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p class="font-bold text-lg text-gray-900 dark:text-white mb-3">{{ tt.name }}</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="r in tt.pricingRules" :key="r.name"
              class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium border border-indigo-200 dark:border-indigo-800">
              {{ r.name }}
            </span>
            <span v-if="tt.pricingRules.length === 0" class="text-gray-400 text-sm italic">No rules applied</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add New Rule -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Add Pricing Rule (Optional)</h3>

      <Form :validation-schema="ruleSchema" @submit="onSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Apply to Ticket
              Type</label>
            <select v-model="selectedTicketTypeId"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out shadow-sm">
              <option :value="null" disabled>Select ticket type</option>
              <option v-for="tt in store.ticketTypes" :key="tt.id" :value="tt.id">
                {{ tt.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Choose Pricing Rule</label>
            <select v-model="selectedRuleId"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out shadow-sm">
              <option :value="null" disabled>Select rule</option>
              <option v-for="(rule, idx) in dataStore.defaultPricingRules" :key="idx" :value="rule.id">
                {{ rule.ruleType }}
              </option>
            </select>
          </div>
        </div>

        <!-- Conditional Fields -->
        <div v-if="selectedRuleId && currentRuleName"
          class="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <template v-if="currentRuleName.includes('lastminute')">
              <BaseInput name="discountPercentage" label="Discount Percentage" type="number" placeholder="e.g. 20" />
              <BaseInput name="lastNDaysBeforeEvent" label="Days Before Event" type="number" placeholder="e.g. 3" />
            </template>

            <template v-else-if="currentRuleName.includes('earlybird')">
              <BaseInput name="discountPercentage" label="Discount Percentage" type="number" placeholder="e.g. 15" />
              <BaseInput name="earlyBirdStartDays" label="Start Date" type="datetime-local" />
              <BaseInput name="earlyBirdEndDays" label="End Date" type="datetime-local" />
            </template>

            <template v-else-if="currentRuleName.includes('demandbased')">
              <BaseInput name="demandThresholdPercentage" label="Demand Threshold %" type="number"
                placeholder="e.g. 80" />
              <BaseInput name="priceIncreasePercentage" label="Price Increase %" type="number" placeholder="e.g. 10" />
            </template>
          </div>

          <div class="mt-6">
            <BaseButton type="submit" variant="secondary" :loading="loading"
              :disabled="!selectedTicketTypeId || !selectedRuleId">
              + Add Pricing Rule
            </BaseButton>
          </div>
        </div>
      </Form>
    </div>

    <div class="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
      <BaseButton @click="emit('next')" variant="primary" size="lg">
        Continue to Review & Publish
      </BaseButton>
    </div>
  </div>
</template>