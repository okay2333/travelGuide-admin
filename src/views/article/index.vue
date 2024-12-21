<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listArticleByPage, deleteArticle } from '@/api/article'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

// 表格结构
const columns = [
  {
    title: '封面',
    dataIndex: 'cover',
    key: 'cover'
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime'
  },
  {
    title: '操作',
    key: 'action'
  }
]

const articleDataForm = ref<any>([])
// 分页
const current = ref(1)
const pageSize = ref(10)
const total = ref()

const queryParams = ref({
  current: current.value,
  pageSize: pageSize.value,
  title: '' // 模糊搜索字段
})

const init = async () => {
  const res = await listArticleByPage(queryParams.value)
  articleDataForm.value = res.records
  total.value = Number(res.total)
  current.value = Number(res.current)
}

onMounted(() => {
  init()
})

// 分页
const handlePageChange = async (currentPage: number) => {
  queryParams.value.current = currentPage
  current.value = currentPage
  const res = await listArticleByPage(queryParams.value)
  articleDataForm.value = res.records
}

const router = useRouter()

const showAddPage = () => {
  router.push('/article/add')
}

const showEditPage = (id: number) => {
  router.push(`/article/edit/${id}`)
}

const confirmDel = async (articleId: number) => {
  await deleteArticle({ id: articleId })
  message.success('文章删除成功')
  init()
}
</script>

<template>
  <div class="container">
    <div style="width: 100%">
      <div>
        <a-input-search
          placeholder="输入文章标题全局搜索"
          enter-button
          v-model:value="queryParams.title"
          style="width: 18%; padding: 5px 0; float: right"
          @search="init"
        />
        <a-button type="primary" @click="showAddPage">添加文章</a-button>
      </div>

      <a-table :columns="columns" :data-source="articleDataForm" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'cover'">
            <img :src="record.cover" alt="封面" style="width: 50px; height: 50px" />
          </template>
          <template v-if="column.key === 'createTime'">
            <span>{{ new Date(record.createTime).toLocaleString() }}</span>
          </template>
          <template v-if="column.key === 'updateTime'">
            <span>{{ new Date(record.updateTime).toLocaleString() }}</span>
          </template>
          <template v-else-if="column.key === 'action'">
            <span>
              <a @click="showEditPage(record.id)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="你确定要删除这篇文章吗?"
                ok-text="确认"
                cancel-text="取消"
                @confirm="confirmDel(record.id)"
              >
                <a>删除</a>
              </a-popconfirm>
            </span>
          </template>
        </template>
      </a-table>
      <!-- 分页 -->
      <a-pagination
        :current="current"
        :pageSize="pageSize"
        :total="total"
        @change="handlePageChange"
        :show-total="(total: any) => `共 ${total} 条`"
        style="float: right; margin: 5px 0"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  padding: 10px;
  min-height: calc(100vh - 65px);
  display: flex;
}
</style>
