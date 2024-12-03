<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { getUserById as getUserByIdApi, updateUser as updateUserApi } from '@/api/user'

const route = useRoute()
const userInfo = ref<any>({})

const fileList = ref<{ url: string }[]>([]) // 头像上传列表
const getUserById = async (id: any) => {
  const res = await getUserByIdApi(id)
  userInfo.value = res
  fileList.value = [{ url: res.userAvatar }]
}

// TODO 部署时修改为真实接口地址
const handleChange = (info: any) => {
  if (info.file.status === 'done') {
    userInfo.value.userAvatar = info.fileList[0].response.data
    message.success(`${info.file.name} 文件上传成功`)
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 文件上传失败`)
  }
}

const onSubmitUser = async () => {
  const res = await updateUserApi(userInfo.value)
  console.log(res)
}

const formattedUpdateTime = computed(() => {
  return new Date(userInfo.value.updateTime).toLocaleString()
})

onMounted(() => {
  route.params.id && getUserById(route.params.id)
})
</script>
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <a-form :model="userInfo" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
          <!-- 姓名 -->
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="用户ID" name="id">
                <a-input size="small" v-model:value="userInfo.id" disabled />
              </a-form-item>
            </a-col>
          </a-row>
          <!-- 姓名 -->
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="用户名" name="userName">
                <a-input size="small" v-model:value="userInfo.userName" />
              </a-form-item>
            </a-col>
          </a-row>
          <!-- 工号 -->
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="账号" name="userAccount">
                <a-input size="small" v-model:value="userInfo.userAccount" />
              </a-form-item>
            </a-col>
          </a-row>

          <!-- 角色 -->
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="角色" name="userRole">
                <a-select v-model:value="userInfo.userRole" size="small">
                  <a-select-option value="admin">管理员</a-select-option>
                  <a-select-option value="user">普通用户</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <!-- 入职时间 -->
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="创建时间" name="createTime">
                <a-input v-model:value="formattedUpdateTime" disabled />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="个人简介">
                <a-textarea :rows="4" v-model:value="userInfo.userProfile" />
              </a-form-item>
            </a-col>
          </a-row>
          <!-- 员工照片 -->
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="员工头像" name="avatar">
                <!-- 放置上传图片 -->
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
          <!-- 保存个人信息 -->
          <a-row type="flex">
            <a-col :span="12" style="margin-left: 220px">
              <a-button type="primary" size="small" @click="onSubmitUser">保存更新</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-form {
  background: #fff;
  padding: 20px;
}

.edit-form .ant-input,
.edit-form .ant-select,
.edit-form .ant-picker {
  width: 380px;
}
</style>
