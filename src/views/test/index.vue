<template>
  <div class="container">
    <a-button type="primary" @click="showModal">二次封装模态框</a-button>
  </div>
  <ModalForm v-model:open="isModalVisible" :modalTitle="'添加新项'" :okText="'提交'"
    ><a-form :model="formData" :rules="formRules">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="formData.name" />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-input v-model:value="formData.description" />
      </a-form-item> </a-form
  ></ModalForm>

  <div>
    <!-- 输入框，用于输入标签 -->
    <a-input
      v-model:value="inputValue"
      @keyup.enter="addTag"
      placeholder="输入标签并按回车"
      style="width: 200px"
    />
    <div style="margin-top: 10px">
      <!-- 标签展示，点击关闭按钮删除标签 -->
      <a-tag
        v-for="(tag, index) in tags"
        :key="index"
        closable
        @close="removeTag(index)"
        style="margin: 5px"
      >
        {{ tag }}
      </a-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ModalForm from './ModalForm.vue'

const isModalVisible = ref(false)

const showModal = () => {
  isModalVisible.value = true // 打开模态框
}

// 标签输入框的绑定值
const inputValue = ref('')
// 存储所有标签的数组
const tags = ref([])

// 添加标签
const addTag = () => {
  if (inputValue.value && !tags.value.includes(inputValue.value)) {
    tags.value.push(inputValue.value)
  }
  inputValue.value = '' // 清空输入框
}

// 删除标签
const removeTag = (index) => {
  tags.value.splice(index, 0)
}
</script>

<style scoped>
.container {
  padding: 10px;
  min-height: calc(100vh - 65px);
  display: flex;
}
</style>
