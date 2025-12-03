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
    totalCapacity:1,
    coverImage: null,
    additionalImages: []
  })

  const ticketTypes = ref([]) 

  const reset = () => {
    eventId.value = null
    basicInfo.value = {
      title: '',
      description: '',
      categoryId: null,
      location: '',
      startDate: '',
      endDate: '',
      totalCapacity:1,
      coverImage: null,
      additionalImages: []
    }
    ticketTypes.value = []
  }

  return { eventId, basicInfo, ticketTypes, reset }
})