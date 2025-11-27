<template>
  <nav class="space-y-3">
    <router-link
      to="/admin/pending"
      class="block py-4 px-6 rounded-xl hover:bg-indigo-700 transition font-medium text-lg text-center lg:text-left"
      active-class="bg-indigo-700 shadow-lg"
      @click="$emit('click')"
    >
      Pending Organizers
    </router-link>
    <router-link
      to="/admin/organizers"
      class="block py-4 px-6 rounded-xl hover:bg-indigo-700 transition font-medium text-lg text-center lg:text-left"
      active-class="bg-indigo-700 shadow-lg"
      @click="$emit('click')"
    >
      All Organizers
    </router-link>
    <router-link
      to="/admin/users"
      class="block py-4 px-6 rounded-xl hover:bg-indigo-700 transition font-medium text-lg text-center lg:text-left"
      active-class="bg-indigo-700 shadow-lg"
      @click="$emit('click')"
    >
      Users Management
    </router-link>
  </nav>
</template>