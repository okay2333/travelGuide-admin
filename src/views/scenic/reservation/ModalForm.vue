<template>
  <a-modal
    v-model:visible="isVisible"
    :title="modalTitle"
    :okText="okText"
    :confirmLoading="isConfirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form :model="formData" :rules="formRules">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="formData.name" />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-input v-model:value="formData.description" />
      </a-form-item>
      <!-- 更多表单项 -->
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { Modal, Form, Input } from 'ant-design-vue'

const isVisible = ref(false)
const isConfirmLoading = ref(false)

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
const emit = defineEmits(['update:visible'])

const openModal = () => {
  isVisible.value = true
  formData.value = { name: '', description: '' } // 重置表单
}

const handleSubmit = async () => {
  isConfirmLoading.value = true
  // 模拟提交请求
  setTimeout(() => {
    console.log('提交的数据：', formData.value)
    isConfirmLoading.value = false
    emit('update:visible', false) // 关闭模态框
  }, 2000)
}

const handleCancel = () => {
  emit('update:visible', false) // 关闭模态框
}
</script>
