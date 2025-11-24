import { defineStore } from 'pinia'
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

export const useEventDataStore = defineStore('eventData', () => {
  const categories = ref([])
  const defaultTicketTypes = ref([])
  const defaultPricingRules = ref([])
  const loading = ref(false)

  const loadAll = async () => {
    if (categories.value.length > 0) return
    loading.value = true
    try {
      const [cat, ticket, rule] = await Promise.all([
        api.get('/event-categories/get-all-categories'),
        api.get('/events/get-default-ticket-types'),
        api.get('/events/get-default-pricing-rules')
      ])
      console.log('rule',rule.data);
      
      categories.value = cat.data
      defaultTicketTypes.value = ticket.data
      defaultPricingRules.value = rule.data
      console.log('pricing rule',defaultPricingRules.value);
      
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return { categories, defaultTicketTypes, defaultPricingRules, loading, loadAll }
})