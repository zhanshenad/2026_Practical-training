<template>
  <div class="admin-layout">
    <!-- 顶部导航 -->
    <div class="admin-header">
      <div class="header-left">
        <el-button text @click="drawerVisible = !drawerVisible" class="menu-btn">
          <el-icon :size="22"><Menu /></el-icon>
        </el-button>
        <span class="header-title">管理后台</span>
      </div>
      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <span class="admin-user">
            <div class="user-avatar">{{ adminInitial }}</div>
            <span class="user-name">{{ userStore.userInfo?.name || '管理员' }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">
                <el-icon><SwitchButton /></el-icon> 退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 抽屉菜单 -->
    <el-drawer v-model="drawerVisible" title="导航菜单" direction="ltr" size="260px" :with-header="false" class="admin-drawer">
      <div class="drawer-logo">
        <el-icon :size="24" color="#2b6cb0"><MedicalKit /></el-icon>
        <span>血糖管理助手</span>
      </div>
      <el-menu :default-active="activeMenu" :router="true" @select="drawerVisible = false">
        <el-menu-item index="/admin/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>管理首页</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/doctors">
          <el-icon><UserFilled /></el-icon>
          <span>医师管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/articles">
          <el-icon><Reading /></el-icon>
          <span>资讯管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/consultations">
          <el-icon><ChatDotSquare /></el-icon>
          <span>咨询管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/statistics">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据统计</span>
        </el-menu-item>
      </el-menu>
    </el-drawer>

    <!-- 内容区域 -->
    <div class="admin-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox } from "element-plus";
import { useUserStore } from "../../store/index.js";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const drawerVisible = ref(false);
const activeMenu = computed(() => route.path);

const adminInitial = computed(() => {
  const name = userStore.userInfo?.name || "管理员";
  return name.charAt(0);
});

const handleCommand = async (cmd) => {
  if (cmd === "logout") {
    await ElMessageBox.confirm("确定要退出登录吗？", "提示", { type: "warning" });
    userStore.logout();
    router.push("/login");
  }
};
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #f7fafc;
}
.admin-header {
  background: #fff;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  color: #1a202c;
  border-bottom: 1px solid #edf2f7;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-left { display: flex; align-items: center; gap: 12px; }
.menu-btn { color: #4a5568; }
.header-title { font-size: 17px; font-weight: 700; color: #2b6cb0; }
.admin-user {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #4a5568;
  font-size: 14px;
}
.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ebf4ff;
  color: #2b6cb0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
}
.user-name { font-weight: 500; }
.admin-content { padding: 16px; max-width: 800px; margin: 0 auto; }

/* Drawer 样式覆盖 */
.admin-drawer :deep(.el-drawer__body) { padding: 0; }
.drawer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  font-size: 17px;
  font-weight: 700;
  color: #2b6cb0;
  border-bottom: 1px solid #edf2f7;
}
.admin-drawer .el-menu { border-right: none; }
</style>
