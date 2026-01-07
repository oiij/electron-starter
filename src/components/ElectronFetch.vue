<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { fetch } from 'electron-plugin-fetch/fetch'
import { NFlex, NInput } from 'naive-ui'
import { ref } from 'vue'
import { axiosInstance } from '~/utils/http'

const url = ref('')
function handleFetch() {
  fetch(url.value).then((res) => {
    console.log(res)

    return res.text()
  }).then((text) => {
    console.log(text)
  }).catch((err) => {
    console.log(err)
  })
}
function handleAxios() {
  axiosInstance.get(url.value).then((res) => {
    console.log(res)
  }).catch((err) => {
    console.log(err)
  })
}
</script>

<template>
  <NFlex vertical>
    <NInput v-model:value="url" placeholder="Enter URL" />
    <NButton @click="handleFetch">
      Fetch
    </NButton>
    <NButton @click="handleAxios">
      Axios
    </NButton>
  </NFlex>
</template>

<style scoped>

</style>
