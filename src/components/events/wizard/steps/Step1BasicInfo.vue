<script setup>
import { ref } from 'vue'
import { Field, Form, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useEventWizardStore } from '../../../../stores/useEventWizardStore'
import { useEventCreationApi } from '../../../../composables/useEventCreationApi'
import { useEventDataStore } from '../../../../stores/useEventDataStore'
import BaseInput from '../../../BaseInput.vue'
import BaseButton from '../../../BaseButton.vue'

const emit = defineEmits(['next'])

const store = useEventWizardStore()
const dataStore = useEventDataStore()
const api = useEventCreationApi()

const loading = ref(false)
const bannerPreview = ref(null)
const galleryPreviews = ref([])

const schema = yup.object({
    title: yup.string().required('Event title is required').min(5).max(150),
    description: yup.string().required('Description is required').min(2),
    categoryId: yup.string().required('Please select a category'),
    location: yup.string().required('Location is required').min(5),
    totalCapacity: yup.number().required("Total capacity is required").min(1, "Capacity must be at least 1"),
    startDate: yup
        .string()
        .required('Start date & time is required')
        .test('is-valid-date', 'Please select a valid start date', value => {
            if (!value) return false;
            return !isNaN(new Date(value).getTime());
        }),
    endDate: yup
        .string()
        .required('End date & time is required')
        .test('is-valid-date', 'Please select a valid end date', value => {
            if (!value) return false;
            return !isNaN(new Date(value).getTime());
        })
        .test('is-after-start', 'End date must be after start date', function (value) {
            const startDate = new Date(this.parent.startDate);
            const endDate = new Date(value);
            return endDate > startDate;
        }),
    coverImage: yup.mixed().test('file-required', 'Banner image is required', value => {
        return store.basicInfo.coverImage !== null
    }),
})

const onSubmit = async (values) => {
    loading.value = true
    try {
        const fd = new FormData()
        fd.append('title', values.title)
        fd.append('description', values.description)
        fd.append('categoryId', values.categoryId.toString())
        fd.append('location', values.location)
        fd.append("totalCapacity", values.totalCapacity)
        fd.append('startDate', new Date(values.startDate).toISOString())
        fd.append('endDate', new Date(values.endDate).toISOString())

        if (store.basicInfo.coverImage) {
            fd.append('coverImage', store.basicInfo.coverImage)
        }

        store.basicInfo.additionalImages.forEach(file => {
            fd.append('additionalImages', file)
        })

        const res = await api.createDraftEvent(fd)
        store.eventId = res.eventId || res.data?.eventId
        emit('next')
    } catch (err) {
        console.error(err)
        alert('Failed to create draft. Check all fields and try again.')
    } finally {
        loading.value = false
    }
}

const handleBanner = (e) => {
    const file = e.target.files[0]
    if (file) {
        store.basicInfo.coverImage = file
        bannerPreview.value = URL.createObjectURL(file)
    }
}

const handleGallery = (e) => {
    const files = Array.from(e.target.files)
    store.basicInfo.additionalImages.push(...files)
    galleryPreviews.value.push(...files.map(f => URL.createObjectURL(f)))
}
</script>

<template>
    <Form :validation-schema="schema" @submit="onSubmit" class="space-y-6">
        <BaseInput name="title" label="Event Title" placeholder="e.g. Addis Jazz Festival 2025"
            v-model="store.basicInfo.title" />

        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
            <Field as="select" name="categoryId" v-model="store.basicInfo.categoryId"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out shadow-sm">
                <option :value="null" disabled>Select a category</option>
                <option v-for="c in dataStore.categories" :key="c.id" :value="c.id">
                    {{ c.name }}
                </option>
            </Field>
            <ErrorMessage name="categoryId" class="mt-1.5 text-sm text-red-600 dark:text-red-400" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput name="location" label="Location / Venue" placeholder="e.g. Addis Ababa Stadium"
                v-model="store.basicInfo.location" />
            <BaseInput name="totalCapacity" label="Total Capacity" type="number" placeholder="Enter total capacity"
                v-model="store.basicInfo.totalCapacity" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput name="startDate" label="Start Date & Time" type="datetime-local"
                v-model="store.basicInfo.startDate" />
            <BaseInput name="endDate" label="End Date & Time" type="datetime-local" v-model="store.basicInfo.endDate" />
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Event Description</label>
            <Field as="textarea" name="description" v-model="store.basicInfo.description" rows="4"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out shadow-sm"
                placeholder="Tell people why they should come..." />
            <ErrorMessage name="description" class="mt-1.5 text-sm text-red-600 dark:text-red-400" />
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Banner Image</label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:border-indigo-500 transition-colors cursor-pointer relative bg-gray-50 dark:bg-gray-800/50"
                @click="$refs.bannerInput.click()">
                <div class="space-y-1 text-center">
                    <svg v-if="!bannerPreview" class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none"
                        viewBox="0 0 48 48" aria-hidden="true">
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <img v-else :src="bannerPreview" class="mx-auto h-48 object-cover rounded-lg" />
                    <div class="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                        <span
                            class="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload a file</span>
                            <input ref="bannerInput" type="file" accept="image/*" @change="handleBanner"
                                class="sr-only" />
                        </span>
                        <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
            <Field name="coverImage" v-model="store.basicInfo.coverImage" class="hidden" />
            <ErrorMessage name="coverImage" class="mt-1.5 text-sm text-red-600 dark:text-red-400" />
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gallery Images</label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:border-indigo-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50"
                @click="$refs.galleryInput.click()">
                <div class="space-y-1 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"
                        aria-hidden="true">
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                        <span
                            class="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                            <span>Upload files</span>
                            <input ref="galleryInput" type="file" multiple accept="image/*" @change="handleGallery"
                                class="sr-only" />
                        </span>
                    </div>
                </div>
            </div>
            <div v-if="galleryPreviews.length" class="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                <div v-for="(src, i) in galleryPreviews" :key="i" class="relative aspect-square">
                    <img :src="src" class="h-full w-full object-cover rounded-lg shadow-sm" />
                </div>
            </div>
        </div>

        <div class="flex justify-end pt-6">
            <BaseButton type="submit" variant="primary" size="lg" :loading="loading">
                {{ loading ? 'Creating Draft...' : 'Continue to Ticket Types' }}
            </BaseButton>
        </div>
    </Form>
</template>