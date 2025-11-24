<script setup>
import { ref } from 'vue'
import { Field, Form, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useEventWizardStore } from '../../../../stores/useEventWizardStore'
import { useEventDataStore } from '../../../../stores/useEventDataStore'
import { useEventCreationApi } from '../../../../composables/useEventCreationApi'

const emit = defineEmits(['next'])

const store = useEventWizardStore()
const dataStore = useEventDataStore()
const api = useEventCreationApi()

const isCustom = ref(false)
const loading = ref(false)

// Update schema to fix the validation
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
  console.log('Form submitted with values:', values)
  console.log('isCustom mode:', isCustom.value)
  
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

    console.log('Final payload:', payload)

    const res = await api.addTicketType(store.eventId, payload)
    const ticketId = res.id || res.ticketTypeId

    store.ticketTypes.push({
      id: ticketId,
      ...payload,
      pricingRules: []
    })

    // Reset form
    resetForm()
    isCustom.value = false
    
    console.log('Ticket added successfully!')
    
  } catch (err) {
    alert('Failed to add ticket type')
    console.error('Error adding ticket:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-10">
    <!-- Current Ticket Types -->
    <div>
      <h3 class="text-2xl font-bold mb-6">Current Ticket Types</h3>
      <div v-if="store.ticketTypes.length === 0" class="text-gray-500 italic">
        No ticket types added yet
      </div>
      <div v-else v-for="tt in store.ticketTypes" :key="tt.id" class="bg-indigo-50 p-5 rounded-xl mb-4">
        <p class="font-bold text-lg">{{ tt.name }}</p>
        <p class="text-sm text-gray-700">{{ tt.description }}</p>
        <p class="mt-2">Price: {{ tt.basePrice }} ETB | Quantity: {{ tt.quantity }}</p>
      </div>
    </div>

    <!-- Add New Ticket Type -->
    <div class="border-t pt-8">
      <h3 class="text-2xl font-bold mb-6">Add New Ticket Type</h3>

      <div class="grid grid-cols-2 gap-6 mb-8">
        <button
          type="button"
          @click="isCustom = false"
          :class="{ 'ring-4 ring-indigo-500': !isCustom }"
          class="p-6 border-2 rounded-xl hover:bg-gray-50 transition"
        >
          <p class="font-bold">Use Default Template</p>
        </button>
        <button
          type="button"
          @click="isCustom = true"
          :class="{ 'ring-4 ring-indigo-500': isCustom }"
          class="p-6 border-2 rounded-xl hover:bg-gray-50 transition"
        >
          <p class="font-bold">Create Custom Type</p>
        </button>
      </div>

      <Form
        :validation-schema="ticketSchema"
        :initial-values="{ basePrice: 0, quantity: 100, name: '', description: '', defaultTemplateId: null }"
        v-slot="{ meta }"
        @submit="onSubmit"
        class="space-y-6"
      >
        <!-- Default Template Selector -->
        <div v-if="!isCustom" class="mb-6">
          <label class="block font-medium mb-2">Choose Default Template *</label>
          <Field 
            as="select" 
            name="defaultTemplateId" 
            class="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          >
            <option :value="null" disabled>Select template</option>
            <option v-for="t in dataStore.defaultTicketTypes" :key="t.id" :value="t.id">
              {{ t.name }} — {{ t.description }}
            </option>
          </Field>
          <ErrorMessage name="defaultTemplateId" class="text-red-600 text-sm mt-1" />
          <p v-if="dataStore.loading" class="text-amber-600 text-sm mt-2">Loading templates...</p>
        </div>

        <!-- Custom Fields -->
        <div v-if="isCustom">
          <label class="block font-medium mb-2">Ticket Name *</label>
          <Field 
            name="name" 
            class="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent" 
            placeholder="e.g. VIP Access" 
          />
          <ErrorMessage name="name" class="text-red-600 text-sm mt-1" />

          <label class="block font-medium mt-4 mb-2">Description *</label>
          <Field
            as="textarea"
            name="description"
            rows="3"
            class="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="What does this ticket include?"
          />
          <ErrorMessage name="description" class="text-red-600 text-sm mt-1" />
        </div>

        <!-- Price & Quantity (always shown) -->
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block font-medium mb-2">Base Price (ETB) *</label>
            <Field 
              name="basePrice" 
              type="number" 
              class="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent" 
            />
            <ErrorMessage name="basePrice" class="text-red-600 text-sm mt-1" />
          </div>
          <div>
            <label class="block font-medium mb-2">Total Quantity *</label>
            <Field 
              name="quantity" 
              type="number" 
              class="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent" 
            />
            <ErrorMessage name="quantity" class="text-red-600 text-sm mt-1" />
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading || !meta.valid"
          class="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition"
        >
          {{ loading ? 'Adding Ticket Type...' : '+ Add This Ticket Type' }}
        </button>
      </Form>
    </div>

    <!-- Next Button -->
    <div class="flex justify-end mt-12">
      <button
        @click="emit('next')"
        :disabled="store.ticketTypes.length === 0"
        class="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xl font-bold rounded-xl transition"
      >
        Continue to Pricing Rules →
      </button>
    </div>
  </div>
</template>