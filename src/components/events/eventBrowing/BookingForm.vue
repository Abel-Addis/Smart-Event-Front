<script setup>
import { ref, computed } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useEventBrowsingStore } from '../../../stores/useEventBrowsingStore'

const props = defineProps({ event: Object })
const store = useEventBrowsingStore()
const paymentVerified = ref(false)
const formData = ref({
  ticketTypeId: null,
  quantity: 1
})

const selectedTicket = computed(() => {
  if (!formData.value.ticketTypeId) return null
  return props.event.ticketTypes.find(t => t.ticketTypeId === formData.value.ticketTypeId)
})

const totalPrice = computed(() => {
  if (!selectedTicket.value) return 0
  return selectedTicket.value.basePrice * formData.value.quantity
})

const bookingSchema = yup.object({
  ticketTypeId: yup
    .string()
    .required('Please select a ticket type')
    .test('valid', 'Invalid ticket type', value => {
      return props.event.ticketTypes.some(t => t.ticketTypeId === value)
    }),
  quantity: yup
    .number()
    .required()
    .min(1)
    .max(10, 'Max 10 tickets per booking')
    .test('available', 'Not enough tickets available', function (value) {
      const ticket = selectedTicket.value
      if (!ticket || ticket.isSoldOut) return false
      return !ticket.isSoldOut
    })
})

const onSubmit = async () => {
  try {
    const payload = {
      eventId: props.event.eventId,
      tickets: [
        {
          ticketTypeId: formData.value.ticketTypeId,
          holderName: "Abel",
          holderPhone: "0920055493",
          quantity: formData.value.quantity
        }
      ]
    }

    console.log('Sending booking:', payload)

    const booking = await store.createBooking(payload)

    const payment = await store.initiatePayment({
      bookingId: booking.bookingId,
      amount: totalPrice.value,
      fullName: "Abel",
      email: "a@gmail.com",
      phoneNumber: "0920055493"
    })
    console.log("checkout", payment);

    if (payment.checkoutUrl) {
      const paymentWindow =window.open(payment.checkoutUrl, '_blank')
      alert(`Booking successful!\nComplete payment in the new tab.\n`)

      const timer = setInterval(async () => {
    if (paymentWindow && paymentWindow.closed) {
      clearInterval(timer)
      console.log("Payment window closed")

      try {
        const verification = await store.verifyPaymet({
          tx_ref: payment.paymentReference
        })
        paymentVerified.value = verification.verified
      } catch (err) {
        console.error("Verification failed:", err)
      }
    }
  }, 500)
    }
  } catch (err) {
    console.error(err)
    alert('Booking failed: ' + (store.error || 'Try again'))
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-2xl p-8 sticky top-8 border border-gray-100">
    <h3 class="text-2xl font-bold mb-6 text-gray-800">Book Your Tickets</h3>

    <Form :validation-schema="bookingSchema" @submit="onSubmit" class="space-y-6">
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Ticket Type</label>
        <Field as="select" name="ticketTypeId" v-model="formData.ticketTypeId"
          class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
          <option :value="null" disabled>Select a ticket type</option>
          <option v-for="ticket in props.event.ticketTypes" :key="ticket.ticketTypeId" :value="ticket.ticketTypeId">
            {{ ticket.name }} — {{ ticket.basePrice }} ETB
            <span v-if="ticket.isSoldOut" class="text-red-600 font-bold"> (Sold Out)</span>
            <span v-else> ({{ ticket.remainingQuantity || 'Available' }})</span>
          </option>
        </Field>
        <ErrorMessage name="ticketTypeId" class="text-red-600 text-sm mt-1" />
      </div>

      <div class="mb-8">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
        <Field name="quantity" v-model.number="formData.quantity" type="number" min="1" max="10"
          class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500" />
        <ErrorMessage name="quantity" class="text-red-600 text-sm mt-1" />
      </div>


      <div class="border-t-2 border-dashed border-gray-300 pt-6 mb-6">
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold text-gray-800">Total Amount</span>
          <span class="text-3xl font-bold text-indigo-600">{{ totalPrice }} ETB</span>
        </div>
      </div>


      <button type="submit" :disabled="store.loading || !formData.ticketTypeId || paymentVerified"
        class="w-full py-5 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50">
        {{ store.loading ? 'Processing...' : 'Proceed to Payment' }}
      </button>
      <div v-if="paymentVerified"
        class="w-full text-center py-5 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50">
        Payment verified ✔
      </div>
    </Form>
  </div>
</template>