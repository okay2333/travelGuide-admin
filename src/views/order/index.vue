<template>
  <div class="container">
    <div class="right">
      <div class="right_button">
        <a-flex gap="small" justify="flex-end">
          <a-button type="primary" @click="showModal">添加订单</a-button>
          <a-button>Excel导出</a-button>
          <a-button type="dashed">Excel导入</a-button>
        </a-flex>
      </div>
      <!-- 右表结构 -->
      <div>
        <a-table :columns="columns" :data-source="orderDataForm" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'orderId'">
              <span>{{ record.id }}</span>
            </template>
            <template v-if="column.key === 'userName'">
              <span>{{ record.userVO.userName }}</span>
            </template>
            <template v-if="column.key === 'scenicName'">
              <span>{{ record.ticketVO.scenicVO.scenicName }}</span>
            </template>
            <template v-if="column.key === 'purchaseDate'">
              <span>{{
                new Date(record.purchaseDate).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })
              }}</span>
            </template>
            <template v-if="column.key === 'quantity'">
              <span>{{ record.quantity }}</span>
            </template>
            <template v-if="column.key === 'totalPrice'">
              <span>{{ record.totalPrice }}</span>
            </template>
            <template v-else-if="column.key === 'action'">
              <span>
                <a @click="editOrder(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm
                  title="你确定要删除这个订单吗?"
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

  <!-- 新增/编辑订单弹窗 -->
  <a-modal
    :title="isEditMode ? '编辑订单' : '新增订单'"
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
          <a-form-item label="选择用户">
            <a-select v-model:value="newOrder.userId" placeholder="请选择用户">
              <a-select-option v-for="user in userList" :key="user.id" :value="user.id">
                {{ user.userName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="选择门票">
            <a-select v-model:value="newOrder.ticketId" placeholder="请选择门票">
              <a-select-option v-for="ticket in ticketList" :key="ticket.id" :value="ticket.id">
                {{ ticket.scenicVO.scenicName }} （{{ ticket.openDateTime }}）
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="购买数量">
            <a-input-number v-model:value="newOrder.quantity" :min="1" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="总价格">
            <a-input-number v-model:value="newOrder.totalPrice" :min="0" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listOrdersVOByPage, addOrder, deleteOrder, updateOrder } from '@/api/order'
import { listUserByPage } from '@/api/user'
import { listTicketByPage } from '@/api/ticket'
import { message } from 'ant-design-vue'
import moment from 'moment'

// 表格结构
const columns = [
  {
    title: '订单号',
    dataIndex: 'orderId',
    key: 'orderId'
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '景区名',
    dataIndex: 'scenicName',
    key: 'scenicName'
  },
  {
    title: '购买日期',
    key: 'purchaseDate',
    dataIndex: 'purchaseDate'
  },
  {
    title: '购买数量',
    key: 'quantity',
    dataIndex: 'quantity'
  },
  {
    title: '总价格',
    key: 'totalPrice',
    dataIndex: 'totalPrice'
  },
  {
    title: '操作',
    key: 'action'
  }
]

const orderDataForm = ref<any>([])
// 分页
const current = ref(1)
const pageSize = ref(5)
const total = ref()

const queryParams = ref({
  current: current.value,
  pageSize: pageSize.value
})

const init = async () => {
  const res = await listOrdersVOByPage(queryParams.value)
  orderDataForm.value = res.records
  total.value = Number(res.total)
  current.value = Number(res.current)
  // 用户列表
  const res2 = await listUserByPage({ current: 1, pageSize: 1000 })
  userList.value = res2.records
  console.log('用户列表', res2)
  // 门票列表
  const res3 = await listTicketByPage({ current: 1, pageSize: 1000 })
  ticketList.value = res3.records
  console.log('门票列表', res3)
}

onMounted(() => {
  init()
})

// 分页
const handlePageChange = async (currentPage: number) => {
  queryParams.value.current = currentPage
  current.value = currentPage
  const res = await listOrdersVOByPage(queryParams.value)
  orderDataForm.value = res.records
}

// 控制弹窗显示的状态变量
const isModalVisible = ref(false)
const isEditMode = ref(false)

const showModal = () => {
  newOrder.value = {
    userId: '',
    ticketId: '',
    quantity: 1,
    totalPrice: 0
  }
  isEditMode.value = false
  isModalVisible.value = true
}

const editOrder = (record: any) => {
  newOrder.value = {
    id: record.id,
    userId: record.userId,
    ticketId: record.ticketId,
    quantity: record.quantity,
    totalPrice: record.totalPrice
  }
  isEditMode.value = true
  isModalVisible.value = true
}

const handleOk = async () => {
  isModalVisible.value = false
  if (isEditMode.value) {
    // 处理编辑订单的逻辑
    const res = await updateOrder(newOrder.value)
    console.log(res)
    message.success('订单修改成功')
  } else {
    // 处理新增订单的逻辑
    const res = await addOrder(newOrder.value)
    console.log(res)
    message.success('订单添加成功')
  }
  init() // 重新加载数据
}

const handleCancel = () => {
  isModalVisible.value = false
}

const confirmDel = async (orderId: string) => {
  const res = await deleteOrder({ id: orderId })
  console.log(res)
  message.success('订单删除成功')
  init() // 重新加载数据
}

const newOrder = ref<any>({
  id: '',
  userId: '',
  ticketId: '',
  quantity: 1,
  totalPrice: 0
})

interface User {
  id: string
  userName: string
}

interface Ticket {
  id: string
  scenicVO: {
    scenicName: string
  }
}

const userList = ref<User[]>([])
const ticketList = ref<Ticket[]>([])
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
