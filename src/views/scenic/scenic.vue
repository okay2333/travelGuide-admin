<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  listScenicVOByPage,
  getScenicVOById,
  addScenic,
  updateScenic,
  deleteScenic
} from '@/api/scenic'
import { message } from 'ant-design-vue'

// 表格结构
const columns = [
  {
    title: '预览图',
    dataIndex: 'carouselImagesList',
    key: 'carouselImagesList'
  },
  {
    title: '景区名',
    dataIndex: 'scenicName',
    key: 'scenicName'
  },
  {
    title: '详情',
    dataIndex: 'details',
    key: 'details'
  },
  {
    title: '标签',
    dataIndex: 'tagList',
    key: 'tagList'
  },
  {
    title: '联系电话',
    dataIndex: 'contactNumber',
    key: 'contactNumber'
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '开放时间',
    dataIndex: 'openingHours',
    key: 'openingHours'
  },
  {
    title: '购票类型',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '操作',
    key: 'action'
  }
]

const ScenicForm = ref<any>([])

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
  const res = await listScenicVOByPage(queryParams.value)
  console.log(res)
  total.value = Number(res.total)
  current.value = Number(res.current)
  ScenicForm.value = res.records
}

const onSearchScenic = async () => {
  const res = await listScenicVOByPage(queryParams.value)
  ScenicForm.value = res.records
}

const handlePageChange = async (currentPage: number) => {
  queryParams.value.current = currentPage
  current.value = currentPage
  const res = await listScenicVOByPage(queryParams.value)
  ScenicForm.value = res.records
}

// 控制弹窗显示的状态变量
const isModalVisible = ref(false)
const isEditMode = ref(false)

const fileList = ref<{ url: string }[]>([]) // 头像上传列表

const showModal = async (id?: number) => {
  if (id) {
    const res = await getScenicVOById(id)
    scenicDetail.value = res
    fileList.value = res.carouselImagesList.map((item: string) => {
      return { url: item }
    })
    isEditMode.value = true
  } else {
    scenicDetail.value = {
      scenicName: '',
      details: '',
      tagList: [],
      contactNumber: '',
      address: '',
      openingHours: '',
      type: 0,
      carouselImagesList: []
    }
    fileList.value = []
    isEditMode.value = false
  }
  isModalVisible.value = true
}

const inputValue = ref('')

const addTag = () => {
  if (inputValue.value && !scenicDetail.value.tagList.includes(inputValue.value)) {
    scenicDetail.value.tagList.push(inputValue.value)
  }
  inputValue.value = ''
}

// 弹窗数据
const scenicDetail = ref<any>()

const handleOk = async () => {
  isModalVisible.value = false
  if (isEditMode.value) {
    // 处理编辑景区的逻辑
    await updateScenic(scenicDetail.value)
    message.success('景区更新成功')
  } else {
    // 处理新增景区的逻辑
    await addScenic(scenicDetail.value)
    message.success('景区添加成功')
  }
  init() // 重新加载数据
}

const handleCancel = () => {
  isModalVisible.value = false
}

const confirmDel = async (scenicId: number) => {
  await deleteScenic({ id: scenicId })
  message.success('景区删除成功')
  init() // 重新加载数据
}

onMounted(() => {
  init()
})
// 图片上传
const handleChange = (info: any) => {
  console.log('这是多少@@', info)
  if (info.file.status === 'done') {
    console.log('这是多少', info.fileList)
    // 遍历info.fileList的所有值，将每个值的response.data存入userInfo.value.userAvatar
    // 遍历 info.fileList 的所有值，将每个值的 response.data 存入 scenicDetail.value.carouselImagesList
    // userInfo.value.userAvatar = info.fileList[0].response.data
    scenicDetail.value.carouselImagesList = info.fileList.map((item: any) => item.response.data)
    message.success(`${info.file.name} 文件上传成功`)
    console.log('这是多少carouselImagesList', scenicDetail.value.carouselImagesList)
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 文件上传失败`)
  }
}
</script>

<template>
  <div class="container">
    <div style="width: 100%">
      <div>
        <a-input-search
          placeholder="输入景区名称全局搜索"
          enter-button
          v-model:value="queryParams.title"
          style="width: 18%; padding: 5px 0; float: right"
          @search="onSearchScenic"
        />
        <a-button type="primary" @click="showModal()">添加景区</a-button>
      </div>

      <a-table :columns="columns" :data-source="ScenicForm" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'carouselImagesList'">
            <img :src="record.carouselImagesList[0]" alt="" style="width: 50px; height: 50px" />
          </template>
          <template v-if="column.key === 'tagList'">
            <a-tag color="pink" v-for="item in record.tagList">{{ item }}</a-tag>
          </template>

          <template v-if="column.key === 'details'">
            <span>{{ record.details.slice(0, 10) }}...</span>
          </template>

          <template v-if="column.key === 'type'">
            <span>{{ record.type ? '预约' : '购票' }}</span>
          </template>

          <template v-else-if="column.key === 'action'">
            <span>
              <a @click="showModal(record.id)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="你确定要删除这个景区吗?"
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

  <a-modal
    v-model:open="isModalVisible"
    :title="isEditMode ? '编辑景区' : '新增景区'"
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
          <a-form-item label="景区图片" name="avatar">
            <!-- 放置上传图片 -->
            <a-upload
              action="http://localhost:8101/api/file/upload"
              @change="handleChange"
              list-type="picture-card"
              :key="scenicDetail.carouselImagesList"
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
          <a-form-item label="景区名">
            <a-input v-model:value="scenicDetail.scenicName" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="详情">
            <a-textarea v-model:value="scenicDetail.details" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="标签">
            <!-- <a-input v-model:value="scenicDetail.tagList" /> -->
            <a-input
              v-model:value="inputValue"
              @keyup.enter="addTag"
              placeholder="输入标签并按回车"
            />
            <a-tag
              style="margin-top: 10px"
              v-for="(tag, index) in scenicDetail.tagList"
              :key="index"
              closable
              @close="scenicDetail.tagList.splice(index, 0)"
            >
              {{ tag }}
            </a-tag>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="联系电话">
            <a-input v-model:value="scenicDetail.contactNumber" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="地址">
            <a-input v-model:value="scenicDetail.address" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="开放时间">
            <a-input v-model:value="scenicDetail.openingHours" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="购票类型">
            <a-select v-model:value="scenicDetail.type">
              <a-select-option :value="0">购票</a-select-option>
              <a-select-option :value="1">预约</a-select-option>
            </a-select>
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
