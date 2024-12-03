<script setup lang="ts">
import { ref } from 'vue'
import { addArticle } from '@/api/article'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const router = useRouter()

const articleDetail = ref({
  cover: '',
  title: '',
  content: '',
  author: ''
})

const handleOk = async () => {
  await addArticle(articleDetail.value)
  message.success('文章添加成功')
  router.push('/article')
}

const handleCancel = () => {
  router.push('/article')
}
</script>

<template>
  <div class="container">
    <a-form layout="vertical" @submit="handleOk">
      <a-form-item label="封面">
        <a-input v-model:value="articleDetail.cover" />
      </a-form-item>
      <a-form-item label="标题">
        <a-input v-model:value="articleDetail.title" />
      </a-form-item>
      <a-form-item label="内容">
        <a-textarea v-model:value="articleDetail.content" :rows="4" />
      </a-form-item>
      <a-form-item label="作者">
        <a-input v-model:value="articleDetail.author" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleOk">提交</a-button>
        <a-button @click="handleCancel">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="scss">
.container {
  padding: 20px;
}
</style>
