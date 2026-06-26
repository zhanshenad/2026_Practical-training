<template>
  <div class="statistics">
    <h3 class="page-title">数据统计</h3>

    <!-- 概览卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-val">{{ stats.totalUsers }}</div>
        <div class="stat-label">注册用户</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">{{ stats.pendingConsultations || 0 }}</div>
        <div class="stat-label">待回复咨询</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">{{ stats.repliedConsultations || 0 }}</div>
        <div class="stat-label">已回复咨询</div>
      </div>
    </div>

    <!-- 用户增长趋势 -->
    <el-card shadow="never" class="chart-card">
      <template #header><span style="font-weight: bold">用户增长趋势</span></template>
      <div ref="trendChartRef" style="height: 260px"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import * as echarts from "echarts";
import { adminApi } from "../../api/index.js";

const stats = ref({});
const trendChartRef = ref(null);
let trendChart = null;

onMounted(async () => {
  const res = await adminApi.statistics();
  if (res.code === 200) {
    stats.value = res.data;
    await nextTick();
    trendChart = echarts.init(trendChartRef.value);
    const trend = res.data.userTrend || [];
    trendChart.setOption({
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: trend.map(t => t.date) },
      yAxis: { type: "value" },
      series: [{ type: "line", data: trend.map(t => t.count), smooth: true, areaStyle: { opacity: 0.3 }, itemStyle: { color: "#409eff" } }],
      grid: { left: "8%", right: "8%", bottom: "15%" },
    });
  }
});

onUnmounted(() => { trendChart?.dispose(); });
</script>

<style scoped>
.statistics { max-width: 600px; margin: 0 auto; }
.page-title { font-size: 20px; margin-bottom: 16px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
.stat-card { background: #fff; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.stat-val { font-size: 28px; font-weight: bold; color: #409eff; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.chart-card { margin-bottom: 16px; }
</style>
