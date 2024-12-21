<script setup lang="ts" name="FeedbackManagement">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { MessageOutlined } from '@ant-design/icons-vue'
import type { FeedBackVO } from '@/api/feedback'
import { listFeedBackByPage, deleteFeedBack, updateFeedBack, getFeedBackById } from '@/api/feedback'

// 添加缺失的响应式变量
const feedbackList = ref<FeedBackVO[]>([])
const pagination = ref({
  total: 0
})

// 控制详情弹窗
const detailVisible = ref(false)
const currentFeedback = ref<FeedBackVO | null>(null)

// 表格列定义
const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    width: 200
  },
  {
    title: '真实姓名',
    dataIndex: 'fullName',
    key: 'fullName',
    width: 120
  },
  {
    title: '联系电话',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    width: 130
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
    customRender: ({ text }: { text: string }) => {
      return text ? new Date(text).toLocaleString() : ''
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '操作',
    key: 'action',
    width: 150
  }
]

// 查询参数
const queryParams = ref({
  current: 1,
  pageSize: 10,
  status: ''
})

// 获取反馈列表
const getFeedbackList = async () => {
  try {
    const res = await listFeedBackByPage(queryParams.value)
    console.log('zheshi', res)
    feedbackList.value = res.records
    pagination.value.total = Number(res.total)
  } catch (error: any) {
    console.error('获取列表错误:', error)
    message.error(error.message || '获取列表失败')
  }
}

// 删除反馈
const handleDelete = async (id: string) => {
  try {
    await deleteFeedBack({ id: Number(id) })
    message.success('删除成功')
    getFeedbackList()
  } catch (error) {
    message.error('删除失败')
  }
}

// 处理反馈
const handleFeedback = async (id: string) => {
  try {
    await updateFeedBack({
      id: Number(id),
      status: '1'
    })
    message.success('处理成功')
    getFeedbackList()
  } catch (error) {
    message.error('处理失败')
  }
}

// 查看详情
const showDetail = async (record: FeedBackVO) => {
  try {
    const res = await getFeedBackById(record.id)
    currentFeedback.value = res
    detailVisible.value = true
  } catch (error) {
    message.error('获取详情失败')
  }
}

// 搜索
const handleSearch = () => {
  queryParams.value.current = 1
  getFeedbackList()
}

// 重置搜索
const handleReset = () => {
  queryParams.value = {
    current: 1,
    pageSize: 10,
    status: ''
  }
  getFeedbackList()
}

// 分页变化
const handlePageChange = (page: number, pageSize: number) => {
  queryParams.value.current = page
  queryParams.value.pageSize = pageSize
  getFeedbackList()
}

onMounted(() => {
  getFeedbackList()
})
</script>

<template>
  <div class="feedback-container">
    <a-card title="问题反馈管理" :bordered="false">
      <!-- 搜索区域 -->
      <a-form layout="inline" class="search-form">
        <a-form-item label="状态">
          <a-select
            v-model:value="queryParams.status"
            placeholder="请选择状态"
            style="width: 120px"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="0">未处理</a-select-option>
            <a-select-option value="1">已处理</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 表格 -->
      <a-table
        :columns="columns"
        :data-source="feedbackList"
        :pagination="{
          current: queryParams.current,
          pageSize: queryParams.pageSize,
          total: pagination.total,
          onChange: handlePageChange,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`
        }"
        :row-key="(record: FeedBackVO) => record.id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === '0' ? 'orange' : 'green'">
              {{ record.status === '0' ? '未处理' : '已处理' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record)">详情</a>
              <a-divider type="vertical" />
              <a v-if="record.status === '0'" @click="handleFeedback(record.id)">处理</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确定要删除这条反馈吗？"
                @confirm="handleDelete(record.id)"
                ok-text="确定"
                cancel-text="取消"
              >
                <a class="danger-link">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 详情弹窗 -->
    <a-modal v-model:open="detailVisible" title="反馈详情" :footer="null" width="800px">
      <template v-if="currentFeedback">
        <a-descriptions bordered :column="1" size="large" class="feedback-detail">
          <a-descriptions-item label="标题">
            {{ currentFeedback.title }}
          </a-descriptions-item>
          <a-descriptions-item label="反馈内容" class="content-item">
            <div class="content-wrapper">
              {{ currentFeedback.content }}
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="真实姓名">
            {{ currentFeedback.fullName }}
          </a-descriptions-item>
          <a-descriptions-item label="联系电话">
            {{ currentFeedback.phoneNumber }}
          </a-descriptions-item>
          <a-descriptions-item label="提交时间">
            {{ new Date(currentFeedback.createTime).toLocaleString() }}
          </a-descriptions-item>
          <a-descriptions-item label="更新时间">
            {{ new Date(currentFeedback.updateTime).toLocaleString() }}
          </a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-tag :color="currentFeedback.status === '0' ? 'orange' : 'green'" class="status-tag">
              {{ currentFeedback.status === '0' ? '未处理' : '已处理' }}
            </a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="scss">
.feedback-container {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);

  .search-form {
    margin-bottom: 16px;
  }

  .danger-link {
    color: #ff4d4f;
    &:hover {
      color: #ff7875;
    }
  }

  :deep(.ant-card-head) {
    border-bottom: none;
  }

  :deep(.ant-table-wrapper) {
    background: #fff;

    .ant-table-thead > tr > th {
      background: #fafafa;
    }
  }

  :deep(.ant-descriptions) {
    background: #fff;

    .ant-descriptions-item-label {
      width: 100px;
      background: #fafafa;
    }
  }
}

.feedback-detail {
  :deep(.ant-descriptions-item) {
    padding: 20px 24px;

    .ant-descriptions-item-label {
      width: 120px;
      color: #666;
      font-weight: 500;
      background: #fafafa;
    }

    .ant-descriptions-item-content {
      color: #333;
      line-height: 1.8;
    }
  }

  .content-item {
    :deep(.ant-descriptions-item-content) {
      min-height: 100px;
    }

    .content-wrapper {
      white-space: pre-wrap;
      word-break: break-all;
    }
  }

  .status-tag {
    font-size: 14px;
    padding: 4px 12px;
  }
}

:deep(.ant-modal-content) {
  padding: 24px;

  .ant-modal-header {
    margin-bottom: 24px;

    .ant-modal-title {
      font-size: 16px;
      font-weight: 500;
    }
  }

  .ant-modal-body {
    padding: 0;
  }
}
</style>
