<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listPostVOByPage, getPostVOById } from '@/api/post'
// 表格结构
const columns = [
  {
    title: '预览图',
    dataIndex: 'previewImage',
    key: 'previewImage'
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
    title: '标签',
    dataIndex: 'tagList',
    key: 'tagList'
  },
  {
    title: '作者',
    dataIndex: 'author',
    key: 'author'
  },
  {
    title: '点赞数',
    dataIndex: 'thumbNum',
    key: 'thumbNum'
  },
  {
    title: '收藏数',
    dataIndex: 'favourNum',
    key: 'favourNum'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '操作',
    key: 'action'
  }
]

const PostForm = ref<PostForm>()

interface PostForm {
  id: number
  previewImage: string
  title: string
  content: string
  tags: string
}
const init = async () => {
  const res = await listPostVOByPage(queryParams)
  console.log(res)
  total.value = Number(res.total)
  current.value = Number(res.current)
  PostForm.value = res.records
}
// 分页
const current = ref(1)
const pageSize = ref(10)
const total = ref()

const queryParams = ref({
  current: current.value,
  pageSize: pageSize.value,
  title: '' // 模糊搜索字段
})
const onSearchPost = async () => {
  console.log('queryParams.value', queryParams.value)
  const res = await listPostVOByPage(queryParams.value)
  PostForm.value = res.records
}
const handlePageChange = async (currentPage: number) => {
  queryParams.value.current = currentPage
  current.value = currentPage
  const res = await listUserByPage(queryParams.value)
  UserForm.value = res.records
}
// 控制弹窗显示的状态变量
const isModalVisible = ref(false)
const showModal = async (id: number) => {
  const res = await getPostVOById(id)
  console.log('这是res', res)
  postDetail.value = res
  isModalVisible.value = true
}

// 弹窗数据
const postDetail = ref<any>()

onMounted(() => {
  init()
})
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
          @search="onSearchPost"
        />
      </div>

      <a-table :columns="columns" :data-source="PostForm" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'previewImage'">
            <img :src="record.coverList[0]" alt="" style="width: 50px; height: 50px" />
          </template>
          <template v-if="column.key === 'tagList'">
            <a-tag color="pink" v-for="item in record.tagList">item</a-tag>
          </template>

          <template v-if="column.key === 'createTime'">
            <span>{{ new Date(record.createTime).toLocaleString() }}</span>
          </template>

          <template v-if="column.key === 'author'">
            <span>{{ record.user.userName }}</span>
          </template>

          <template v-else-if="column.key === 'action'">
            <span>
              <a @click="showModal(record.id)">查看</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="你确定要删除员工?"
                ok-text="确认"
                cancel-text="取消"
                @confirm="confirmDel(record.id)"
              >
                <a>删除 </a>
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

  <a-modal v-model:open="isModalVisible" title="文章详情" width="800px" :footer="null">
    <div class="post-detail">
      <div class="post-header">
        <img :src="postDetail.coverList[0]" alt="预览图" class="post-image" />
        <div class="post-info">
          <h2>{{ postDetail.title }}</h2>
          <p>{{ postDetail.user?.userName }}</p>
          <p>{{ new Date(postDetail.createTime).toLocaleString() }}</p>
        </div>
      </div>
      <div class="post-content">
        <p>{{ postDetail.content }}</p>
      </div>
      <div class="post-tags">
        <a-tag color="pink" v-for="tag in postDetail.tagList" :key="tag">{{ tag }}</a-tag>
      </div>
    </div>
  </a-modal>
</template>
<style scoped lang="scss">
.container {
  padding: 10px;
  min-height: calc(100vh - 65px);
  display: flex;
}

.post-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-header {
  display: flex;
  gap: 20px;
}

.post-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.post-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.post-content {
  white-space: pre-wrap;
}

.post-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
