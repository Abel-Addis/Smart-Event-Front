import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEventWizardStore = defineStore('eventWizard', () => {
  const eventId = ref(null)

  const basicInfo = ref({
    title: '',
    description: '',
    categoryId: null,
    location: '',
    startDate: '',
    endDate: '',
    bannerImage: null,
    galleryImages: []
  })

  const ticketTypes = ref([]) // { id, name, description, basePrice, quantity, pricingRules: [] }

  const reset = () => {
    eventId.value = null
    basicInfo.value = {
      title: '',
      description: '',
      categoryId: null,
      location: '',
      startDate: '',
      endDate: '',
      bannerImage: null,
      galleryImages: []
    }
    ticketTypes.value = []
  }

  return { eventId, basicInfo, ticketTypes, reset }
})