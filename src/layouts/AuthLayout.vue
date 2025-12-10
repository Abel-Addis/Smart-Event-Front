<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 p-4 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div class="absolute top-1/2 -right-40 w-96 h-96 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-40 left-1/3 w-96 h-96 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
    </div>
    
    <!-- Grid pattern overlay -->
    <div class="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
    
    <div class="w-full max-w-md relative z-10">
      <!-- Logo/Brand Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/50 mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 class="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 tracking-tight">
          SmartEvent
        </h1>
        <p class="text-gray-600 dark:text-gray-400 font-medium">Your events, elevated</p>
      </div>
      
      <!-- Main Card -->
      <div class="glass-panel dark:glass-panel-dark rounded-3xl p-8 md:p-10 shadow-2xl border border-white/20 dark:border-white/10">
        <slot />
      </div>
      
      <!-- Footer -->
      <div class="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm font-medium">
        &copy; {{ new Date().getFullYear() }} SmartEvent. All rights reserved.
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-blob {
  animation: blob 8s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes blob {
  0%, 100% { 
    transform: translate(0px, 0px) scale(1);
  }
  33% { 
    transform: translate(30px, -50px) scale(1.1);
  }
  66% { 
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, currentColor 1px, transparent 1px),
    linear-gradient(to bottom, currentColor 1px, transparent 1px);
  background-size: 40px 40px;
}
</style>
