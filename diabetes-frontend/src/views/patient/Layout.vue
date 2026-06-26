<template>
  <div class="patient-layout">
    <!-- 顶部状态栏 -->
    <div class="top-bar">
      <div class="top-bar-left">
        <span class="app-name">血糖管理助手</span>
      </div>
      <div class="top-bar-right">
        <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="badge">
          <el-icon :size="20" color="#4a5568"><Bell /></el-icon>
        </el-badge>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <router-view />
    </div>

    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <div
        v-for="item in navItems"
        :key="item.path"
        class="nav-item"
        :class="{ active: activeMenu === item.path }"
        @click="goTo(item.path)"
      >
        <div class="nav-icon">
          <el-icon :size="22">
            <component :is="item.icon" />
          </el-icon>
        </div>
        <span class="nav-label">{{ item.label }}</span>
        <div v-if="activeMenu === item.path" class="nav-indicator"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const unreadCount = ref(0);

const activeMenu = computed(() => {
  const path = route.path;
  if (path.startsWith("/patient/personal")) return "/patient/personal";
  if (path.startsWith("/patient/doctor")) return "/patient/doctor";
  if (path.startsWith("/patient/checkin")) return "/patient/checkin";
  if (path.startsWith("/patient/chat")) return "/patient/chat";
  if (path.startsWith("/patient/article")) return "/patient/article";
  return "/patient/dashboard";
});

const navItems = [
  { path: "/patient/dashboard", label: "首页", icon: "Odometer" },
  { path: "/patient/doctor", label: "咨询", icon: "ChatDotSquare" },
  { path: "/patient/checkin", label: "打卡", icon: "Check" },
  { path: "/patient/chat", label: "AI助手", icon: "MagicStick" },
  { path: "/patient/personal", label: "我的", icon: "User" },
];

const goTo = (path) => {
  if (route.path !== path) router.push(path);
};
</script>

<style scoped>
.patient-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7fafc;
}
.top-bar {
  background: #fff;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #edf2f7;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}
.app-name {
  font-size: 17px;
  font-weight: 700;
  color: #2b6cb0;
  letter-spacing: 0.5px;
}
.badge :deep(.el-badge__content) {
  border: none;
  background: #e53e3e;
}
.content-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 64px;
}
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #edf2f7;
  z-index: 1000;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.04);
  padding-bottom: env(safe-area-inset-bottom);
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  cursor: pointer;
  color: #a0aec0;
  transition: all 0.2s;
  position: relative;
  -webkit-tap-highlight-color: transparent;
}
.nav-item.active {
  color: #2b6cb0;
}
.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  transition: transform 0.2s;
}
.nav-item.active .nav-icon {
  transform: scale(1.1);
}
.nav-label {
  font-size: 10px;
  margin-top: 2px;
  font-weight: 500;
  letter-spacing: 0.3px;
}
.nav-indicator {
  position: absolute;
  top: 0;
  width: 24px;
  height: 3px;
  background: #2b6cb0;
  border-radius: 0 0 3px 3px;
}
</style>
