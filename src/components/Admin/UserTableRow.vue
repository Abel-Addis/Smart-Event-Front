<script setup>
import { useAdminStore } from '../../stores/useAdminStore'
const props = defineProps(['user'])
const store = useAdminStore()

const toggleStatus = async () => {
  await store.updateUserStatus(props.user.id, !(props.user.status==="Active"))
  // console.log("togglestatus clicked");
  
}
// console.log(`status ${props.user?.fullName}`,!(props.user.status==="Active"));

</script>

<template>
  <tr class="border-t hover:bg-gray-50">
    <td class="px-6 py-4">{{ user.fullName }}</td>
    <td class="px-6 py-4">{{ user.email }}</td>
    <td class="px-6 py-4">{{ user.role }}</td>
    <td class="px-6 py-4">
      <span class="px-3 py-1 rounded-full text-sm" :class="user.status==='Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        {{ user.status==="Active" ? 'Active' : 'Inactive' }}
      </span>
    </td>
    <td class="px-6 py-4">
      <button @click="toggleStatus" class="text-indigo-600 hover:underline font-medium">
        {{ user.status==="Active" ? 'Block' : 'Unblock' }}
      </button>
    </td>
  </tr>
</template>