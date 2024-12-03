<template>
  <div class="container">
    <div class="right">
      <div class="right_button">
        <a-flex gap="small" justify="flex-end">
          <a-button type="primary" @click="showModal">添加门票</a-button>
          <a-button>Excel导出</a-button>
          <a-button type="dashed">Excel导入</a-button>
        </a-flex>
      </div>
      <div>
        <a-table :columns="columns" :data-source="ticketDataForm" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'scenicName'">
              <span>{{ record.scenicVO.scenicName }}</span>
            </template>
            <template v-if="column.key === 'openingHours'">
              <span>{{ record.scenicVO.openingHours }}</span>
            </template>
            <template v-if="column.key === 'contactNumber'">
              <span>{{ record.scenicVO.contactNumber }}</span>
            </template>
            <template v-if="column.key === 'openDateTime'">
              <span>{{ record.openDateTime }}</span>
            </template>
            <template v-if="column.key === 'stock'">
              <span>{{ record.stock }}</span>
            </template>
            <template v-if="column.key === 'price'">
              <span>{{ record.price }}</span>
            </template>
            <template v-else-if="column.key === 'action'">
              <span>
                <a @click="editTicket(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm
                  title="你确定要删除这张门票吗?"
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
  </div>

  <!-- 新增/编辑门票弹窗 -->
  <a-modal
    :title="isEditMode ? '编辑门票' : '新增门票'"
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
            <a-select v-model:value="newTicket.scenicId" placeholder="请选择景区">
              <a-select-option v-for="scenic in scenicList" :key="scenic.id" :value="scenic.id">
                {{ scenic.scenicName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="选择景区">
            <a-select v-model:value="newTicket.scenicId" placeholder="请选择景区">
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
          <a-form-item label="库存数量">
            <a-input-number v-model:value="newTicket.stock" :min="0" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="价格">
            <a-input-number v-model:value="newTicket.price" :min="0" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listTicketByPage, addTicket, deleteTicket, updateTicket } from '@/api/ticket'
import { listScenicVOByPage } from '@/api/scenic'
import { message } from 'ant-design-vue'
import moment from 'moment'

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
    title: '价格',
    key: 'price',
    dataIndex: 'price'
  },
  {
    title: '操作',
    key: 'action'
  }
]

const ticketDataForm = ref<any>([])
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
  const res = await listTicketByPage(queryParams.value)
  ticketDataForm.value = res.records
  total.value = Number(res.total)
  current.value = Number(res.current)
  // 景区列表
  const res2 = await listScenicVOByPage({ current: 1, pageSize: 100, type: 0 })
  scenicList.value = res2.records
  console.log('景区列表', res2)
}

onMounted(() => {
  init()
})

// 分页
const handlePageChange = async (currentPage: number) => {
  queryParams.value.current = currentPage
  current.value = currentPage
  const res = await listTicketByPage(queryParams.value)
  ticketDataForm.value = res.records
}

// 控制弹窗显示的状态变量
const isModalVisible = ref(false)
const isEditMode = ref(false)

const showModal = () => {
  newTicket.value = {
    scenicId: '',
    openDateTime: '',
    stock: 0,
    price: 0
  }
  selectedDate.value = null
  isEditMode.value = false
  isModalVisible.value = true
}

const editTicket = (record: any) => {
  newTicket.value = {
    id: record.id,
    scenicId: record.scenicId,
    openDateTime: record.openDateTime,
    stock: record.stock,
    price: record.price
  }
  selectedDate.value = moment(record.openDateTime)
  isEditMode.value = true
  isModalVisible.value = true
}

const handleOk = async () => {
  isModalVisible.value = false
  if (isEditMode.value) {
    // 处理编辑门票的逻辑
    const res = await updateTicket(newTicket.value)
    console.log(res)
    message.success('订单修改成功')
  } else {
    // 处理新增门票的逻辑
    const res = await addTicket(newTicket.value)
    console.log(res)
    message.success('订单添加成功')
  }
  init() // 重新加载数据
}

const handleCancel = () => {
  isModalVisible.value = false
}

const confirmDel = async (ticketId: string) => {
  const res = await deleteTicket({ id: ticketId })
  console.log(res)
  message.success('订单删除成功')
  init() // 重新加载数据
}

const newTicket = ref({
  id: '',
  scenicId: '',
  openDateTime: '',
  stock: 0,
  price: 0
})

interface Scenic {
  id: string
  scenicName: string
  contactNumber: string
  openingHours: string
}

const scenicList = ref<Scenic[]>([])

const handleDateChange = (date: any) => {
  newTicket.value.openDateTime = moment(date).format('YYYY-MM-DD')
  console.log('时间格式', newTicket.value.openDateTime)
}

// 日期格式化
const selectedDate = ref(null)
</script>

<style lang="scss" scoped>
.container {
  padding: 10px;
  min-height: calc(100vh - 65px);
  display: flex;
  .right {
    flex: 1;
    .right_button {
      margin: 5px;
    }
  }
}
</style>
