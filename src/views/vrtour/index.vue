<template>
  <div class="container">
    <div class="right">
      <div class="right_button">
        <a-flex gap="small" justify="flex-end">
          <a-button type="primary" @click="showModal">添加VR旅游</a-button>
          <a-button>Excel导出</a-button>
          <a-button type="dashed">Excel导入</a-button>
        </a-flex>
      </div>
      <div>
        <a-table :columns="columns" :data-source="vrTourDataForm" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'cover'">
              <img :src="record.cover" alt="封面" style="width: 50px; height: 50px" />
            </template>
            <template v-if="column.key === 'picture'">
              <img :src="record.picture" alt="图片" style="width: 50px; height: 50px" />
            </template>
            <template v-if="column.key === 'name'">
              <span>{{ record.name }}</span>
            </template>
            <template v-if="column.key === 'location'">
              <span>{{ record.location }}</span>
            </template>
            <template v-else-if="column.key === 'action'">
              <span>
                <a @click="editVRTour(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm
                  title="你确定要删除这个VR旅游吗?"
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

  <!-- 新增/编辑VR旅游弹窗 -->
  <a-modal
    :title="isEditMode ? '编辑VR旅游' : '新增VR旅游'"
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
          <a-form-item label="封面">
            <!-- 放置上传图片 -->
            <a-upload
              action="http://localhost:8101/api/file/upload"
              @change="handleCoverChange"
              list-type="picture-card"
              :max-count="1"
              v-model:file-list="fileCoverList"
            >
              <div>
                <PlusOutlined />
                <div style="margin-top: 8px">Upload</div>
              </div>
            </a-upload>
            <!-- 放置上传图片 -->
          </a-form-item>
          <a-form-item label="图片">
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
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="名称">
            <a-input v-model:value="newVRTour.name" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="位置">
            <a-input v-model:value="newVRTour.location" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listVRTourByPage, addVRTour, deleteVRTour, updateVRTour } from '@/api/vrtour'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'

// 表格结构
const columns = [
  {
    title: '封面',
    dataIndex: 'cover',
    key: 'cover'
  },
  {
    title: '图片',
    dataIndex: 'picture',
    key: 'picture'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location'
  },
  {
    title: '操作',
    key: 'action'
  }
]

const vrTourDataForm = ref<any>([])
// 分页
const current = ref(1)
const pageSize = ref(5)
const total = ref()

const queryParams = ref({
  current: current.value,
  pageSize: pageSize.value
})

const init = async () => {
  const res = await listVRTourByPage(queryParams.value)
  vrTourDataForm.value = res.records
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
  const res = await listVRTourByPage(queryParams.value)
  vrTourDataForm.value = res.records
}

// 控制弹窗显示的状态变量
const isModalVisible = ref(false)
const isEditMode = ref(false)
const fileCoverList = ref<{ url: string }[]>([]) // 封面上传列表
const fileList = ref<{ url: string }[]>([]) // 图片上传列表

const showModal = () => {
  newVRTour.value = {
    cover: '',
    picture: '',
    name: '',
    location: ''
  }
  fileList.value = []
  fileCoverList.value = []
  isEditMode.value = false
  isModalVisible.value = true
}

const editVRTour = (record: any) => {
  newVRTour.value = {
    id: record.id,
    cover: record.cover,
    picture: record.picture,
    name: record.name,
    location: record.location
  }
  fileList.value = [{ url: record.picture }]
  fileCoverList.value = [{ url: record.cover }]
  isEditMode.value = true
  isModalVisible.value = true
}

const handleOk = async () => {
  isModalVisible.value = false
  if (isEditMode.value) {
    // 处理编辑VR旅游的逻辑
    const res = await updateVRTour(newVRTour.value)
    console.log(res)
    message.success('VR旅游修改成功')
  } else {
    // 处理新增VR旅游的逻辑
    const res = await addVRTour(newVRTour.value)
    console.log(res)
    message.success('VR旅游添加成功')
  }
  init() // 重新加载数据
}

const handleCancel = () => {
  isModalVisible.value = false
}

const confirmDel = async (vrTourId: string) => {
  const res = await deleteVRTour({ id: vrTourId })
  console.log(res)
  message.success('VR旅游删除成功')
  init() // 重新加载数据
}

const newVRTour = ref<any>({
  id: '',
  columns: '',
  picture: '',
  name: '',
  location: ''
})

// 图片上传
const handleCoverChange = (info: any) => {
  console.log('info', info)

  if (info.file.status === 'done') {
    newVRTour.value.cover = info.fileList[0].response.data
    message.success(`${info.file.name} 文件上传成功`)
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 文件上传失败`)
  }
}

// 图片上传
const handleChange = (info: any) => {
  if (info.file.status === 'done') {
    newVRTour.value.picture = info.fileList[0].response.data
    message.success(`${info.file.name} 文件上传成功`)
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 文件上传失败`)
  }
}
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
