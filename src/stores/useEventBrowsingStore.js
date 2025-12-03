import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/config'

export const useEventBrowsingStore = defineStore('eventBrowsing', () => {
  const activeEvents = ref([])
  const upcomingEvents = ref([])
  const selectedEvent = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchActiveEvents = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/EventBrowsing/activeEvents')
      activeEvents.value = data
      console.log("data",activeEvents.value);
      

    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to load active events'
    } finally {
      loading.value = false
    }
  }

  const fetchUpcomingEvents = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/EventBrowsing/upcomingEvents')
      upcomingEvents.value = data
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to load upcoming events'
    } finally {
      loading.value = false
    }
  }

  const fetchEventDetail = async (eventId) => {
    loading.value = true
    try {
      const { data } = await api.get(`/EventBrowsing/detailEvent${eventId}`) 
      selectedEvent.value = data
      console.log("selected event",selectedEvent.value);
      
    } catch (err) {
      error.value = err.response?.data?.error || 'Event not found'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createBooking = async (bookingData) => {
    loading.value = true
    try {
      const { data } = await api.post('/bookings/create-booking', bookingData)
      console.log("data",data);
      
      return data 
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to create booking'
      throw err
    } finally {
      loading.value = false
    }
  }

  
  const initiatePayment = async (paymentData) => {
    loading.value = true
    try {
      const { data } = await api.post('/Payment/init', paymentData)
      return data 
    } catch (err) {
      error.value = err.response?.data?.error || 'Payment failed'
      throw err
    } finally {
      loading.value = false
    }
  }
  const verifyPaymet=async(txnRef)=>{
    loading.value=true
    try {
      const {data}=await api.post('Payment/callback',txnRef)
      return data
    } catch (err) {
      error.value=err.response?.data?.error||'verification failed'
    }finally{
      loading.value=false
    }
  }

  return {
    activeEvents,
    upcomingEvents,
    selectedEvent,
    loading,
    error,
    fetchActiveEvents,
    fetchUpcomingEvents,
    fetchEventDetail,
    createBooking,
    initiatePayment,
    verifyPaymet 
  }
})