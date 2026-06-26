<template>
  <div class="personal-page page-wrap">
    <!-- 顶部 -->
    <div class="page-header anim-fade-in">
      <h3>个人中心</h3>
    </div>

    <!-- 用户卡片 -->
    <div class="profile-card anim-fade-up">
      <div class="profile-bg"></div>
      <div class="profile-content">
        <div class="profile-avatar">
          <span>{{ userInfo.name ? userInfo.name.charAt(0) : 'U' }}</span>
        </div>
        <div class="profile-info">
          <h4>{{ userInfo.name || '用户' }}</h4>
          <p>{{ userInfo.username }}</p>
        </div>
      </div>
      <div class="profile-stats">
        <div class="stat-item">
          <div class="stat-val">{{ userInfo.age || '-' }}</div>
          <div class="stat-lbl">年龄</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-val">{{ userInfo.gender || '-' }}</div>
          <div class="stat-lbl">性别</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-val">{{ userInfo.diabetesType || '未填' }}</div>
          <div class="stat-lbl">类型</div>
        </div>
      </div>
    </div>

    <!-- 个人信息 -->
    <div class="info-card anim-fade-up" style="animation-delay:0.08s">
      <div class="info-card-title">
        <el-icon :size="16" color="#2563eb"><User /></el-icon>
        基本信息
      </div>
      <div class="info-grid">
        <div class="info-row">
          <span class="info-label">姓名</span>
          <span class="info-value">{{ userInfo.name || '-' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">手机号</span>
          <span class="info-value">{{ userInfo.phone || '-' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">身高</span>
          <span class="info-value">{{ userInfo.height ? userInfo.height + ' cm' : '-' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">体重</span>
          <span class="info-value">{{ userInfo.weight ? userInfo.weight + ' kg' : '-' }}</span>
        </div>
      </div>
    </div>

    <!-- 操作列表 -->
    <div class="action-list anim-fade-up" style="animation-delay:0.12s">
      <div class="action-item" @click="editVisible = true">
        <div class="action-left">
          <div class="action-icon edit"><el-icon :size="18"><Edit /></el-icon></div>
          <span>编辑资料</span>
        </div>
        <el-icon color="#9ca3af"><ArrowRight /></el-icon>
      </div>
      <div class="action-item" @click="pwdVisible = true">
        <div class="action-left">
          <div class="action-icon lock"><el-icon :size="18"><Lock /></el-icon></div>
          <span>修改密码</span>
        </div>
        <el-icon color="#9ca3af"><ArrowRight /></el-icon>
      </div>
      <div class="action-item danger" @click="handleLogout">
        <div class="action-left">
          <div class="action-icon logout"><el-icon :size="18"><SwitchButton /></el-icon></div>
          <span>退出登录</span>
        </div>
        <el-icon color="#9ca3af"><ArrowRight /></el-icon>
      </div>
    </div>

    <!-- 编辑资料对话框 -->
    <el-dialog v-model="editVisible" title="编辑资料" class="mobile-dialog" top="5vh">
      <el-form ref="editFormRef" :model="editForm" label-width="70px" label-position="left">
        <el-form-item label="姓名"><el-input v-model="editForm.name" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="editForm.phone" /></el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="年龄"><el-input-number v-model="editForm.age" :min="1" :max="150" style="width:100%" controls-position="right" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别"><el-select v-model="editForm.gender" style="width:100%"><el-option label="男" value="男" /><el-option label="女" value="女" /></el-select></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="身高(cm)"><el-input-number v-model="editForm.height" :min="50" :max="250" :step="0.5" style="width:100%" controls-position="right" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体重(kg)"><el-input-number v-model="editForm.weight" :min="20" :max="300" :step="0.5" style="width:100%" controls-position="right" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="糖尿病类型">
          <el-select v-model="editForm.diabetesType" style="width:100%">
            <el-option label="未填写" value="" /><el-option label="1型" value="1型" /><el-option label="2型" value="2型" /><el-option label="妊娠期" value="妊娠期" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEdit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="pwdVisible" title="修改密码" class="mobile-dialog" top="15vh">
      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="80px">
        <el-form-item label="原密码" prop="oldPassword"><el-input v-model="pwdForm.oldPassword" type="password" show-password /></el-form-item>
        <el-form-item label="新密码" prop="newPassword"><el-input v-model="pwdForm.newPassword" type="password" show-password /></el-form-item>
        <el-form-item label="确认密码" prop="confirm"><el-input v-model="pwdForm.confirm" type="password" show-password /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pwdVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePwd">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { userApi } from "../../api/index.js";
import { useUserStore } from "../../store/index.js";

const router = useRouter();
const userStore = useUserStore();

const userInfo = ref({});
const editVisible = ref(false);
const pwdVisible = ref(false);
const editForm = reactive({});
const pwdForm = reactive({ oldPassword: "", newPassword: "", confirm: "" });
const pwdRules = {
  oldPassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }, { min: 6, message: "至少6位", trigger: "blur" }],
  confirm: [{ required: true, message: "请确认密码", trigger: "blur" }, { validator: (_r, v, cb) => v === pwdForm.newPassword ? cb() : cb(new Error("密码不一致")), trigger: "blur" }],
};

const loadInfo = async () => {
  const res = await userApi.getProfile(userStore.userId);
  if (res.code === 200) {
    userInfo.value = res.data;
    Object.assign(editForm, res.data);
  }
};
const handleEdit = async () => { await userApi.updateProfile(editForm); ElMessage.success("保存成功"); editVisible.value = false; loadInfo(); };
const handlePwd = async () => { await userApi.changePassword({ userId: userStore.userId, ...pwdForm }); ElMessage.success("密码已修改"); pwdVisible.value = false; };
const handleLogout = async () => { await ElMessageBox.confirm("确定退出登录？", "提示", { type: "warning" }); userStore.logout(); router.push("/login"); };

onMounted(loadInfo);
</script>

<style scoped>
.personal-page { padding-bottom: 32px; }

/* 用户卡片 */
.profile-card {
  position: relative;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.profile-bg {
  height: 80px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}
.profile-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  margin-top: -32px;
}
.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(37,99,235,0.2);
}
.profile-avatar span { font-size: 24px; font-weight: 700; color: #fff; }
.profile-info { padding-top: 28px; }
.profile-info h4 { font-size: 18px; font-weight: 700; color: #111827; }
.profile-info p { font-size: 13px; color: #9ca3af; margin-top: 2px; }

.profile-stats {
  display: flex;
  margin: 16px 20px 0;
  padding: 16px 0;
  border-top: 1px solid #f3f4f6;
}
.stat-item { flex: 1; text-align: center; }
.stat-val { font-size: 18px; font-weight: 700; color: #2563eb; }
.stat-lbl { font-size: 12px; color: #9ca3af; margin-top: 2px; }
.stat-divider { width: 1px; background: #f3f4f6; }

/* 信息网格 */
.info-grid { display: flex; flex-direction: column; gap: 4px; }
.info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f9fafb; }
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 14px; color: #6b7280; }
.info-value { font-size: 14px; color: #111827; font-weight: 500; }

/* 操作列表 */
.action-list { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.action-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; border-bottom: 1px solid #f9fafb; cursor: pointer; transition: background 0.15s; }
.action-item:active { background: #f9fafb; }
.action-item:last-child { border-bottom: none; }
.action-left { display: flex; align-items: center; gap: 12px; }
.action-left span { font-size: 15px; color: #374151; font-weight: 500; }
.action-item.danger .action-left span { color: #dc2626; }

.action-icon {
  width: 34px; height: 34px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.action-icon.edit { background: #eff6ff; color: #2563eb; }
.action-icon.lock { background: #fef3c7; color: #d97706; }
.action-icon.logout { background: #fef2f2; color: #dc2626; }

/* 弹窗适配 */
.mobile-dialog :deep(.el-dialog__body) { padding: 20px; }
.mobile-dialog :deep(.el-form-item) { margin-bottom: 18px; }
.mobile-dialog :deep(.el-dialog__header) { padding: 20px 20px 0; }
</style>
