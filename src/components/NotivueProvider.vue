<script setup lang='ts'>
import type { Push } from 'notivue'
import { Notifications, Notivue, push } from 'notivue'

onMounted(() => {
  window.$notivue = push
})
declare global {
  interface Window {
    $notivue: Push
  }
}
</script>

<template>
  <Notivue v-slot="item">
    <Notifications :item="item" />
  </Notivue>
</template>

<style scoped lang='less'>

</style>
