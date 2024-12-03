<template>
  <div class="login-container">
    <a-card class="login-card" :title="$t('msg.login.title')" bordered="false">
      <a-form :model="loginForm" :rules="rules" layout="vertical">
        <!-- 用户名输入框 -->
        <a-form-item
          label="账号"
          name="userAccount"
          :rules="[{ required: true, message: '账号不能为空' }]"
        >
          <a-input v-model:value="loginForm.userAccount" placeholder="请输入账号" />
        </a-form-item>

        <!-- 密码输入框 -->
        <a-form-item
          label="密码"
          name="userPassword"
          :rules="[{ required: true, message: '密码不能为空' }]"
        >
          <a-input-password v-model:value="loginForm.userPassword" placeholder="请输入密码" />
        </a-form-item>

        <!-- 登录按钮 -->
        <a-form-item>
          <a-button type="primary" html-type="submit" block @click="onLogin" :loading="loading">
            登录
          </a-button>
        </a-form-item>
        <langSelect />
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

import langSelect from '@/components/langSelect.vue'

interface UserState {
  userAccount: string
  userPassword: string
}
const userStore = useUserStore()
const router = useRouter()
// 登录表单的状态
const loginForm = reactive<UserState>({
  userAccount: 'admin',
  userPassword: '12345678'
})

const rules = ref({
  userAccount: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  userPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const loading = ref(false)

// 登录按钮点击事件
const onLogin = async () => {
  if (!loginForm.userAccount || !loginForm.userPassword) {
    message.error('Please complete the form.')
    return
  }

  loading.value = true
  await userStore.login(loginForm)
  router.push('/')
  message.success('登录成功')
  loading.value = false
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
}

.login-card {
  width: 350px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

a-button {
  background: #1890ff;
  color: #fff;
  border: none;
}

a-button:hover {
  background: #40a9ff;
  color: #fff;
}

a-input {
  border-radius: 4px;
}

a-input-userPassword {
  border-radius: 4px;
}
</style>
