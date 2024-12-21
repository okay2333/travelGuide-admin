<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { Dayjs } from 'dayjs'
import countTo from '@/components/countTo.vue'
import VisitChart from './components/VisitChart.vue'
import TicketChart from './components/TicketChart.vue'
import SourceChart from './components/SourceChart.vue'
import { listFeedBackByPage } from '@/api/feedback'
import type { FeedBackVO } from '@/api/feedback'

// 用户信息
interface UserType {
  name: string
  avatar: string
  company: string
  depart: string
  position: string
}

const user = ref<UserType>({
  name: '管理员',
  avatar: 'https://www.antdv.com/assets/logo.1ef800a8.svg',
  company: '景区管理系统',
  depart: '管理部',
  position: '系统管理员'
})

// 通知消息
interface NewsType {
  title: string
  content: string
  date: string
}

const newsList = ref<NewsType[]>([
  {
    title: '五一假期景区预约火爆',
    content: '各大景区预约量激增',
    date: '2024-04-28'
  },
  {
    title: '新增景区VR导览功能上线',
    content: '提升游客体验',
    date: '2024-04-25'
  },
  {
    title: '端午节景���活动安排',
    content: '特色活动预告',
    date: '2024-04-20'
  }
])

// 统计数据
const statistics = ref({
  userCount: 12463, // 平台用户数
  reservationCount: 2198, // 预约景区人数
  ticketCount: 1857, // 购票人数
  totalRevenue: 156720 // 总收入（元）
})

// 帮助文档数据
interface GuideType {
  title: string
  sections: {
    name: string
    content: string
  }[]
}

const scenicGuide = ref<GuideType>({
  title: '景区管理指南',
  sections: [
    {
      name: '景区信息管理',
      content: '如何添加和编辑景区基本信息、开放时间、联系方式等'
    },
    {
      name: '门票管理',
      content: '设置门票类型、价格、库存等信息'
    },
    {
      name: 'VR导览管理',
      content: '上传和管理景区VR全景图片和介绍'
    }
  ]
})

const reservationGuide = ref<GuideType>({
  title: '预约管理手册',
  sections: [
    {
      name: '预约规则设置',
      content: '设置每日预约人数上限、提前预约天数等'
    },
    {
      name: '预约订单处理',
      content: '查看和处理游客预约申请、退改等操作'
    },
    {
      name: '数据统计分析',
      content: '查看预约量、到访率等数据报表'
    }
  ]
})

// 控制显示哪个指南
const currentGuide = ref<'scenic' | 'reservation'>('scenic')
const showGuideModal = ref(false)

const showGuide = (type: 'scenic' | 'reservation') => {
  currentGuide.value = type
  showGuideModal.value = true
}

// 最新反馈列表
const latestFeedbacks = ref<FeedBackVO[]>([])

// 获取最新反馈
const getLatestFeedbacks = async () => {
  try {
    const res = await listFeedBackByPage({
      current: 1,
      pageSize: 3,
      status: '0' // 只获取未处理的反馈
    })
    latestFeedbacks.value = res.records
  } catch (error) {
    console.error('获取最新反馈失败:', error)
  }
}

onMounted(() => {
  // ... 其他初始化代码 ...
  getLatestFeedbacks()
})
</script>

<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <!-- 个人信息 -->
        <a-card class="user_info">
          <a-flex>
            <a-avatar shape="square" size="large" :src="user.avatar" />
            <div class="company-info">
              {{ user.company }}
              <div class="depart">
                {{ user.name }}&nbsp;&nbsp;|&nbsp;&nbsp; {{ user.depart }}-{{ user.position }}
              </div>
            </div>
          </a-flex>
          <!-- 数据统计卡片 -->
          <a-flex wrap="wrap">
            <div class="todo_item">
              <span>平台用户数</span>
              <span><countTo :startVal="0" :endVal="statistics.userCount" :duration="2000" /></span>
              <span class="trend"> <CaretUpOutlined style="color: #52c41a" /> 12% </span>
            </div>
            <div class="todo_item">
              <span>预约景区人数</span>
              <span
                ><countTo :startVal="0" :endVal="statistics.reservationCount" :duration="2000"
              /></span>
              <span class="trend"> <CaretUpOutlined style="color: #52c41a" /> 8% </span>
            </div>
            <div class="todo_item">
              <span>购票人数</span>
              <span
                ><countTo :startVal="0" :endVal="statistics.ticketCount" :duration="2000"
              /></span>
              <span class="trend"> <CaretUpOutlined style="color: #52c41a" /> 15% </span>
            </div>
            <div class="todo_item">
              <span>总收入(元)</span>
              <span
                ><countTo :startVal="0" :endVal="statistics.totalRevenue" :duration="2000"
              /></span>
              <span class="trend"> <CaretUpOutlined style="color: #52c41a" /> 20% </span>
            </div>
          </a-flex>
        </a-card>

        <!-- 快捷入口 -->
        <a-card class="short_cut">
          <a-flex vertical>
            <div>快捷入口</div>
            <div class="short_cut_itemList">
              <div class="short_cut_item" @click="$router.push('/scenic/ticket')">
                <div>
                  <TagsOutlined :style="{ fontSize: '40px' }" />
                </div>
                <div style="margin-top: 5px">门票管理</div>
              </div>

              <div class="short_cut_item" @click="$router.push('/scenic/reservation')">
                <div>
                  <ScheduleOutlined :style="{ fontSize: '40px' }" />
                </div>
                <div style="margin-top: 5px">预约管理</div>
              </div>

              <div class="short_cut_item" @click="$router.push('/order')">
                <div>
                  <ShoppingCartOutlined :style="{ fontSize: '40px' }" />
                </div>
                <div style="margin-top: 5px">订单管理</div>
              </div>

              <div class="short_cut_item" @click="$router.push('/vrtour')">
                <div>
                  <EyeOutlined :style="{ fontSize: '40px' }" />
                </div>
                <div style="margin-top: 5px">VR导览</div>
              </div>
            </div>
          </a-flex>
        </a-card>

        <!-- 统计图表区域 -->
        <div class="charts-container">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-card class="chart-card" title="访问趋势">
                <VisitChart />
              </a-card>
            </a-col>
          </a-row>
          <a-row :gutter="16" style="margin-top: 16px">
            <a-col :span="12">
              <a-card class="chart-card" title="门票分布">
                <TicketChart />
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card class="chart-card" title="游客来源">
                <SourceChart />
              </a-card>
            </a-col>
          </a-row>
        </div>
      </div>

      <div class="right">
        <!-- 帮助链接 -->
        <a-card class="help-link">
          <a-flex justify="space-between">
            <a-flex vertical>
              <div class="card-title">帮助中心</div>
              <div class="help-nav" @click="showGuide('scenic')">
                <BookOutlined />
                景区管理指南
              </div>
              <div class="help-nav" @click="showGuide('reservation')">
                <ReadOutlined />
                预约管理手册
              </div>
            </a-flex>
          </a-flex>
        </a-card>

        <!-- 最新反馈 -->
        <a-card class="news-public">
          <a-flex vertical>
            <div class="card-title">未处理反馈</div>
            <div class="feedback-list">
              <div v-for="feedback in latestFeedbacks" :key="feedback.id" class="feedback-item">
                <div class="feedback-content">
                  <span class="feedback-title">{{ feedback.title }}</span>
                  <span class="feedback-time">{{
                    new Date(feedback.createTime).toLocaleDateString()
                  }}</span>
                </div>
              </div>
              <a-empty v-if="latestFeedbacks.length === 0" description="暂无未处理反馈" />
            </div>
          </a-flex>
        </a-card>
      </div>
    </div>
  </div>

  <!-- 帮助文档弹窗 -->
  <a-modal
    :title="currentGuide === 'scenic' ? scenicGuide.title : reservationGuide.title"
    v-model:open="showGuideModal"
    :footer="null"
    width="600px"
  >
    <div class="guide-content">
      <template v-if="currentGuide === 'scenic'">
        <div v-for="(section, index) in scenicGuide.sections" :key="index" class="guide-section">
          <h3>{{ section.name }}</h3>
          <p>{{ section.content }}</p>
        </div>
      </template>
      <template v-else>
        <div
          v-for="(section, index) in reservationGuide.sections"
          :key="index"
          class="guide-section"
        >
          <h3>{{ section.name }}</h3>
          <p>{{ section.content }}</p>
        </div>
      </template>
    </div>
  </a-modal>
</template>

<style scoped lang="scss">
.container {
  padding: 16px;
  min-height: calc(100vh - 65px);
  background-color: #f0f2f5;

  .app-container {
    display: flex;
    gap: 16px;

    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .user_info {
        .company-info {
          font-size: 18px;
          margin: 0 16px;
          font-weight: 500;

          .depart {
            font-size: 14px;
            color: #697086;
            font-weight: 400;
            margin-top: 4px;
          }
        }

        .todo_item {
          margin: 24px 16px 0;
          width: calc(25% - 32px);
          display: flex;
          flex-direction: column;

          :nth-child(1) {
            color: #697086;
            font-size: 14px;
          }
          :nth-child(2) {
            color: #1890ff;
            font-size: 24px;
            font-weight: 500;
            margin-top: 8px;
          }

          .trend {
            font-size: 13px;
            color: #52c41a;
            margin-top: 4px;
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }

      .short_cut {
        .short_cut_itemList {
          display: flex;
          justify-content: space-around;
          margin-top: 16px;

          .short_cut_item {
            cursor: pointer;
            padding: 16px;
            border-radius: 8px;
            transition: all 0.3s;

            &:hover {
              background: #f5f5f5;
              transform: translateY(-2px);
            }

            .anticon {
              color: #1890ff;
            }
          }
        }
      }
    }

    .right {
      width: 320px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .card-title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 16px;
      }

      .help-link {
        .help-nav {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background: #f5f5f5;
          }

          .anticon {
            color: #1890ff;
          }
        }
      }

      .news-public {
        .feedback-list {
          .feedback-item {
            padding: 12px 16px;
            border-bottom: 1px solid #f0f0f0;
            transition: all 0.3s;
            cursor: pointer;

            &:last-child {
              border-bottom: none;
            }

            &:hover {
              background-color: #f5f5f5;
            }

            .feedback-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 12px;

              .feedback-title {
                flex: 1;
                font-size: 14px;
                color: #333;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .feedback-time {
                flex-shrink: 0;
                font-size: 12px;
                color: #999;
              }
            }
          }
        }
      }
    }
  }
}

.guide-content {
  padding: 16px;

  .guide-section {
    margin-bottom: 24px;

    h3 {
      font-size: 16px;
      font-weight: 500;
      color: #1890ff;
      margin-bottom: 8px;
    }

    p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// 修改帮助导航样式
.help-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 8px;
  background: #fafafa;

  &:hover {
    background: #e6f7ff;
    color: #1890ff;
  }

  .anticon {
    font-size: 18px;
    color: #1890ff;
  }
}

.charts-container {
  margin-top: 16px;

  .chart-card {
    background: #fff;
    border-radius: 4px;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    }
  }
}
</style>
