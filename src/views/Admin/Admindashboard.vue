<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAdminStore } from '../../stores/useAdminStore'
import AdminSidebar from '../../components/Admin/AdminSidebar.vue'

const store = useAdminStore()

const sidebarOpen = ref(false)
const isDesktop = ref(window.innerWidth >= 1024)

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1024

  if (isDesktop.value) {
    sidebarOpen.value = true
  } else {
    sidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()

  store.fetchPendingOrganizers()
  store.fetchAllOrganizers()
  store.fetchAllUsers()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="min-h-screen flex bg-gray-100">

    <!-- Mobile Overlay -->
    <div
      v-if="!isDesktop && sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-60 z-40"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="fixed lg:static inset-y-0 left-0 z-50 w-72 bg-linear-to-b from-indigo-800 to-indigo-900 text-white transform transition-transform duration-300"
      :class="{
        '-translate-x-full': !sidebarOpen && !isDesktop,
        'translate-x-0': sidebarOpen || isDesktop
      }"
    >
      <div class="flex flex-col h-full">
        <!-- Logo + Close (mobile) -->
        <div class="p-6 border-b border-indigo-700 flex justify-between items-center">
          <h1 class="text-2xl font-bold">SmartEvent Admin</h1>
          <button
            v-if="!isDesktop"
            @click="sidebarOpen = false"
            class="text-3xl hover:text-gray-300"
          >
            X
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-6 space-y-2">
          <AdminSidebar @click="sidebarOpen = false" />
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">

      <!-- Mobile Top Bar -->
      <header
        class="lg:hidden bg-white shadow-md px-6 py-4 flex items-center justify-between border-b z-50 relative"
      >
        <h1 class="text-xl font-bold text-gray-800">SmartEvent Admin</h1>
        <button
          @click="sidebarOpen = true"
          class="text-2xl font-bold text-indigo-600"
        >
          ☰
        </button>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6 lg:p-10 lg:ml-72">

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div class="bg-white p-6 rounded-2xl shadow-lg text-center">
            <p class="text-gray-600 text-lg">Pending Organizers</p>
            <p class="text-4xl font-bold text-indigo-600 mt-3">
              {{ store.pendingOrganizers.length }}
            </p>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-lg text-center">
            <p class="text-gray-600 text-lg">Total Organizers</p>
            <p class="text-4xl font-bold text-green-600 mt-3">
              {{ store.allOrganizers.length }}
            </p>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-lg text-center">
            <p class="text-gray-600 text-lg">Total Users</p>
            <p class="text-4xl font-bold text-purple-600 mt-3">
              {{ store.allUsers.length }}
            </p>
          </div>
        </div>

        <!-- Child Routes -->
        <router-view />
      </main>
    </div>
  </div>
</template>
