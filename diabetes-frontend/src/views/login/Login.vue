<template>
  <div class="login-page">
    <div class="login-bg"></div>
    <div class="login-container">
      <!-- Logo 区域 -->
      <div class="login-brand">
        <div class="brand-icon">
          <svg viewBox="0 0 48 48" width="56" height="56">
            <circle cx="24" cy="24" r="22" fill="#2b6cb0" opacity="0.1"/>
            <path d="M24 10 L24 38 M10 24 L38 24" stroke="#2b6cb0" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="24" cy="24" r="16" fill="none" stroke="#2b6cb0" stroke-width="1.5" opacity="0.3"/>
          </svg>
        </div>
        <h1 class="brand-title">血糖管理助手</h1>
        <p class="brand-subtitle">智能监测 · 科学管理 · 健康生活</p>
      </div>

      <!-- 登录卡片 -->
      <div class="login-card">
        <el-tabs v-model="activeTab" :stretch="true" class="login-tabs">
          <el-tab-pane label="用户登录" name="patient">
            <el-form ref="formRef" :model="form" :rules="rules" class="login-form">
              <el-form-item prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名" size="large">
                  <template #prefix><el-icon><User /></el-icon></template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="form.password" type="password" placeholder="请输入密码" size="large" show-password>
                  <template #prefix><el-icon><Lock /></el-icon></template>
                </el-input>
              </el-form-item>
              <el-button type="primary" size="large" :loading="loading" @click="handleLogin" class="login-btn">
                登 录
              </el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="管理登录" name="admin">
            <el-form ref="adminFormRef" :model="adminForm" :rules="rules" class="login-form">
              <el-form-item prop="username">
                <el-input v-model="adminForm.username" placeholder="管理员账号" size="large">
                  <template #prefix><el-icon><User /></el-icon></template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="adminForm.password" type="password" placeholder="请输入密码" size="large" show-password>
                  <template #prefix><el-icon><Lock /></el-icon></template>
                </el-input>
              </el-form-item>
              <el-button type="primary" size="large" :loading="loading" @click="handleAdminLogin" class="login-btn">
                管理员登录
              </el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 注册入口 -->
      <div class="login-footer">
        <span>还没有账号？</span>
        <router-link to="/register" class="register-link">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";
import { userApi } from "../../api/index.js";
import { useUserStore } from "../../store/index.js";

const router = useRouter();
const userStore = useUserStore();

const activeTab = ref("patient");
const loading = ref(false);
const formRef = ref(null);
const adminFormRef = ref(null);

const form = reactive({ username: "zhangsan", password: "123456" });
const adminForm = reactive({ username: "admin", password: "123456" });

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const handleLogin = async () => {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  loading.value = true;
  try {
    const res = await userApi.login({ ...form, role: "patient" });
    if (res.code === 200) {
      userStore.setUser(res.data.token, res.data.user, "patient");
      ElMessage.success("登录成功");
      router.push("/patient/dashboard");
    } else {
      ElMessage.error(res.message || "登录失败");
    }
  } catch (e) {
    ElMessage.error("登录失败");
  }
  loading.value = false;
};

const handleAdminLogin = async () => {
  const valid = await adminFormRef.value.validate().catch(() => false);
  if (!valid) return;
  loading.value = true;
  try {
    const res = await userApi.login({ ...adminForm, role: "admin" });
    if (res.code === 200) {
      userStore.setUser(res.data.token, res.data.user, "admin");
      ElMessage.success("登录成功");
      router.push("/admin/dashboard");
    } else {
      ElMessage.error(res.message || "登录失败");
    }
  } catch (e) {
    ElMessage.error("登录失败");
  }
  loading.value = false;
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #ebf4ff 0%, #f7fafc 40%, #ffffff 100%);
  padding: 24px 20px;
  position: relative;
  overflow: hidden;
}
.login-bg {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%);
  opacity: 0.06;
}
.login-container {
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
}
.login-brand {
  text-align: center;
  margin-bottom: 32px;
}
.brand-icon { margin-bottom: 16px; }
.brand-title {
  font-size: 26px;
  font-weight: 700;
  color: #1a202c;
  letter-spacing: 1px;
}
.brand-subtitle {
  font-size: 14px;
  color: #718096;
  margin-top: 6px;
  letter-spacing: 0.5px;
}
.login-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px 24px 20px;
  box-shadow: 0 4px 24px rgba(43,108,176,0.08);
}
.login-tabs { margin-bottom: 8px; }
.login-tabs :deep(.el-tabs__item) {
  font-size: 15px;
  font-weight: 500;
  height: 44px;
  line-height: 44px;
}
.login-form { margin-top: 8px; }
.login-form :deep(.el-input__wrapper) {
  border-radius: 10px;
  padding: 4px 12px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
}
.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #3182ce inset;
}
.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(43,108,176,0.2) inset;
}
.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border-radius: 24px;
  margin-top: 8px;
  font-weight: 600;
  letter-spacing: 2px;
}
.login-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #718096;
}
.register-link {
  color: #2b6cb0;
  text-decoration: none;
  font-weight: 500;
  margin-left: 2px;
}
</style>
