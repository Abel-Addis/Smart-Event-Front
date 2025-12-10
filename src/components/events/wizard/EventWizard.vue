<script setup>
import { ref } from 'vue'
import Step1BasicInfo from './steps/Step1BasicInfo.vue'
import Step2TicketTypes from './steps/Step2TicketTypes.vue'
import Step3PricingRules from './steps/Step3PricingRules.vue'
import Step4ReviewPublish from './steps/Step4ReviewPublish.vue'
import BaseCard from '../../BaseCard.vue'

const currentStep = ref(1)
const steps = [Step1BasicInfo, Step2TicketTypes, Step3PricingRules, Step4ReviewPublish]
const stepTitles = ['Basic Information', 'Ticket Types', 'Pricing Rules', 'Review & Publish']
</script>

<template>
  <BaseCard class="max-w-4xl mx-auto overflow-hidden">
    <template #header>
      <div class="relative pt-4 pb-2">
        <div class="flex items-center justify-between mb-4">
          <div v-for="(title, index) in stepTitles" :key="index" class="flex flex-col items-center relative z-10 w-1/4">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2"
              :class="[
                currentStep > index + 1 ? 'bg-indigo-600 border-indigo-600 text-white' :
                  currentStep === index + 1 ? 'bg-white border-indigo-600 text-indigo-600' :
                    'bg-gray-100 border-gray-300 text-gray-400'
              ]">
              <span v-if="currentStep > index + 1">✓</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="text-xs font-medium mt-2 text-center hidden sm:block"
              :class="currentStep >= index + 1 ? 'text-indigo-600' : 'text-gray-400'">
              {{ title }}
            </span>
          </div>
        </div>

        <div class="absolute top-9 left-0 w-full h-0.5 bg-gray-200 -z-0">
          <div class="h-full bg-indigo-600 transition-all duration-500 ease-in-out"
            :style="{ width: `${((currentStep - 1) / 3) * 100}%` }"></div>
        </div>
      </div>
    </template>

    <div class="py-4">
      <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-x-4"
        enter-to-class="opacity-100 translate-x-0" leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 -translate-x-4" mode="out-in">
        <component :is="steps[currentStep - 1]" @next="currentStep++" @prev="currentStep--" :key="currentStep" />
      </transition>
    </div>
  </BaseCard>
</template>