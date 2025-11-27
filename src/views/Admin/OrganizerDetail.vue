<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminStore } from '../../stores/useAdminStore'

const route = useRoute()
const store = useAdminStore()

onMounted(() => {
  store.fetchOrganizerById(route.params.id)
})
setTimeout(() => {
  console.log('selected organiner', store.selectedOrganizer);
}, 3000);
// console.log('selected organiner', store.selectedOrganizer?.status);

</script>

<template>
  <div v-if="store.selectedOrganizer" class="max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold mb-8">Organizer Profile</h2>
    <div class="bg-white rounded-2xl shadow-lg p-10">
      <div class="grid grid-cols-2 gap-8">
        <div>
          <p class="text-gray-600">Full Name</p>
          <p class="text-2xl font-bold">{{ store.selectedOrganizer.fullName }}</p>
        </div>
        <div>
          <p class="text-gray-600">Email</p>
          <p class="text-xl">{{ store.selectedOrganizer.email }}</p>
        </div>
        <div>
          <p class="text-gray-600">Phone</p>
          <p class="text-xl">{{ store.selectedOrganizer.phoneNumber }}</p>
        </div>
        <div>
          <p class="text-gray-600">Business Email</p>
          <p class="text-xl">{{ store.selectedOrganizer.businessEmail || '—' }}</p>
        </div>
        <div>
          <p class="text-gray-600">Business Name</p>
          <p class="text-xl">{{ store.selectedOrganizer.businessName || '—' }}</p>
        </div>
        <div>
          <p class="text-gray-600">Status</p>
          <span class="px-4 py-2 rounded-full text-white" :class="store.selectedOrganizer.isApproved ? 'bg-green-600' : 'bg-yellow-600'">
            {{ store.selectedOrganizer.status===1 ? 'Approved' : 'Pending' }}
          </span>
        </div>
        <div>
          <p class="text-gray-600">Approved</p>
          <p class="text-xl">{{ new Date(store.selectedOrganizer.verificationDate).toDateString() }}</p> 
        </div>
      </div>
    </div>
  </div>
</template>