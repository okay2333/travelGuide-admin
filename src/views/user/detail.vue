<template>
  <div class="user-detail-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户详情</span>
          <el-button link @click="goBack">返回</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">
          {{ userInfo.username }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ userInfo.email }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ userInfo.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ formatDateTime(userInfo.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="最后登录时间">
          {{ formatDateTime(userInfo.lastLoginTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="userInfo.status === 1 ? 'success' : 'danger'">
            {{ userInfo.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDateTime } from '@/utils/date'

const route = useRoute()
const router = useRouter()
const userInfo = ref({})

// 获取用户详情
const getUserDetail = async () => {
  try {
    const res = await getUserDetailAPI(route.params.id)
    userInfo.value = res.data
  } catch (error) {
    console.error(error)
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

onMounted(() => {
  getUserDetail()
})
</script>

<style lang="scss" scoped>
.user-detail-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
