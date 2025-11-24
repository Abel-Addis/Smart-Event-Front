<script setup>
import { ref } from 'vue'
import Step1BasicInfo from './steps/Step1BasicInfo.vue'
import Step2TicketTypes from './steps/Step2TicketTypes.vue'
import Step3PricingRules from './steps/Step3PricingRules.vue'
import Step4ReviewPublish from './steps/Step4ReviewPublish.vue'

const currentStep = ref(1)
const steps = [Step1BasicInfo, Step2TicketTypes, Step3PricingRules, Step4ReviewPublish]
</script>

<template>
  <div class="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
    <div class="bg-gray-200 h-2">
      <div class="h-full bg-linear-to-r from-indigo-600 to-purple-600 transition-all duration-500"
           :style="{ width: `${(currentStep / 4) * 100}%` }" />
    </div>

    <div class="p-10">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold">Step {{ currentStep }} of 4</h2>
        <p class="text-gray-600 mt-2">
          {{ ['Basic Information', 'Ticket Types', 'Pricing Rules', 'Review & Publish'][currentStep - 1] }}
        </p>
      </div>

      <component :is="steps[currentStep - 1]"
                 @next="currentStep++"
                 @prev="currentStep--" />
    </div>
  </div>
</template>