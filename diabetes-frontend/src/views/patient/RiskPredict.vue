<template>
  <div class="risk-predict">
    <div class="page-header"><h3>糖尿病风险预测</h3></div>

    <!-- 风险录入表单 -->
    <el-card shadow="never" class="form-card">
      <template #header><span style="font-weight: bold">输入身体指标</span></template>
      <el-form ref="formRef" :model="form" label-width="100px" size="small">
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="1" :max="150" style="width:100%" />
        </el-form-item>
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="身高(cm)" prop="height"><el-input-number v-model="form.height" :min="50" :max="250" :step="0.5" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="体重(kg)" prop="weight"><el-input-number v-model="form.weight" :min="20" :max="300" :step="0.5" style="width:100%" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="空腹血糖" prop="fastingBloodSugar">
          <el-input-number v-model="form.fastingBloodSugar" :min="2" :max="30" :step="0.1" :precision="1" style="width:100%" />
        </el-form-item>
        <el-form-item label="餐后血糖" prop="postprandialBloodSugar">
          <el-input-number v-model="form.postprandialBloodSugar" :min="2" :max="30" :step="0.1" :precision="1" style="width:100%" />
        </el-form-item>
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="收缩压" prop="bloodPressureSystolic"><el-input-number v-model="form.bloodPressureSystolic" :min="60" :max="250" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="舒张压" prop="bloodPressureDiastolic"><el-input-number v-model="form.bloodPressureDiastolic" :min="40" :max="150" style="width:100%" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="家族史">
          <el-radio-group v-model="form.familyHistory">
            <el-radio :value="0">无</el-radio>
            <el-radio :value="1">有</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button type="primary" :loading="loading" @click="handlePredict" class="predict-btn">
          <el-icon><DataAnalysis /></el-icon> AI风险预测
        </el-button>
      </el-form>
    </el-card>

    <!-- 预测结果 -->
    <el-card v-if="result" shadow="never" class="result-card" :class="result.riskLevel">
      <div class="result-header">
        <div class="risk-badge">{{ result.riskLevel }}</div>
        <div class="risk-score">风险评分: {{ result.riskScore }}分</div>
      </div>
      <div v-if="result.bmi" class="bmi-info">BMI: {{ result.bmi }}</div>
      <div class="advice">{{ result.advice }}</div>
    </el-card>

    <!-- 历史记录 -->
    <div class="history-section">
      <div class="section-title">历史预测记录</div>
      <div v-for="item in history" :key="item.id" class="history-item" @click="showDetail(item)">
        <div class="history-left">
          <div class="history-level" :class="item.riskLevel">{{ item.riskLevel }}</div>
          <div class="history-date">{{ formatTime(item.createdTime) }}</div>
        </div>
        <div class="history-right">评分: {{ item.riskScore }}</div>
      </div>
      <div v-if="history.length === 0" class="empty-tip">暂无记录</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { riskApi } from "../../api/index.js";
import { useUserStore } from "../../store/index.js";

const userStore = useUserStore();
const loading = ref(false);
const result = ref(null);
const history = ref([]);

const form = ref({
  age: 45, height: 170, weight: 70, fastingBloodSugar: 6.1,
  postprandialBloodSugar: 8.5, bloodPressureSystolic: 130,
  bloodPressureDiastolic: 85, familyHistory: 0,
});

const formatTime = (t) => t ? t.slice(0, 10) : "";

const handlePredict = async () => {
  loading.value = true;
  try {
    const res = await riskApi.predict({ userId: userStore.userId, ...form.value });
    if (res.code === 200) {
      result.value = res.data;
      ElMessage.success("预测完成");
      loadHistory();
    }
  } catch (_) { /* eslint-disable-line no-empty */ }
  loading.value = false;
};

const loadHistory = async () => {
  const res = await riskApi.listByUser(userStore.userId);
  if (res.code === 200) history.value = res.data || [];
};

onMounted(loadHistory);
</script>

<style scoped>
.risk-predict { padding: 16px; max-width: 500px; margin: 0 auto; }
.page-header h3 { font-size: 20px; margin-bottom: 16px; }
.form-card { margin-bottom: 16px; }
.predict-btn { width: 100%; margin-top: 8px; border-radius: 20px; }
.result-card { margin-bottom: 16px; padding: 16px; text-align: center; }
.result-card.高风险 { border-left: 4px solid #f56c6c; }
.result-card.中风险 { border-left: 4px solid #e6a23c; }
.result-card.低风险 { border-left: 4px solid #67c23a; }
.result-header { margin-bottom: 12px; }
.risk-badge { font-size: 24px; font-weight: bold; margin-bottom: 4px; }
.高风险 .risk-badge { color: #f56c6c; }
.中风险 .risk-badge { color: #e6a23c; }
.低风险 .risk-badge { color: #67c23a; }
.risk-score { font-size: 14px; color: #909399; }
.bmi-info { font-size: 14px; color: #606266; margin-bottom: 8px; }
.advice { font-size: 14px; color: #606266; line-height: 1.6; text-align: left; padding: 12px; background: #f5f7fa; border-radius: 8px; }
.history-section { background: #fff; border-radius: 12px; padding: 16px; }
.section-title { font-size: 15px; font-weight: bold; margin-bottom: 12px; }
.history-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0; cursor: pointer; }
.history-item:last-child { border-bottom: none; }
.history-left { display: flex; align-items: center; gap: 8px; }
.history-level { padding: 2px 8px; border-radius: 4px; font-size: 12px; color: #fff; }
.history-level.高风险 { background: #f56c6c; }
.history-level.中风险 { background: #e6a23c; }
.history-level.低风险 { background: #67c23a; }
.history-date { font-size: 13px; color: #909399; }
.history-right { font-size: 13px; color: #606266; }
.empty-tip { text-align: center; padding: 24px; color: #909399; }
</style>
