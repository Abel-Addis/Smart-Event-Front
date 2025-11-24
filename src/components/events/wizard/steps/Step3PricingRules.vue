<script setup>
import { computed, ref } from 'vue'
import { Field, Form, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useEventWizardStore } from '../../../../stores/useEventWizardStore'
import { useEventDataStore } from '../../../../stores/useEventDataStore'
import { useEventCreationApi } from '../../../../composables/useEventCreationApi'

const emit = defineEmits(['next'])

const store = useEventWizardStore()
const dataStore = useEventDataStore()
const api = useEventCreationApi()

const loading = ref(false)
const selectedTicketTypeId = ref(null)
const selectedRuleId = ref(null)

// Safe rule name
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
  })
  // .test('is-valid-date', 'Please select a valid start date', value => {
  //           if (!value) return false;
  //           return !isNaN(new Date(value).getTime());
  //       })
        ,
  earlyBirdEndDays: yup.string().when([], {
    is: () => currentRuleName.value.includes('earlybird'),
    then: (schema) => schema.required('End days is required').min(1),
    otherwise: (schema) => schema.nullable()
  })
  // .test('is-valid-date', 'Please select a valid end date', value => {
  //   if (!value) return false;
  //   return !isNaN(new Date(value).getTime());
  // })
  //   .test('is-after-start', 'End date must be after start date', function (value) {
  //     const startDate = new Date(this.parent.startDate);
  //     const endDate = new Date(value);
  //     return endDate > startDate;
  //   }),
  ,demandThresholdPercentage: yup.number().when([], {
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
    // const payload = { pricingRuleId: selectedRuleId.value }
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
    console.log('date time',values.earlyBirdStartDays);
    
    // console.log(payload);
    console.log('Payload', payload);
    console.log('values', values)

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
  <div class="space-y-10">
    <!-- Current Rules -->
    <div>
      <h3 class="text-2xl font-bold mb-6">Current Pricing Rules</h3>
      <div v-for="tt in store.ticketTypes" :key="tt.id" class="bg-purple-50 p-6 rounded-xl mb-6">
        <p class="font-bold text-lg mb-3">{{ tt.name }}</p>
        <div class="flex flex-wrap gap-3">
          <span v-for="r in tt.pricingRules" :key="r.name"
            class="px-4 py-2 bg-purple-600 text-white rounded-full text-sm">
            {{ r.name }}
          </span>
          <span v-if="tt.pricingRules.length === 0" class="text-gray-400 italic">No pricing rules yet</span>
        </div>
      </div>
    </div>

    <!-- Add New Rule -->
    <div class="border-t pt-8">
      <h3 class="text-2xl font-bold mb-8">Add Pricing Rule (Optional)</h3>

      <Form :validation-schema="ruleSchema" @submit="onSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block font-medium mb-2">Apply to Ticket Type</label>
            <select v-model="selectedTicketTypeId" class="w-full px-5 py-4 border rounded-xl">
              <option :value="null" disabled>Select ticket type</option>
              <option v-for="tt in store.ticketTypes" :key="tt.id" :value="tt.id">
                {{ tt.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block font-medium mb-2">Choose Pricing Rule</label>
            <select v-model="selectedRuleId" class="w-full px-5 py-4 border rounded-xl">
              <option :value="null" disabled>Select rule</option>
              <option v-for="(rule, idx) in dataStore.defaultPricingRules" :key="idx" :value="rule.id">
                {{ rule.ruleType }}
              </option>
            </select>
            <p v-if="dataStore.defaultPricingRules.length === 0" class="text-amber-600 text-sm mt-2">
              No pricing rules available (contact admin)
            </p>
          </div>
        </div>

        <!-- Conditional Fields -->
        <div v-if="selectedRuleId && currentRuleName" class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <template v-if="currentRuleName.includes('lastminute')">
            <div>
              <Field name="discountPercentage" type="number" placeholder="Discount %"
                class="w-full px-5 py-4 border rounded-xl" />
              <ErrorMessage name="discountPercentage" class="text-red-600 text-sm" />
            </div>
            <div>
              <Field name="lastNDaysBeforeEvent" type="number" placeholder="Last N days"
                class="w-full px-5 py-4 border rounded-xl" />
              <ErrorMessage name="lastNDaysBeforeEvent" class="text-red-600 text-sm" />
            </div>
          </template>

          <template v-else-if="currentRuleName.includes('earlybird')">
            <div>
              <Field name="discountPercentage" type="number" placeholder="Discount %"
                class="w-full px-5 py-4 border rounded-xl" />
              <ErrorMessage name="discountPercentage" class="text-red-600 text-sm" />
            </div>
            <div>
              <Field name="earlyBirdStartDays" type="datetime-local" number placeholder="Start days before"
                class="w-full px-5 py-4 border rounded-xl" />
              <ErrorMessage name="earlyBirdStartDays" class="text-red-600 text-sm" />
            </div>
            <div>
              <Field name="earlyBirdEndDays" type="datetime-local" placeholder="End days before"
                class="w-full px-5 py-4 border rounded-xl" />
              <ErrorMessage name="earlyBirdEndDays" class="text-red-600 text-sm" />
            </div>
          </template>

          <template v-else-if="currentRuleName.includes('demandbased')">
            <div>
              <Field name="demandThresholdPercentage" type="number" placeholder="Threshold %"
                class="w-full px-5 py-4 border rounded-xl" />
              <ErrorMessage name="demandThresholdPercentage" class="text-red-600 text-sm" />
            </div>
            <div>
              <Field name="priceIncreasePercentage" type="number" placeholder="Increase %"
                class="w-full px-5 py-4 border rounded-xl" />
              <ErrorMessage name="priceIncreasePercentage" class="text-red-600 text-sm" />
            </div>
          </template>
        </div>

        <button type="submit" :disabled="loading || !selectedTicketTypeId || !selectedRuleId"
          class="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl">
          {{ loading ? 'Adding...' : '+ Add Pricing Rule' }}
        </button>
      </Form>
    </div>

    <div class="flex justify-end mt-12">
      <button @click="emit('next')"
        class="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold rounded-xl">
        Continue to Review & Publish →
      </button>
    </div>
  </div>
</template>