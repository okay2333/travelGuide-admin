<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { addArticle } from '@/api/article'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IEditorConfig } from '@wangeditor/editor'
const mode = 'default'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    articleDetail.value.content = '<p>模拟 Ajax 异步设置内容</p>'
  }, 1500)
})

const toolbarConfig = {}
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容...',
  MENU_CONF: {}
}

editorConfig.MENU_CONF!['uploadImage'] = {
  server: 'http://localhost:8101/api/file/upload',
  fieldName: 'file', // 上传文件的字段名
  maxFileSize: 15 * 1024 * 1024, // 最大文件大小，单位 B
  maxNumberOfFiles: 15, // 最多可上传几个文件
  allowedFileTypes: ['image/*'], // 允许上传的文件类型
  // 继续写其他配置...
  // 自定义插入图片

  async customInsert(res: any, insertFn: any) {
    console.log('回调但会结果', res)
    const url = res.data // 获取图片 URL
    const alt = res.data.alt || '' // 获取图片 alt
    const href = res.data.href || '' // 获取图片链接
    insertFn(url, alt, href) // 插入图片
  }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

//
const router = useRouter()

const articleDetail = ref({
  cover: '',
  title: '',
  content: ''
})

const handleOk = async () => {
  await addArticle(articleDetail.value)
  message.success('文章添加成功')
  router.push('/article')
}

const handleCancel = () => {
  router.push('/article')
}

const fileList = ref<{ url: string }[]>([]) // 头像上传列表

// TODO 部署时修改为真实接口地址
const handleChange = (info: any) => {
  if (info.file.status === 'done') {
    articleDetail.value.cover = info.fileList[0].response.data
    message.success(`${info.file.name} 文件上传成功`)
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 文件上传失败`)
  }
}
</script>

<template>
  <div class="container">
    <a-form layout="vertical" @submit="handleOk">
      <a-form-item label="封面">
        <a-upload
          action="http://localhost:8101/api/file/upload"
          @change="handleChange"
          list-type="picture-card"
          :max-count="1"
          v-model:file-list="fileList"
        >
          <div>
            <PlusOutlined />
            <div style="margin-top: 8px">Upload</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="标题">
        <a-input v-model:value="articleDetail.title" />
      </a-form-item>
      <!-- 富文本编辑器 -->
      <div style="border: 1px solid #ccc">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
        />
        <Editor
          style="height: 500px; overflow-y: hidden"
          v-model="articleDetail.content"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
        />
      </div>

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
