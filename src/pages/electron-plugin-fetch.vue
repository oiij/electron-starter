<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { UploadCustomRequestOptions } from 'naive-ui'
import { fetch } from 'electron-plugin-fetch'

defineOptions({

})

definePage({
  meta: {
    layout: 'default',
    title: 'ElectronPluginFetch',
    requireAuth: true,
    keepAlive: true,
    icon: 'i-mage-electricity-fill',
  },
})
const formValue = ref({
  foo: 'foo',
  bar: 'bar',
})

const fetchResult = ref()
function fetchSend() {
  fetch('http://127.0.0.1:5679', {
    method: 'POST',
    body: JSON.stringify(formValue.value),
  }).then(response => response.text()).then((res) => {
    fetchResult.value = res
  })
}
const axiosResult = ref()
function axiosSend() {
  post('http://127.0.0.1:5679', formValue.value).then((res) => {
    axiosResult.value = res
  })
}
const fetchFileResult = ref()
function customFetchRequest({ file, onFinish }: UploadCustomRequestOptions) {
  if (!file.file)
    return
  const formData = new FormData()
  formData.append('file', file.file)
  fetch('http://127.0.0.1:5679/upload-file', {
    method: 'POST',
    body: formData,
  }).then(response => response.blob()).then((res) => {
    console.log(res)
    fetchFileResult.value = res

    onFinish()
  })
}
const axiosFileResult = ref()
function customAxiosRequest({ file, onFinish }: UploadCustomRequestOptions) {
  if (!file.file)
    return
  const formData = new FormData()
  formData.append('file', file.file)
  post('http://127.0.0.1:5679/upload-file', formData).then((res) => {
    console.log(res)
    axiosFileResult.value = res

    onFinish()
  })
}
</script>

<template>
  <div class="h-full w-full flex-col gap-[20px] p-[20px]">
    <h1 class="text-center text-[20px]">
      ElectronPluginFetch
    </h1>
    <div class="flex-col-center">
      <div class="w-[240px] flex-col gap-[10px]">
        <NInput v-model:value="formValue.foo" />
        <NInput v-model:value="formValue.bar" />
      </div>
    </div>
    <div class="w-full flex flex-1 gap-[20px]">
      <div class="flex-col flex-1 gap-[10px] rounded-[12px] bg-white p-[10px]">
        <h3 class="text-center text-[16px]">
          Fetch
        </h3>
        <div class="flex-col gap-[10px]">
          <div class="w-full flex-col gap-[10px]">
            <p>Post请求：</p>
            <div>
              <NButton @click="fetchSend">
                发送
              </NButton>
            </div>
            <div>
              <span>结果：</span>
              <span>{{ fetchResult }}</span>
            </div>
          </div>
          <div class="w-full flex-col gap-[10px]">
            <p>上传文件：</p>
            <NUpload :custom-request="customFetchRequest">
              <NButton>上传文件</NButton>
            </NUpload>
            <div>
              <span>结果：</span>
              <span>{{ fetchFileResult }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-col flex-1 rounded-[12px] bg-white p-[10px]">
        <h3 class="text-center text-[16px]">
          Axios
        </h3>
        <div class="flex-col gap-[10px]">
          <div class="w-full flex-col gap-[10px]">
            <p>Post请求：</p>
            <div>
              <NButton @click="axiosSend">
                发送
              </NButton>
            </div>
            <div>
              <span>结果：</span>
              <span>{{ axiosResult }}</span>
            </div>
          </div>
          <div class="w-full flex-col gap-[10px]">
            <p>上传文件：</p>
            <NUpload :custom-request="customAxiosRequest">
              <NButton>上传文件</NButton>
            </NUpload>
            <div>
              <span>结果：</span>
              <span>{{ axiosFileResult }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
