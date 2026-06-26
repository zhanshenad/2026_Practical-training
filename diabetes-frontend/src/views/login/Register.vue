<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <div class="back-link" @click="$router.push('/login')">
          <el-icon><ArrowLeft /></el-icon>
          <span>返回登录</span>
        </div>
        <div class="register-brand">
          <h2>创建账号</h2>
          <p>加入血糖管理，开启健康生活</p>
        </div>
      </div>
      <div class="register-card">
        <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-row :gutter="12">
            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="form.gender" placeholder="选择">
                  <el-option label="男" value="男" />
                  <el-option label="女" value="女" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input-number v-model="form.age" :min="1" :max="150" style="width:100%" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="至少6位密码" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" placeholder="再次输入密码" show-password />
          </el-form-item>
          <el-button type="primary" size="large" :loading="loading" @click="handleRegister" class="register-btn">
            注 册
          </el-button>
        </el-form>
      </div>
      <div class="login-hint">
        <span>已有账号？</span>
        <router-link to="/login">去登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { userApi } from "../../api/index.js";

const router = useRouter();
const loading = ref(false);
const formRef = ref(null);

const form = reactive({
  username: "", name: "", phone: "", age: 30, gender: "男",
  password: "", confirmPassword: "",
});

const validatePass = (_rule, value, callback) => {
  if (value !== form.password) callback(new Error("两次密码不一致"));
  else callback();
};

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }, { min: 6, message: "至少6位", trigger: "blur" }],
  confirmPassword: [{ required: true, message: "请确认密码", trigger: "blur" }, { validator: validatePass, trigger: "blur" }],
};

const handleRegister = async () => {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  loading.value = true;
  try {
    const res = await userApi.register({
      username: form.username, password: form.password,
      name: form.name, phone: form.phone, age: form.age, gender: form.gender,
    });
    if (res.code === 200) {
      ElMessage.success("注册成功");
      router.push("/login");
    } else {
      ElMessage.error(res.message || "注册失败");
    }
  } catch (_) { /* 忽略 */ }
  loading.value = false;
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: #f7fafc;
  padding: 0 20px;
}
.register-container {
  max-width: 420px;
  margin: 0 auto;
  padding: 24px 0;
}
.register-header { margin-bottom: 24px; }
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #718096;
  cursor: pointer;
  margin-bottom: 20px;
}
.register-brand h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
}
.register-brand p {
  font-size: 14px;
  color: #718096;
  margin-top: 6px;
}
.register-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
.register-card :deep(.el-form-item__label) {
  font-size: 13px;
  font-weight: 500;
  color: #4a5568;
  padding-bottom: 4px;
}
.register-card :deep(.el-input__wrapper),
.register-card :deep(.el-select .el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
}
.register-card :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #3182ce inset;
}
.register-btn {
  width: 100%;
  height: 48px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  margin-top: 8px;
}
.login-hint {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #718096;
}
.login-hint a {
  color: #2b6cb0;
  text-decoration: none;
  font-weight: 500;
}
</style>
