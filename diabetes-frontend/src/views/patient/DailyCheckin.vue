<template>
  <div class="checkin-page page-wrap">
    <div class="page-header anim-fade-in">
      <h3>生活打卡</h3>
    </div>

    <!-- 今日打卡 -->
    <div class="today-section anim-fade-up">
      <div class="today-header">
        <span class="today-label">今日打卡</span>
        <span class="today-date">{{ todayStr }}</span>
      </div>
      <div class="checkin-grid">
        <div
          v-for="t in checkinTypes"
          :key="t.key"
          class="checkin-item"
          :class="{ done: todayStatus[t.key] }"
          @click="doCheckin(t.key)"
        >
          <div class="checkin-icon" :class="t.key">
            <span v-if="todayStatus[t.key]">✓</span>
            <span v-else>{{ t.emoji }}</span>
          </div>
          <span class="checkin-label">{{ t.label }}</span>
          <span v-if="todayStatus[t.key]" class="checkin-badge">已打卡</span>
          <span v-else class="checkin-badge pending">去打卡</span>
        </div>
      </div>
    </div>

    <!-- 打卡统计 -->
    <div class="stats-section anim-fade-up" style="animation-delay:0.1s">
      <div class="stats-header">
        <el-icon :size="16" color="#2563eb"><DataAnalysis /></el-icon>
        近30天统计
      </div>
      <div class="stats-row">
        <div class="stats-item">
          <div class="stats-num">{{ stats.completionRate || 0 }}<span class="stats-unit">%</span></div>
          <div class="stats-label">完成率</div>
        </div>
        <div class="stats-item">
          <div class="stats-num">{{ stats.activeDays || 0 }}<span class="stats-unit">天</span></div>
          <div class="stats-label">活跃天数</div>
        </div>
        <div class="stats-item">
          <div class="stats-num">{{ stats.completedItems || 0 }}<span class="stats-unit">次</span></div>
          <div class="stats-label">完成次数</div>
        </div>
      </div>
      <div class="type-stats">
        <div v-for="s in (stats.stats || [])" :key="s.checkin_type" class="type-stat">
          <div class="type-stat-top">
            <span class="type-name">{{ typeLabel(s.checkin_type) }}</span>
            <span class="type-count">{{ s.completed_count }}/{{ s.total_count }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: s.total_count > 0 ? (s.completed_count / s.total_count * 100) + '%' : '0%' }" :class="s.checkin_type"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 打卡分布图表 -->
    <div class="records-section anim-fade-up" style="animation-delay:0.12s">
      <div class="records-header">
        <el-icon :size="16" color="#2563eb"><DataAnalysis /></el-icon>
        打卡分布
      </div>
      <div ref="pieChartRef" style="height: 200px; width: 100%;"></div>
    </div>

    <!-- 打卡记录 -->
    <div class="records-section anim-fade-up" style="animation-delay:0.15s">
      <div class="records-header">
        <el-icon :size="16" color="#2563eb"><List /></el-icon>
        打卡记录
      </div>
      <div v-if="records.length > 0" class="records-list">
        <div v-for="item in records.slice(0, 10)" :key="item.id" class="record-item">
          <div class="record-icon" :class="item.checkin_type">
            {{ typeEmoji(item.checkin_type) }}
          </div>
          <div class="record-info">
            <div class="record-top">
              <span class="record-type">{{ typeLabel(item.checkin_type) }}</span>
              <span class="record-date">{{ item.checkin_date }}</span>
            </div>
            <div class="record-content">{{ item.content || '未记录详情' }}</div>
          </div>
          <el-tag v-if="item.status === 1" type="success" size="small" effect="plain" round>已完成</el-tag>
        </div>
      </div>
      <div v-else class="empty-state">
        <el-icon :size="36" color="#d1d5db"><Calendar /></el-icon>
        <p>暂无记录，开始打卡吧</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { Calendar } from "@element-plus/icons-vue";
import { checkinApi } from "../../api/index.js";
import { useUserStore } from "../../store/index.js";
import * as echarts from "echarts";

const userStore = useUserStore();
const records = ref([]);
const stats = ref({});
const todayStatus = reactive({ diet: false, exercise: false, medication: false, measure: false });
const pieChartRef = ref(null);
let pieChart = null;

const todayStr = computed(() => {
  const d = new Date();
  const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const weekdays = ["日","一","二","三","四","五","六"];
  return `${ds} 周${weekdays[d.getDay()]}`;
});

const checkinTypes = [
  { key: "diet", label: "饮食", emoji: "🍚" },
  { key: "exercise", label: "运动", emoji: "🏃" },
  { key: "medication", label: "服药", emoji: "💊" },
  { key: "measure", label: "测血糖", emoji: "🩸" },
];

const typeLabel = (type) => ({ diet: "饮食", exercise: "运动", medication: "服药", measure: "测血糖" }[type] || type);
const typeEmoji = (type) => ({ diet: "🍚", exercise: "🏃", medication: "💊", measure: "🩸" }[type] || "📋");

const doCheckin = async (type) => {
  if (todayStatus[type]) return ElMessage.info("今日已打卡");
  const today = new Date().toISOString().slice(0, 10);
  const res = await checkinApi.do({ userId: userStore.userId, checkinDate: today, checkinType: type, content: "" });
  if (res.code === 200) {
    ElMessage.success(`${typeLabel(type)}打卡成功 🎉`);
    await loadData();
  } else {
    ElMessage.warning(res.message || "打卡失败");
  }
};

const loadData = async () => {
  const rRes = await checkinApi.list(userStore.userId, 7);
  if (rRes.code === 200) records.value = rRes.data || [];

  const sRes = await checkinApi.stats(userStore.userId, 30);
  if (sRes.code === 200) stats.value = sRes.data || {};

  const today = new Date().toISOString().slice(0, 10);
  Object.keys(todayStatus).forEach(k => todayStatus[k] = false);
  (records.value || []).forEach(r => {
    if (r.checkin_date === today && r.status === 1) {
      const keyMap = { diet: "diet", exercise: "exercise", 服药: "medication", medication: "medication", 测血糖: "measure", measure: "measure" };
      const k = keyMap[r.checkin_type];
      if (k) todayStatus[k] = true;
    }
  });
};

onMounted(async () => {
  await loadData();
  await nextTick();
  // 打卡分布饼图
  if (stats.value.stats && stats.value.stats.length > 0) {
    pieChart = echarts.init(pieChartRef.value);
    const data = stats.value.stats.map(s => ({
      name: typeLabel(s.checkin_type),
      value: Number(s.completed_count)
    }));
    if (data.length > 0) {
      pieChart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c}次 ({d}%)' },
        series: [{
          type: 'pie', radius: ['50%', '72%'], center: ['50%', '50%'],
          label: { show: true, fontSize: 12, formatter: '{b}' },
          data: data,
          itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
          color: ['#2563eb','#059669','#d97706','#7c3aed'],
          emphasis: { scale: true }
        }]
      });
    }
  }
  window.addEventListener('resize', () => pieChart?.resize());
});

onUnmounted(() => {
  window.removeEventListener('resize', () => pieChart?.resize());
  pieChart?.dispose();
});
</script>

<style scoped>
.checkin-page { padding-bottom: 32px; }

/* 今日打卡 */
.today-section {
  background: #fff;
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.today-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.today-label { font-size: 15px; font-weight: 600; color: #111827; }
.today-date { font-size: 12px; color: #9ca3af; }
.checkin-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.checkin-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 8px;
  border-radius: 14px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s;
  border: 1.5px solid transparent;
}
.checkin-item:active { transform: scale(0.95); }
.checkin-item.done {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.checkin-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.checkin-icon.diet { background: #fff7ed; }
.checkin-icon.exercise { background: #eff6ff; }
.checkin-icon.medication { background: #fdf2f8; }
.checkin-icon.measure { background: #fef3c7; }
.checkin-label { font-size: 12px; color: #374151; font-weight: 500; }
.checkin-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 8px;
  background: #059669;
  color: #fff;
  font-weight: 600;
}
.checkin-badge.pending { background: #e5e7eb; color: #6b7280; }

/* 统计 */
.stats-section {
  background: #fff;
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.stats-header {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.stats-row { display: flex; justify-content: space-around; margin-bottom: 18px; }
.stats-item { text-align: center; }
.stats-num { font-size: 28px; font-weight: 700; color: #2563eb; }
.stats-unit { font-size: 14px; color: #93c5fd; font-weight: 400; }
.stats-label { font-size: 12px; color: #9ca3af; margin-top: 2px; }

.type-stats { display: flex; flex-direction: column; gap: 10px; }
.type-stat { }
.type-stat-top { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
.type-name { color: #374151; font-weight: 500; }
.type-count { color: #9ca3af; }
.progress-bar {
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s;
}
.progress-fill.diet { background: linear-gradient(90deg, #f59e0b, #d97706); }
.progress-fill.exercise { background: linear-gradient(90deg, #3b82f6, #2563eb); }
.progress-fill.medication { background: linear-gradient(90deg, #ec4899, #db2777); }
.progress-fill.measure { background: linear-gradient(90deg, #10b981, #059669); }

/* 记录 */
.records-section {
  background: #fff;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.records-header {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.record-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #f9fafb;
}
.record-item:last-child { border-bottom: none; }
.record-icon { font-size: 22px; width: 36px; text-align: center; }
.record-info { flex: 1; }
.record-top { display: flex; justify-content: space-between; margin-bottom: 2px; }
.record-type { font-size: 13px; font-weight: 500; color: #374151; }
.record-date { font-size: 11px; color: #9ca3af; }
.record-content { font-size: 12px; color: #6b7280; }
</style>
