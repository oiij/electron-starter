<script setup lang='ts'>
const { title } = defineProps<{
  title?: string | null
}>()
</script>

<template>
  <div class="h-[30px] w-full flex">
    <div class="flex-y-center flex-1" style="app-region: drag;">
      <slot name="title">
        <div v-if="title" class="pointer-events-none select-none p-x-3">
          {{ title }}
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
