<template>
  <div class="tdesign-demo-block-column-large">
    <div>
      <t-radio-group v-model="uploadMethod" variant="default-filled">
        <t-radio-button value="requestSuccessMethod">上传成功示例</t-radio-button>
        <t-radio-button value="requestFailMethod">上传失败示例</t-radio-button>
      </t-radio-group>
    </div>

    <t-upload
      ref="uploadRef"
      v-model="files"
      :request-method="requestMethod"
      placeholder="自定义上传方法需要返回成功或失败信息"
      :on-fail="handleRequestFail"
    ></t-upload>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';

const files = ref([]);
const uploadRef = ref();
const uploadMethod = ref('requestSuccessMethod');

// file 为等待上传的文件信息，用于提供给上传接口。file.raw 表示原始文件
const requestSuccessMethod = (file) => {
  return new Promise((resolve) => {
    // file.percent 用于控制上传进度，如果不希望显示上传进度，则不对 file.percent 设置值即可。
    // 如果代码规范不能设置 file.percent，也可以设置 files
    file.percent = 0;
    const timer = setTimeout(() => {
      // resolve 参数为关键代码
      resolve({ status: 'success', response: { url: 'https://tdesign.gtimg.com/site/avatar.jpg' } });
      file.percent = 100;
      clearTimeout(timer);
    }, 1000);
  });
};

const requestFailMethod = (file) => {
  console.log(file);
  return new Promise((resolve) => {
    // resolve 参数为关键代码
    resolve({ status: 'fail', error: '上传失败，请检查文件是否符合规范' });
  });
};

const handleRequestFail = (e) => {
  console.log(e);
};

const requestMethod = computed(() =>
  uploadMethod.value === 'requestSuccessMethod' ? requestSuccessMethod : requestFailMethod,
);
</script>
