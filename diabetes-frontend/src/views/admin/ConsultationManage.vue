<template>
  <div class="consult-manage">
    <h3 class="page-title">咨询管理</h3>

    <el-card shadow="never">
      <el-table :data="consultations" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="50" />
        <el-table-column prop="user_name" label="用户" width="70" />
        <el-table-column prop="content" label="咨询内容" min-width="120" show-overflow-tooltip />
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === '已回复' ? 'success' : 'warning'" size="small">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="showReply(scope.row)" v-if="scope.row.status === '待回复'">回复</el-button>
            <el-button size="small" @click="showDetail(scope.row)" v-else>查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="replyVisible" :title="'回复咨询 #'+current.id" width="95%" top="10vh">
      <div class="consult-question">
        <strong>用户咨询：</strong>{{ current.content }}
      </div>
      <el-input v-model="replyContent" type="textarea" :rows="4" placeholder="请输入回复内容..." style="margin-top: 12px" />
      <template #footer>
        <el-button @click="replyVisible = false">取消</el-button>
        <el-button type="primary" @click="handleReply">确认回复</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { consultationApi } from "../../api/index.js";

const consultations = ref([]);
const replyVisible = ref(false);
const current = ref({});
const replyContent = ref("");

const loadData = async () => {
  const res = await consultationApi.listAll();
  if (res.code === 200) consultations.value = res.data || [];
};

const showReply = (row) => {
  current.value = row;
  replyContent.value = "";
  replyVisible.value = true;
};

const showDetail = (row) => {
  current.value = row;
  replyContent.value = row.reply || "";
  replyVisible.value = true;
};

const handleReply = async () => {
  if (!replyContent.value.trim()) return ElMessage.warning("请输入回复内容");
  await consultationApi.reply({ id: current.value.id, reply: replyContent.value });
  ElMessage.success("回复成功");
  replyVisible.value = false;
  loadData();
};

onMounted(loadData);
</script>

<style scoped>
.consult-manage { max-width: 600px; margin: 0 auto; }
.page-title { font-size: 20px; margin-bottom: 16px; }
.consult-question { background: #f5f7fa; padding: 12px; border-radius: 8px; font-size: 14px; line-height: 1.6; }
</style>
