import { defineStore } from 'pinia'
import api from '../api/config'


export const useAdminStore = defineStore('admin', {
  state: () => ({
    pendingOrganizers: [],
    allOrganizers: [],
    allUsers: [],
    selectedOrganizer: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchPendingOrganizers() {
      this.loading = true
      try {
        const res = await api.get('/admin/organizers/get-pending')
        this.pendingOrganizers = res.data
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to load pending organizers'
      } finally {
        this.loading = false
      }
    },

    async fetchAllOrganizers() {
      this.loading = true
      const res = await api.get('/admin/organizers/get-all')
      this.allOrganizers = res.data
      this.loading = false
    },

    async fetchOrganizerById(id) {
      this.loading = true
      const res = await api.get(`/admin/organizers/get-by-id/${id}`)
      this.selectedOrganizer = res.data
      this.loading = false
    },

    async approveOrganizer(id) {
      await api.post(`/admin/organizers/approve/${id}`)
      this.pendingOrganizers = this.pendingOrganizers.filter(o => o.id !== id)
    },

    async rejectOrganizer(id) {
      await api.post(`/admin/organizers/reject/${id}`)
      this.pendingOrganizers = this.pendingOrganizers.filter(o => o.id !== id)
    },

    async fetchAllUsers() {
      this.loading = true
      const res = await api.get('/admin/users/get-all')
      this.allUsers = res.data
      this.loading = false
    },

    async searchUsers(query) {
      const res = await api.get(`/admin/users/search?q=${encodeURIComponent(query)}`)
      // const res = await api.get(`/admin/users/search`,query)
      console.log("query",query);
      console.log("res",res);
      
      this.allUsers = res.data
      console.log("result",this.allUsers);
      
    },

    async updateUserStatus(userId, isActive) {
      await api.post('/admin/users/update-status', { userId, isActive })
      const user = this.allUsers.find(u => u.id === userId)
      if (user) user.status = isActive? "Active":'Pending'
    }
  }
})