<script setup>
import { ref, watch } from 'vue'
import { Field, Form, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useEventWizardStore } from '../../../../stores/useEventWizardStore'
import { useEventCreationApi } from '../../../../composables/useEventCreationApi'
import { useEventDataStore } from '../../../../stores/useEventDataStore'

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
    totalCapacity: yup.number().required("total capacity is required").min(1, "ለዚ ነው ኢቨንት የምታዘጋጀው አንት ቋጣሪ"),
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
        console.log("fd", fd);
        const res = await api.createDraftEvent(fd)
        console.log("res", res);

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
    console.log("additional image", store.basicInfo.additionalImages);

}
</script>

<template>
    <Form :validation-schema="schema" @submit="onSubmit" class="space-y-8">
        <div>
            <label class="block text-lg font-medium mb-2">Event Title *</label>
            <Field name="title" v-model="store.basicInfo.title"
                class="w-full px-5 py-4  border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="e.g. Addis Jazz Festival 2025" />
            <ErrorMessage name="title" class="text-red-600 text-sm mt-1" />
        </div>

        <div>
            <label class="block text-lg font-medium mb-2">Category *</label>
            <Field as="select" name="categoryId" v-model="store.basicInfo.categoryId"
                class="w-full px-5 py-4 border border-gray-300 rounded-xl text-lg">
                <option :value="null" disabled>Select a category</option>
                <option v-for="c in dataStore.categories" :key="c.id" :value="c.id">
                    {{ c.name }}
                </option>
            </Field>
            <ErrorMessage name="categoryId" class="text-red-600 text-sm mt-1" />
        </div>

        <div>
            <label class="block text-lg font-medium mb-2">Location / Venue *</label>
            <Field name="location" v-model="store.basicInfo.location"
                class="w-full px-5 py-4 border border-gray-300 rounded-xl" placeholder="e.g. Addis Ababa Stadium" />
            <ErrorMessage name="location" class="text-red-600 text-sm mt-1" />
        </div>
        <div>
            <label class="block text-lg font-medium mb-2">Total capacity</label>
            <Field name="totalCapacity" v-model="store.basicInfo.totalCapacity"
                class="w-full px-5 py-4 border border-gray-300 rounded-xl" placeholder="enter total capacity" />
            <ErrorMessage name="totalCapacity" class="text-red-600 text-sm mt-1" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-lg font-medium mb-2">Start Date & Time *</label>
                <Field name="startDate" v-model="store.basicInfo.startDate" type="datetime-local"
                    class="w-full px-5 py-4 border border-gray-300 rounded-xl" />
                <ErrorMessage name="startDate" class="text-red-600 text-sm mt-1" />
            </div>
            <div>
                <label class="block text-lg font-medium mb-2">End Date & Time *</label>
                <Field name="endDate" v-model="store.basicInfo.endDate" type="datetime-local"
                    class="w-full px-5 py-4 border border-gray-300 rounded-xl" />
                <ErrorMessage name="endDate" class="text-red-600 text-sm mt-1" />
            </div>
        </div>


        <div>
            <label class="block text-lg font-medium mb-2">Event Description *</label>
            <Field as="textarea" name="description" v-model="store.basicInfo.description" rows="6"
                class="w-full px-5 py-4 border border-gray-300 rounded-xl"
                placeholder="Tell people why they should come..." />
            <ErrorMessage name="description" class="text-red-600 text-sm mt-1" />
        </div>

        <div>
            <label class="block text-lg font-medium mb-2">Banner / Cover Image * (required)</label>
            <input type="file" accept="image/*" @change="handleBanner"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700" />
            <Field name="coverImage" v-model="store.basicInfo.coverImage" class="hidden" />
            <ErrorMessage name="coverImage" class="text-red-600 text-sm mt-1" />
            <img v-if="bannerPreview" :src="bannerPreview" class="mt-4 max-h-64 rounded-xl object-cover w-full"
                alt="Banner preview" />
        </div>

        <div>
            <label class="block text-lg font-medium mb-2">Gallery Images (optional)</label>
            <input type="file" multiple accept="image/*" @change="handleGallery"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700" />
            <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                <img v-for="(src, i) in galleryPreviews" :key="i" :src="src"
                    class="h-32 object-cover rounded-lg shadow" />
            </div>
        </div>

        <div class="flex justify-end mt-12">
            <button type="submit" :disabled="loading"
                class="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xl font-bold rounded-xl transition shadow-lg">
                {{ loading ? 'Creating Draft...' : 'Continue to Ticket Types →' }}
            </button>
        </div>
    </Form>
</template>