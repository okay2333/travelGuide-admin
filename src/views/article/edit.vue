<template>
  <div class="container">
    <a-form layout="vertical" @submit="handleSubmit">
      <a-form-item label="封面">
        <a-input v-model:value="article.cover" />
      </a-form-item>
      <a-form-item label="标题">
        <a-input v-model:value="article.title" />
      </a-form-item>
      <a-form-item label="内容">
        <a-textarea v-model:value="article.content" rows="4" />
      </a-form-item>
      <a-form-item label="作者">
        <a-input v-model:value="article.author" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticleById, updateArticle } from '@/api/article'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()

const article = ref({
  id: 0,
  cover: '',
  title: '',
  content: '',
  author: ''
})

const fetchArticle = async () => {
  const res = await getArticleById(Number(route.params.id))
  article.value = res
}

const handleSubmit = async () => {
  await updateArticle(article.value)
  message.success('文章更新成功')
  router.push('/article')
}

onMounted(() => {
  fetchArticle()
})
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
