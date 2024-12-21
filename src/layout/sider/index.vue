<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const selectedKeys = ref<string[]>(['/'])
const openKeys = ref<string[]>(['1'])
const selectMenuItem = (item: any) => {}

import { filterRouters, generateMenus } from '@/utils/route'
const routes = computed(() => {
  return generateMenus(filterRouters(router.getRoutes()))
})
</script>

<template>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    v-model:openKeys="openKeys"
    theme="dark"
    mode="inline"
    @click="selectMenuItem"
  >
    <div class="logo" />
    <template v-for="(item, index) in routes">
      <template v-if="item.children.length === 0">
        <a-menu-item :key="item.path">
          <template #icon>
            <component :is="item.meta?.icon" />
          </template>
          {{ item.meta.title }}
          <router-link :to="item.path"> </router-link>
        </a-menu-item>
      </template>

      <template v-else>
        <a-sub-menu :key="item.path">
          <template #icon>
            <component :is="item.meta?.icon" />
          </template>
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
          <template v-for="(child, index) in item.children" :key="child.path">
            <a-menu-item>
              <template #icon>
                <component :is="child.meta?.icon" />
              </template>
              <span>{{ child.meta.title }}</span>
              <router-link :to="child.path"></router-link>
            </a-menu-item>
          </template>
        </a-sub-menu>
      </template>
    </template>
  </a-menu>
</template>

<style scoped>
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

:deep(.ant-menu-item),
:deep(.ant-menu-submenu-title) {
  display: flex;
  align-items: center;
}

:deep(.anticon) {
  font-size: 16px;
}
</style>
