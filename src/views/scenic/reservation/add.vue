<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { getUserById as getUserByIdApi, updateUser as updateUserApi } from '@/api/user'

const route = useRoute()

const fileList = ref<{ url: string }[]>([]) // 头像上传列表
const getUserById = async (id: any) => {
  const res = await getUserByIdApi(id)
  userInfo.value = res
  fileList.value = [{ url: res.userAvatar }]
}

onMounted(() => {
  route.params.id && getUserById(route.params.id)
})

const scenicList = ref([
  { id: 1, name: '景区A' },
  { id: 2, name: '景区B' },
  { id: 3, name: '景区C' }
])
const userInfo = ref({
  value: {
    scenicId: '',
    date: '',
    stock: 0
  }
})
</script>
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <a-form @submit="onSubmitUser" class="edit-form">
        <a-form-item label="选择景区">
          <a-select v-model:value="userInfo.value.scenicId" placeholder="请选择景区">
            <!-- 假设景区列表是从接口获取的 -->
            <a-select-option v-for="scenic in scenicList" :key="scenic.id" :value="scenic.id">
              {{ scenic.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择日期">
          <a-date-picker v-model:value="userInfo.value.date" style="width: 100%" />
        </a-form-item>
        <a-form-item label="预约库存数量">
          <a-input-number v-model:value="userInfo.value.stock" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
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
