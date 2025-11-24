import axios from 'axios'
import { ref } from 'vue'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7119/api',
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const useEventCreationApi = () => {
  const createDraftEvent = async (payload) => {
    console.log('payload',payload);
    
    const { data } = await api.post('/events/create-event', payload)
    return data
  }

  const addTicketType = async (eventId, payload) => {
    const { data } = await api.post(`/events/add-ticket-type-to-event/${eventId}`, payload)
    return data
  }

  const addPricingRule = async (ticketTypeId, payload) => {    
    await api.post(`/events/add-pricing-rule-to-ticket-type/${ticketTypeId}`, payload)
  }

  const publishEvent = async (eventId) => {
    await api.post(`/events/publish-event/${eventId}`)
  }

  return { createDraftEvent, addTicketType, addPricingRule, publishEvent }
}