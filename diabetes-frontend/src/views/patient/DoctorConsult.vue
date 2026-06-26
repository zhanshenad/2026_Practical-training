<template>
  <div class="consult-page page-wrap">
    <div class="page-header anim-fade-in">
      <h3>医师咨询</h3>
    </div>

    <!-- 选择医师 -->
    <div class="info-card-title" style="padding: 0 0 10px">
      <el-icon :size="16" color="#2563eb"><UserFilled /></el-icon>
      选择医师
    </div>
    <div class="doctor-list anim-stagger">
      <div
        v-for="doc in doctors"
        :key="doc.id"
        class="doctor-card"
        :class="{ active: selectedDoctor?.id === doc.id }"
        @click="selectedDoctor = doc"
      >
        <div class="doc-avatar" :style="{ background: docColors(doc.id) }">
          <span>{{ doc.name?.charAt(0) }}</span>
        </div>
        <div class="doc-info">
          <div class="doc-name">{{ doc.name }}</div>
          <div class="doc-meta">{{ doc.department }} · {{ doc.title }}</div>
          <div class="doc-tags">
            <el-tag size="small" round>糖尿病</el-tag>
            <el-tag v-if="doc.goodAt" size="small" round type="info">{{ doc.goodAt?.split('、')[0] }}</el-tag>
          </div>
        </div>
        <div class="doc-status">
          <span class="status-dot"></span>
          <span class="status-text">在线</span>
        </div>
      </div>
    </div>

    <!-- 咨询输入 -->
    <div v-if="selectedDoctor" class="consult-card anim-fade-up">
      <div class="consult-card-header">
        <el-icon :size="16" color="#2563eb"><Edit /></el-icon>
        向 {{ selectedDoctor.name }} 咨询
      </div>
      <el-input v-model="consultContent" type="textarea" :rows="4" placeholder="请详细描述您的问题..." maxlength="500" show-word-limit />
      <el-button type="primary" :loading="loading" @click="handleSubmit" class="submit-btn anim-fade-up">
        <el-icon><Promotion /></el-icon> 提交咨询
      </el-button>
    </div>

    <!-- 咨询历史 -->
    <div class="history-section info-card" style="margin-top:16px">
      <div class="info-card-title">
        <el-icon :size="16" color="#2563eb"><ChatDotSquare /></el-icon>
        咨询历史
      </div>
      <div v-if="history.length > 0" class="history-list">
        <div v-for="item in history" :key="item.id" class="history-item" @click="showDetail(item)">
          <div class="h-item-header">
            <div class="h-doctor">
              <div class="h-avatar" :style="{ background: docColors(item.doctor_id) }">
                <span>{{ item.doctor_name?.charAt(0) || '医' }}</span>
              </div>
              <div>
                <div class="h-name">{{ item.doctor_name || '医师' }}</div>
                <div class="h-time">{{ formatTime(item.created_time) }}</div>
              </div>
            </div>
            <el-tag :type="item.status === '已回复' ? 'success' : 'warning'" size="small" round>
              {{ item.status }}
            </el-tag>
          </div>
          <div class="h-content">{{ item.content }}</div>
          <div v-if="item.reply" class="h-reply">
            <span class="reply-label">医师回复：</span>
            {{ item.reply }}
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <el-icon :size="36" color="#d1d5db"><ChatDotSquare /></el-icon>
        <p>暂无咨询记录</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { doctorApi, consultationApi } from "../../api/index.js";
import { useUserStore } from "../../store/index.js";

const userStore = useUserStore();
const doctors = ref([]);
const selectedDoctor = ref(null);
const consultContent = ref("");
const history = ref([]);
const loading = ref(false);

const docColors = (id) => {
  const colors = ["#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];
  return colors[(id || 1) % colors.length];
};
const formatTime = (t) => t ? t.slice(0, 16).replace("T", " ") : "";

const loadData = async () => {
  const dRes = await doctorApi.list();
  if (dRes.code === 200) doctors.value = dRes.data || [];
  const hRes = await consultationApi.listByUser(userStore.userId);
  if (hRes.code === 200) history.value = hRes.data || [];
};

const handleSubmit = async () => {
  if (!consultContent.value.trim()) return ElMessage.warning("请输入问题");
  if (!selectedDoctor.value) return ElMessage.warning("请选择医师");
  loading.value = true;
  try {
    await consultationApi.add({ userId: userStore.userId, doctorId: selectedDoctor.value.id, content: consultContent.value });
    ElMessage.success("咨询已提交，请等待医师回复");
    consultContent.value = "";
    const hRes = await consultationApi.listByUser(userStore.userId);
    if (hRes.code === 200) history.value = hRes.data || [];
  } catch (_) { /* 忽略 */ }
  loading.value = false;
};

onMounted(loadData);
</script>

<style scoped>
.consult-page { padding-bottom: 32px; }

/* 医师卡片 */
.doctor-card {
  display: flex;
  gap: 14px;
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all 0.2s;
  position: relative;
}
.doctor-card.active {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
}
.doc-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.doc-avatar span { font-size: 20px; font-weight: 700; color: #fff; }
.doc-info { flex: 1; min-width: 0; }
.doc-name { font-size: 15px; font-weight: 600; color: #111827; }
.doc-meta { font-size: 12px; color: #6b7280; margin: 3px 0 6px; }
.doc-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.doc-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding-top: 4px;
}
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: #059669; box-shadow: 0 0 0 2px rgba(5,150,105,0.2); }
.status-text { font-size: 11px; color: #059669; font-weight: 500; }

/* 咨询输入 */
.consult-card {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  margin-top: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.consult-card-header {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.submit-btn {
  width: 100%;
  margin-top: 12px;
  height: 44px;
}

/* 咨询历史 */
.history-list { }
.history-item {
  padding: 14px 0;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
}
.history-item:last-child { border-bottom: none; }
.h-item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.h-doctor { display: flex; align-items: center; gap: 10px; }
.h-avatar {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.h-avatar span { font-size: 15px; font-weight: 700; color: #fff; }
.h-name { font-size: 14px; font-weight: 600; color: #374151; }
.h-time { font-size: 12px; color: #9ca3af; margin-top: 1px; }
.h-content { font-size: 13px; color: #6b7280; line-height: 1.5; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.h-reply {
  font-size: 13px;
  color: #059669;
  padding: 10px;
  background: #f0fdf4;
  border-radius: 8px;
  line-height: 1.5;
}
.reply-label { font-weight: 600; }
</style>
