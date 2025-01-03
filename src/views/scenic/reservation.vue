<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  listOpenDateTime,
  listReservationsVOByPage,
  addReservations,
  updateReservations,
  deleteReservations
} from '@/api/reservations'
import { listScenicVOByPage } from '@/api/scenic'
import { buildTreeData } from '@/utils'
import { message } from 'ant-design-vue'
import moment from 'moment'
import { PlusOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons-vue'

// 表格结构
const columns = [
  {
    title: '景区名',
    dataIndex: 'scenicName',
    key: 'scenicName'
  },
  {
    title: '开放时间',
    dataIndex: 'openingHours',
    key: 'openingHours'
  },
  {
    title: '联系电话',
    dataIndex: 'contactNumber',
    key: 'contactNumber'
  },
  {
    title: '开放日期',
    key: 'openDateTime',
    dataIndex: 'openDateTime'
  },
  {
    title: '库存数',
    key: 'stock',
    dataIndex: 'stock'
  },
  {
    title: '操作',
    key: 'action'
  }
]

const treeData = ref<any>([])
const ReservationDataForm = ref<any>([])
// 分页
const current = ref(1)
const pageSize = ref(5)
const total = ref()

const queryParams = ref({
  current: current.value,
  pageSize: pageSize.value,
  openDateTime: ''
})

const init = async () => {
  const res = await listOpenDateTime() // 左树节点
  treeData.value = buildTreeData(res)
  const res1 = await listReservationsVOByPage(queryParams.value)
  ReservationDataForm.value = res1.records
  total.value = Number(res1.total)
  current.value = Number(res1.current)
  // 景区列表
  const res2 = await listScenicVOByPage({ current: 1, pageSize: 100, type: 1 })
  scenicList.value = res2.records
  console.log('景区列表', res2)
}

// 选中左树节点
const selectNode = async (selectedKeys: any) => {
  selectedKeys.value = selectedKeys
  queryParams.value.openDateTime = selectedKeys[0]
  const res = await listReservationsVOByPage(queryParams.value)
  ReservationDataForm.value = res.records
}

// 分页
const handlePageChange = async (currentPage: number) => {
  queryParams.value.current = currentPage
  current.value = currentPage
  const res = await listReservationsVOByPage(queryParams.value)
  ReservationDataForm.value = res.records
}

onMounted(() => {
  init()
})

// 控制弹窗显示的状态变量
const isModalVisible = ref(false)
const isEditMode = ref(false)

const showModal = () => {
  newReservation.value = {
    scenicId: '',
    openDateTime: '',
    stock: 0
  }
  selectedDate.value = null
  isEditMode.value = false
  isModalVisible.value = true
}

// 日期格式化
const selectedDate = ref<string | null>(null)

const editReservation = (record: any) => {
  newReservation.value = {
    id: record.id,
    scenicId: record.scenicId,
    openDateTime: record.openDateTime,
    stock: record.stock
  }
  selectedDate.value = moment(record.openDateTime) // 将 moment 对象转换为 Date 对象
  isEditMode.value = true
  isModalVisible.value = true
}

const handleOk = async () => {
  isModalVisible.value = false
  if (isEditMode.value) {
    // 处理编辑预约的逻辑
    const res = await updateReservations(newReservation.value)
    console.log(res)
    message.success('预约修改成功')
  } else {
    // 处理新增预约的逻辑
    const res = await addReservations(newReservation.value)
    console.log(res)
    message.success('预约添加成功')
  }
  init() // 重新加载数据
}

const handleCancel = () => {
  isModalVisible.value = false
}

const confirmDel = async (reservationId: string) => {
  const res = await deleteReservations({ id: reservationId })
  console.log(res)
  message.success('预约删除成功')
  init() // 重新加载数据
}

const newReservation = ref<any>({
  id: '',
  scenicId: '',
  openDateTime: '',
  stock: 0
})

interface Scenic {
  id: string
  scenicName: string
  contactNumber: string
  openingHours: string
}

const scenicList = ref<Scenic[]>([])

const handleDateChange = (date: any) => {
  console.log('日期', date)

  newReservation.value.openDateTime = moment(date).format('YYYY-MM-DD')
  console.log('时间格式', newReservation.value.openDateTime)
}
</script>

<template>
  <div class="container">
    <!-- 左侧树形结构 -->
    <div class="left-panel">
      <div class="search-box">
        <a-input-search placeholder="输入景区名称搜索" enter-button allowClear />
      </div>
      <!-- 左树结构 -->
      <div class="tree-container">
        <a-tree
          :tree-data="treeData"
          ref="deptTree"
          @select="selectNode"
          :defaultExpandAll="true"
          v-if="treeData.length"
          class="custom-tree"
        >
        </a-tree>
      </div>
    </div>

    <!-- 右侧内容区 -->
    <div class="right-panel">
      <div class="action-bar">
        <a-flex gap="small" justify="flex-end">
          <a-button type="primary" @click="showModal">
            <template #icon><PlusOutlined /></template>
            添加预约
          </a-button>
          <a-button>
            <template #icon><DownloadOutlined /></template>
            Excel导出
          </a-button>
          <a-button type="dashed">
            <template #icon><UploadOutlined /></template>
            Excel导入
          </a-button>
        </a-flex>
      </div>

      <!-- 表格区域 -->
      <div class="table-container">
        <a-table
          :columns="columns"
          :data-source="ReservationDataForm"
          :pagination="false"
          :bordered="true"
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'scenicName'">
              <span>{{ record.scenicVO.scenicName }}</span>
            </template>
            <template v-if="column.key === 'openingHours'">
              <span>{{ record.scenicVO.openingHours }}</span>
            </template>
            <template v-if="column.key === 'openDateTime'">
              <span>{{
                new Date(record.openDateTime).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })
              }}</span>
            </template>
            <template v-if="column.key === 'stock'">
              <span>{{ record.stock }}</span>
            </template>
            <template v-if="column.key === 'contactNumber'">
              <span>{{ record.scenicVO.contactNumber }}</span>
            </template>
            <template v-else-if="column.key === 'action'">
              <span>
                <a @click="editReservation(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm
                  title="你确定要删除这个预约吗?"
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

        <!-- 分页器 -->
        <div class="pagination-wrapper">
          <a-pagination
            :current="current"
            :pageSize="pageSize"
            :total="total"
            @change="handlePageChange"
            :show-total="(total: any) => `共 ${total} 条`"
            show-quick-jumper
            show-size-changer
          />
        </div>
      </div>
    </div>
  </div>

  <!-- 新增/编辑预约弹窗 -->
  <a-modal
    :title="isEditMode ? '编辑预约' : '新增预约'"
    v-model:open="isModalVisible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      layout="horizontal"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      style="margin: 50px 0 0 50px"
    >
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="选择景区">
            <a-select v-model:value="newReservation.scenicId" placeholder="请选择景区">
              <a-select-option v-for="scenic in scenicList" :key="scenic.id" :value="scenic.id">
                {{ scenic.scenicName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="选择日期">
            <a-date-picker
              v-model:value="selectedDate"
              style="width: 100%"
              @change="handleDateChange"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="预约库存数量">
            <a-input-number v-model:value="newReservation.stock" :min="0" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<style lang="scss" scoped>
.container {
  padding: 16px;
  min-height: calc(100vh - 65px);
  display: flex;
  gap: 16px;
  background-color: #f0f2f5;

  .left-panel {
    width: 280px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);

    .search-box {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
    }

    .tree-container {
      padding: 16px;
      height: calc(100vh - 180px);
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 3px;
      }

      .custom-tree {
        :deep(.ant-tree-node-content-wrapper) {
          &:hover {
            background-color: #f5f5f5;
          }
        }

        :deep(.ant-tree-node-selected) {
          background-color: #e6f7ff;
        }
      }
    }
  }

  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);

    .action-bar {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
    }

    .table-container {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;

      :deep(.ant-table-wrapper) {
        flex: 1;

        .ant-table {
          border-radius: 4px;
        }

        .ant-table-thead > tr > th {
          background: #fafafa;
        }
      }

      .pagination-wrapper {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
        padding: 8px 0;
      }
    }
  }
}

// 弹窗样式优化
:deep(.ant-modal) {
  .ant-modal-content {
    padding: 0;

    .ant-modal-header {
      margin-bottom: 0;
      padding: 16px 24px;
      border-bottom: 1px solid #f0f0f0;
    }

    .ant-modal-body {
      padding: 24px;
    }

    .ant-modal-footer {
      margin-top: 0;
      padding: 16px 24px;
      border-top: 1px solid #f0f0f0;
    }
  }
}
</style>
