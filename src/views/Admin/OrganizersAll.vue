<script setup>
import { computed, onMounted } from 'vue'
import { useAdminStore } from '../../stores/useAdminStore'

const store = useAdminStore()

onMounted(() => store.fetchAllOrganizers())

setTimeout(()=>{
console.log("organizer",store.allOrganizers);

},2000)
</script>

<template>
  <div>
    <h2 class="text-3xl font-bold mb-6">All Organizers ({{ store.allOrganizers.length }})</h2>
    <div class="bg-white rounded-2xl shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left">Name</th>
            <th class="px-6 py-4 text-left">Email</th>
            <th class="px-6 py-4 text-left">Status</th>
            <th class="px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="org in store.allOrganizers" :key="org.id" class="border-t hover:bg-gray-50">
            <td class="px-6 py-4">{{ org.fullName }}</td>
            <td class="px-6 py-4">{{ org.email }}</td>
            <td class="px-6 py-4">
              <span class="px-3 py-1 rounded-full text-sm" :class="org.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                {{ org.status==="Active" ? 'Approved' : 'Pending' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <router-link :to="`/admin/organizer/${org.id}`" class="text-indigo-600 hover:underline">
                View Details
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>