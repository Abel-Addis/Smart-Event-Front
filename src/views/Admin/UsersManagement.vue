<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../../stores/useAdminStore'
import UserTableRow from '../../components/Admin/UserTableRow.vue'

const store = useAdminStore()
const searchQuery = ref('')

const search = () => {
  if (searchQuery.value) {
    store.searchUsers(searchQuery.value)
  } else {
    store.fetchAllUsers()
  }
}

onMounted(() => store.fetchAllUsers())
console.log("users", store.fetchAllUsers());

</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold">Users ({{ store.allUsers.length }})</h2>
      <div class="flex gap-4">
        <input v-model="searchQuery" @keyup.enter="search" placeholder="Search by name/email..." class="px-6 py-3 border rounded-xl w-96" />
        <button @click="search" class="px-6 py-3 bg-indigo-600 text-white rounded-xl">Search</button>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left">Name</th>
            <th class="px-6 py-4 text-left">Email</th>
            <th class="px-6 py-4 text-left">Role</th>
            <th class="px-6 py-4 text-left">Status</th>
            <th class="px-6 py-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <UserTableRow v-for="user in store.allUsers" :key="user.id" :user="user" />
        </tbody>
      </table>
    </div>
  </div>
</template>