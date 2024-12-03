<template>
  <a-modal
    v-model:open="isVisible"
    :title="modalTitle"
    :okText="okText"
    :confirmLoading="isConfirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <!-- <a-form :model="formData" :rules="formRules">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="formData.name" />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-input v-model:value="formData.description" />
      </a-form-item>
    </a-form> -->
    <slot></slot>
  </a-modal>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const isVisible = ref(false)
const isConfirmLoading = ref(false)
// const formData = ref({
//   name: '',
//   description: ''
// })
const formRules = ref({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }]
})

const props = defineProps({
  modalTitle: {
    type: String,
    default: '添加项'
  },
  okText: {
    type: String,
    default: '确定'
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})
const formData = ref({ ...props.initialData })
const emit = defineEmits(['update:open'])

const handleSubmit = async () => {
  isConfirmLoading.value = true
  // 模拟提交请求
  setTimeout(() => {
    console.log('提交的数据：', formData.value)
    isConfirmLoading.value = false
    emit('update:open', false) // 关闭模态框
  }, 2000)
}

const handleCancel = () => {
  emit('update:open', false) // 关闭模态框
}
</script>
