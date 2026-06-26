<template>
  <div class="admin-dashboard">
    <h3 class="page-title">管理首页</h3>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-val">{{ stats.totalUsers }}</div>
        <div class="stat-label">用户总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">{{ stats.pendingConsultations }}</div>
        <div class="stat-label">待回复咨询</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">{{ stats.totalArticles }}</div>
        <div class="stat-label">资讯总数</div>
      </div>
    </div>

    <!-- 快速入口 -->
    <el-card shadow="never" class="quick-card">
      <template #header><span style="font-weight: bold">快速入口</span></template>
      <div class="quick-grid">
        <div class="quick-item" @click="$router.push('/admin/users')">
          <el-icon :size="28" color="#409eff"><User /></el-icon><span>用户管理</span>
        </div>
        <div class="quick-item" @click="$router.push('/admin/doctors')">
          <el-icon :size="28" color="#67c23a"><UserFilled /></el-icon><span>医师管理</span>
        </div>
        <div class="quick-item" @click="$router.push('/admin/articles')">
          <el-icon :size="28" color="#e6a23c"><Reading /></el-icon><span>资讯管理</span>
        </div>
        <div class="quick-item" @click="$router.push('/admin/consultations')">
          <el-icon :size="28" color="#f56c6c"><ChatDotSquare /></el-icon><span>咨询管理</span>
        </div>
      </div>
    </el-card>

    <!-- 用户趋势 -->
    <el-card shadow="never" class="chart-card">
      <template #header><span style="font-weight: bold">近30天用户增长</span></template>
      <div ref="chartRef" style="height: 260px"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import * as echarts from "echarts";
import { adminApi } from "../../api/index.js";

const stats = ref({ totalUsers: 0, pendingConsultations: 0, totalArticles: 0 });
const chartRef = ref(null);
let chart = null;

onMounted(async () => {
  const res = await adminApi.dashboard();
  if (res.code === 200) {
    stats.value = res.data;
    await nextTick();
    chart = echarts.init(chartRef.value);
    const trend = res.data.userTrend || [];
    chart.setOption({
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: trend.map(t => t.date) },
      yAxis: { type: "value" },
      series: [{ type: "line", data: trend.map(t => t.count), smooth: true, areaStyle: { opacity: 0.3 } }],
      grid: { left: "8%", right: "8%", bottom: "15%" },
    });
  }
});

onUnmounted(() => { chart?.dispose(); });
</script>

<style scoped>
.admin-dashboard { max-width: 600px; margin: 0 auto; }
.page-title { font-size: 20px; margin-bottom: 16px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
.stat-card { background: #fff; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.stat-val { font-size: 28px; font-weight: bold; color: #409eff; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.quick-card { margin-bottom: 16px; }
.quick-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.quick-item { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border-radius: 12px; background: #f5f7fa; cursor: pointer; }
.quick-item span { font-size: 13px; color: #606266; }
.chart-card { margin-bottom: 16px; }
</style>
