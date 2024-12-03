<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listUserByPage } from '@/api/user'
// 表格结构
const columns = [
  {
    title: '头像',
    dataIndex: 'userAvatar',
    key: 'userAvatar'
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    key: 'userAccount'
  },
  {
    title: '角色',
    key: 'userRole',
    dataIndex: 'userRole'
  },
  {
    title: '用户简介',
    key: 'userProfile',
    dataIndex: 'userProfile'
  },

  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime'
  },
  {
    title: '操作',
    key: 'action'
  }
]
const UserForm = ref<UserState>()

interface UserState {
  userAvatar: string
  userName: string
  userAccount: string
  userRole: string
  userProfile: string
  createTime: string
}

const init = async () => {
  const res = await listUserByPage(queryParams)
  total.value = Number(res.total)
  current.value = Number(res.current)
  UserForm.value = res.records
}
// 分页
const current = ref(1)
const pageSize = ref(10)
const total = ref()

const queryParams = ref({
  current: current.value,
  pageSize: pageSize.value,
  userName: '' // 模糊搜索字段
})
const onSearchUser = async () => {
  console.log('搜索')
  console.log('queryParams.value', queryParams.value)
  const res = await listUserByPage(queryParams.value)
  console.log('搜索结果', res)

  UserForm.value = res.records
}
const handlePageChange = async (currentPage: number) => {
  queryParams.value.current = currentPage
  current.value = currentPage
  const res = await listUserByPage(queryParams.value)
  UserForm.value = res.records
}
// 控制弹窗显示的状态变量
const isModalVisible = ref(false)
const showModal = () => {
  isModalVisible.value = true
}
const handleOk = () => {
  isModalVisible.value = false
  // 处理新增用户的逻辑
}
const handleCancel = () => {
  isModalVisible.value = false
}

const newUser = ref({
  userName: '',
  userAccount: '',
  userRole: '',
  userProfile: ''
})
onMounted(() => {
  init()
})
</script>
<template>
  <div class="container">
    <div style="width: 100%">
      <div>
        <a-button type="primary" @click="showModal" style="margin-bottom: 10px">新增用户</a-button>
        <a-input-search
          placeholder="输入员工姓名全员搜索"
          enter-button
          v-model:value="queryParams.userName"
          style="width: 18%; padding: 5px 0; float: right"
          @search="onSearchUser"
        />
      </div>

      <a-table :columns="columns" :data-source="UserForm" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'userAvatar'">
            <template v-if="record.userAvatar"
              ><a-avatar :src="record.userAvatar"> </a-avatar
            ></template>
            <template v-else-if="!record.userAvatar"
              ><a-avatar>{{ record.userName.charAt(0) }} </a-avatar></template
            >
          </template>

          <template v-if="column.key === 'createTime'">
            <span>{{ new Date(record.createTime).toLocaleString() }}</span>
          </template>

          <template v-else-if="column.key === 'action'">
            <span>
              <a @click="$router.push(`/user/detail/${record.id}`)">查看</a>
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
  <!-- 新增用户弹窗 -->
  <a-modal title="新增用户" v-model:open="isModalVisible" @ok="handleOk" @cancel="handleCancel">
    <a-form
      layout="horizontal"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      style="margin: 50px 0 0 50px"
    >
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="用户名">
            <a-input v-model:value="newUser.userName" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="账号">
            <a-input v-model:value="newUser.userAccount" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="角色">
            <a-input v-model:value="newUser.userRole" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="用户简介">
            <a-textarea v-model:value="newUser.userProfile" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<style scoped lang="scss">
.container {
  padding: 10px;
  min-height: calc(100vh - 65px);
  display: flex;
}
</style>
