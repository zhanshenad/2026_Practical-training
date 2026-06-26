<template>
  <div class="life-plan">
    <div class="page-header"><h3>生活方案</h3></div>

    <el-tabs v-model="activeTab" stretch>
      <el-tab-pane label="饮食方案" name="diet">
        <el-card v-if="dietPlan" shadow="never" class="plan-card">
          <template #header>
            <div class="plan-header">
              <span>{{ dietPlan.title }}</span>
              <el-tag size="small" type="success">AI生成</el-tag>
            </div>
          </template>
          <div class="plan-content" v-html="renderContent(dietPlan.content)"></div>
        </el-card>
        <div v-else class="empty-plan">
          <el-icon :size="48" color="#c0c4cc"><Food /></el-icon>
          <p>暂无饮食方案</p>
          <el-button type="primary" @click="generatePlan('diet')" :loading="genLoading">AI生成方案</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="运动方案" name="exercise">
        <el-card v-if="exercisePlan" shadow="never" class="plan-card">
          <template #header>
            <div class="plan-header">
              <span>{{ exercisePlan.title }}</span>
              <el-tag size="small" type="success">AI生成</el-tag>
            </div>
          </template>
          <div class="plan-content" v-html="renderContent(exercisePlan.content)"></div>
        </el-card>
        <div v-else class="empty-plan">
          <el-icon :size="48" color="#c0c4cc"><Help /></el-icon>
          <p>暂无运动方案</p>
          <el-button type="primary" @click="generatePlan('exercise')" :loading="genLoading">AI生成方案</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 方案历史 -->
    <div class="history-section">
      <div class="section-title">全部方案</div>
      <div v-for="plan in allPlans" :key="plan.id" class="history-item">
        <div class="plan-type-tag">
          <el-tag size="small" :type="plan.planType === 'diet' ? 'success' : 'warning'">
            {{ plan.planType === 'diet' ? '饮食' : '运动' }}
          </el-tag>
        </div>
        <div class="plan-info">
          <div class="plan-name">{{ plan.title }}</div>
          <div class="plan-date">{{ formatTime(plan.createdTime) }}</div>
        </div>
      </div>
      <div v-if="allPlans.length === 0" class="empty-tip">暂无方案</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { planApi } from "../../api/index.js";
import { useUserStore } from "../../store/index.js";

const userStore = useUserStore();
const activeTab = ref("diet");
const allPlans = ref([]);
const genLoading = ref(false);

const dietPlan = computed(() => allPlans.value.find(p => p.planType === 'diet'));
const exercisePlan = computed(() => allPlans.value.find(p => p.planType === 'exercise'));

const renderContent = (content) => {
  if (!content) return "";
  try {
    const obj = JSON.parse(content);
    let html = "";
    for (const [key, value] of Object.entries(obj)) {
      const label = { breakfast: "早餐", lunch: "午餐", dinner: "晚餐", tips: "温馨提示", type: "运动类型", frequency: "频率", duration: "时长", activities: "活动项目" }[key] || key;
      if (Array.isArray(value)) {
        html += `<p><strong>${label}:</strong></p><ul>${value.map(v => `<li>${v}</li>`).join('')}</ul>`;
      } else {
        html += `<p><strong>${label}:</strong> ${value}</p>`;
      }
    }
    return html;
  } catch {
    return `<p>${content}</p>`;
  }
};

const formatTime = (t) => t ? t.slice(0, 10) : "";

const generatePlan = async (type) => {
  genLoading.value = true;
  try {
    const planData = type === 'diet'
      ? { userId: userStore.userId, planType: 'diet', title: '个性化饮食方案', content: JSON.stringify({ breakfast: '全麦面包2片+鸡蛋1个+牛奶250ml', lunch: '杂粮饭150g+瘦肉50g+蔬菜200g', dinner: '蔬菜汤+鱼肉100g+蔬菜150g', tips: '少油少盐，避免高糖食物' }) }
      : { userId: userStore.userId, planType: 'exercise', title: '个性化运动方案', content: JSON.stringify({ type: '有氧运动', frequency: '每周5次', duration: '每次30-45分钟', activities: ['快走', '太极拳', '游泳'] }) };
    await planApi.add(planData);
    ElMessage.success("方案已生成");
    await loadPlans();
  } catch (_) { /* eslint-disable-line no-empty */ }
  genLoading.value = false;
};

const loadPlans = async () => {
  const res = await planApi.listByUser(userStore.userId);
  if (res.code === 200) allPlans.value = res.data || [];
};

onMounted(loadPlans);
</script>

<style scoped>
.life-plan { padding: 16px; max-width: 500px; margin: 0 auto; }
.page-header h3 { font-size: 20px; margin-bottom: 16px; }
.plan-card { margin-bottom: 16px; }
.plan-header { display: flex; justify-content: space-between; align-items: center; }
.plan-content { font-size: 14px; line-height: 1.8; }
.plan-content ul { padding-left: 20px; }
.empty-plan { text-align: center; padding: 40px 0; }
.empty-plan p { color: #909399; margin: 12px 0 16px; }
.history-section { background: #fff; border-radius: 12px; padding: 16px; }
.section-title { font-size: 15px; font-weight: bold; margin-bottom: 12px; }
.history-item { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.history-item:last-child { border-bottom: none; }
.plan-info { flex: 1; }
.plan-name { font-size: 14px; }
.plan-date { font-size: 12px; color: #909399; margin-top: 2px; }
.empty-tip { text-align: center; padding: 24px; color: #909399; }
</style>
