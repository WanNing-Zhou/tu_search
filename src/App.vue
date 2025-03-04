<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import FBImg from './pages/FBImg/index.vue'
import FBWord from "@/pages/FBWord/index.vue";


const route = ref('')
const enterAction = ref({})

onMounted(() => {
  window.utools.onPluginEnter((action) => {
    route.value = action.code
    enterAction.value = action
  })
  window.utools.onPluginOut((isKill) => {
    route.value = ''
  })
})
</script>

<template>
  <template v-if="route === 'search'">
    <FBImg :enter-action="enterAction"></FBImg>
  </template>
  <template v-if="route === 'find'">
    <FBWord :enter-action="enterAction"></FBWord>
  </template>
</template>
