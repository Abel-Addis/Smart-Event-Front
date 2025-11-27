<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAdminStore } from '../../stores/useAdminStore'
const store = useAdminStore()

onMounted(() => store.fetchPendingOrganizers())

const approve = async (id) => {
  if (confirm('Approve this organizer?')) {
    await store.approveOrganizer(id)
  }
}
setTimeout(() => {
  console.log("pending organizer", store.pendingOrganizers)
}, 2000)
const reject = async (id) => {
  if (confirm('Reject this organizer?')) {
    await store.rejectOrganizer(id)
  }
}
const seralize=(keyDocument)=>{
  const x=ref(JSON.parse(keyDocument))
  return x.value
}
// const seralize=computed(()=>{

// })
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-3xl font-bold mb-6">Pending Organizer Requests</h2>
    <div v-if="store.loading" class="text-center py-10">Loading...</div>
    <div v-else-if="store.pendingOrganizers.length === 0" class="text-center py-20 text-gray-500 text-xl">
      No pending requests
    </div>
    <div v-else class="grid gap-6">
      <div v-for="org in store.pendingOrganizers" :key="org.id"
        class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-2xl font-bold">{{ org.fullName }}</h3>
            <p class="text-gray-600 mt-2">{{ org.email }} • {{ org.phoneNumber }}</p>
            <p class="text-sm text-gray-500 mt-4">Applied: {{ new Date(org.createdAt).toLocaleDateString() }}</p>
            <p v-if="org.businessName" class="mt-3 text-indigo-600 font-medium">{{ org.businessName }}</p>
            <img :src="seralize(org.kycIdDocument).FrontImage" alt="Front kyc image">
          </div>
          <div class="space-x-4">
            <button @click="approve(org.id)"
              class="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold">
              Approve
            </button>
            <button @click="reject(org.id)"
              class="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>