<script setup>
import { ref } from 'vue'
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

const isCustom = ref(false)
const loading = ref(false)

const ticketSchema = yup.object({
  basePrice: yup.number().required('Base price is required').min(0, 'Price must be at least 0').label('Base price'),
  quantity: yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1').label('Quantity'),
  name: yup.string().when('isCustom', {
    is: true,
    then: (schema) => schema.required('Ticket name is required').min(3, 'Name must be at least 3 characters'),
    otherwise: (schema) => schema.notRequired()
  }),
  description: yup.string().when('isCustom', {
    is: true,
    then: (schema) => schema.required('Description is required').min(10, 'Description must be at least 10 characters'),
    otherwise: (schema) => schema.notRequired()
  }),
  defaultTemplateId: yup.string().when('isCustom', {
    is: false,
    then: (schema) => schema.required('Please select a template'),
    otherwise: (schema) => schema.notRequired()
  })
})

const onSubmit = async (values, { resetForm }) => {
  loading.value = true
  try {
    let payload = {}

    if (isCustom.value) {
      payload = {
        name: values.name,
        description: values.description,
        basePrice: Number(values.basePrice),
        quantity: Number(values.quantity),
      }
    } else {
      const selected = dataStore.defaultTicketTypes.find(t => t.id === values.defaultTemplateId)
      if (!selected) {
        alert('Please select a valid template')
        return
      }
      payload = {
        name: selected.name,
        description: selected.description,
        basePrice: Number(values.basePrice),
        quantity: Number(values.quantity),
      }
    }

    const res = await api.addTicketType(store.eventId, payload)
    const ticketId = res.id || res.ticketTypeId

    store.ticketTypes.push({
      id: ticketId,
      ...payload,
      pricingRules: []
    })

    resetForm()
    isCustom.value = false

  } catch (err) {
    alert('Failed to add ticket type')
    console.error('Error adding ticket:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Current Ticket Types -->
    <div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Current Ticket Types</h3>
      <div v-if="store.ticketTypes.length === 0"
        class="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
        <p class="text-gray-500 dark:text-gray-400">No ticket types added yet</p>
      </div>
      <div v-else class="grid gap-4">
        <div v-for="tt in store.ticketTypes" :key="tt.id"
          class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-center">
          <div>
            <p class="font-bold text-lg text-gray-900 dark:text-white">{{ tt.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ tt.description }}</p>
          </div>
          <div class="text-right">
            <p class="font-bold text-indigo-600 dark:text-indigo-400">{{ tt.basePrice }} ETB</p>
            <p class="text-xs text-gray-500">{{ tt.quantity }} available</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add New Ticket Type -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Add New Ticket Type</h3>

      <div class="grid grid-cols-2 gap-4 mb-8">
        <button type="button" @click="isCustom = false"
          class="p-4 border-2 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-2"
          :class="!isCustom ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'">
          <span class="font-bold">Use Template</span>
          <span class="text-xs opacity-75">Select from predefined types</span>
        </button>
        <button type="button" @click="isCustom = true"
          class="p-4 border-2 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-2"
          :class="isCustom ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'">
          <span class="font-bold">Custom Type</span>
          <span class="text-xs opacity-75">Create your own ticket</span>
        </button>
      </div>

      <Form :validation-schema="ticketSchema"
        :initial-values="{ basePrice: 0, quantity: 100, name: '', description: '', defaultTemplateId: null }"
        v-slot="{ meta }" @submit="onSubmit" class="space-y-6">
        <!-- Default Template Selector -->
        <div v-if="!isCustom">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Choose Template</label>
          <Field as="select" name="defaultTemplateId"
            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out shadow-sm">
            <option :value="null" disabled>Select template</option>
            <option v-for="t in dataStore.defaultTicketTypes" :key="t.id" :value="t.id">
              {{ t.name }} — {{ t.description }}
            </option>
          </Field>
          <ErrorMessage name="defaultTemplateId" class="mt-1.5 text-sm text-red-600 dark:text-red-400" />
        </div>

        <!-- Custom Fields -->
        <div v-if="isCustom" class="space-y-6">
          <BaseInput name="name" label="Ticket Name" placeholder="e.g. VIP Access" />

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <Field as="textarea" name="description" rows="3"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out shadow-sm"
              placeholder="What does this ticket include?" />
            <ErrorMessage name="description" class="mt-1.5 text-sm text-red-600 dark:text-red-400" />
          </div>
        </div>

        <!-- Price & Quantity (always shown) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput name="basePrice" label="Base Price (ETB)" type="number" placeholder="0.00" />
          <BaseInput name="quantity" label="Total Quantity" type="number" placeholder="100" />
        </div>

        <BaseButton type="submit" variant="secondary" block :loading="loading" :disabled="!meta.valid">
          {{ loading ? 'Adding Ticket Type...' : '+ Add This Ticket Type' }}
        </BaseButton>
      </Form>
    </div>

    <!-- Next Button -->
    <div class="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
      <BaseButton @click="emit('next')" variant="primary" size="lg" :disabled="store.ticketTypes.length === 0">
        Continue to Pricing Rules
      </BaseButton>
    </div>
  </div>
</template>