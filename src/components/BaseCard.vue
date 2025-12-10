<template>
  <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-indigo-200 dark:hover:border-indigo-800/50">
    <div v-if="$slots.header" class="px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/50">
      <slot name="header" />
    </div>
    <div class="p-6">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-900/50 border-t border-gray-100 dark:border-gray-700">
      <slot name="footer" />
    </div>
  </div>
</template>
