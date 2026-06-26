<template>
  <div class="chat-page">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <div class="chat-header-left">
        <div class="chat-ai-avatar">
          <el-icon :size="20" color="#fff"><MagicStick /></el-icon>
        </div>
        <div>
          <div class="chat-title">智能助手</div>
          <div class="chat-status">在线 · 随时为您服务</div>
        </div>
      </div>
    </div>

    <!-- 对话区 -->
    <div class="chat-messages" ref="msgRef">
      <div v-if="messages.length === 0" class="welcome-area anim-fade-in">
        <div class="welcome-icon">
          <el-icon :size="48" color="#2563eb"><MagicStick /></el-icon>
        </div>
        <h4>您好！我是您的健康助手</h4>
        <p class="welcome-desc">关于糖尿病、饮食、运动等问题都可以问我</p>
        <div class="quick-questions">
          <div v-for="q in quickQuestions" :key="q" class="q-chip" @click="sendMessage(q)">
            {{ q }}
          </div>
        </div>
      </div>

      <div v-for="(msg, i) in messages" :key="i" class="msg-item" :class="msg.role" :style="{ animationDelay: i * 0.05 + 's' }">
        <div class="msg-avatar" v-if="msg.role === 'ai'">
          <el-icon :size="18" color="#fff"><MagicStick /></el-icon>
        </div>
        <div class="msg-bubble">{{ msg.content }}</div>
        <div class="msg-avatar user-avatar" v-if="msg.role === 'user'">
          <span>{{ userInitial }}</span>
        </div>
      </div>

      <div v-if="loading" class="msg-item ai">
        <div class="msg-avatar"><el-icon :size="18" color="#fff"><MagicStick /></el-icon></div>
        <div class="msg-bubble typing">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        </div>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="chat-input-bar">
      <el-input
        v-model="inputMsg"
        placeholder="输入您的问题..."
        :disabled="loading"
        @keyup.enter="sendMessage()"
        class="chat-input"
      >
        <template #append>
          <el-button
            @click="sendMessage"
            :disabled="loading || !inputMsg.trim()"
            class="send-btn"
            :icon="Promotion"
          />
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { Promotion } from "@element-plus/icons-vue";
import { chatApi } from "../../api/index.js";
import { useUserStore } from "../../store/index.js";

const userStore = useUserStore();
const messages = ref([]);
const inputMsg = ref("");
const loading = ref(false);
const msgRef = ref(null);

const userInitial = computed(() => (userStore.userInfo?.name || "U").charAt(0).toUpperCase());

const quickQuestions = [
  "糖尿病饮食需要注意什么？",
  "适合哪些运动？",
  "血糖正常值是多少？",
  "可以吃水果吗？",
  "怎么预防并发症？",
];

const sendMessage = async (text) => {
  const msg = text || inputMsg.value;
  if (!msg.trim() || loading.value) return;
  inputMsg.value = "";
  loading.value = true;

  messages.value.push({ role: "user", content: msg });
  scrollToBottom();

  try {
    const res = await chatApi.send({ userId: userStore.userId, query: msg, sessionId: "" });
    console.log("【AI响应】", res);
    if (res.code === 200) {
      const reply = res.data?.reply;
      if (reply) {
        messages.value.push({ role: "ai", content: reply });
      } else {
        console.error("【AI响应为空】", res);
        messages.value.push({ role: "ai", content: "抱歉，我暂时无法回答，请稍后再试。" });
      }
    } else {
      console.error("【AI响应异常】", res);
      messages.value.push({ role: "ai", content: "抱歉，我暂时无法回答，请稍后再试。" });
    }
  } catch (e) {
    console.error("【AI请求失败】", e);
    messages.value.push({ role: "ai", content: "抱歉，我暂时无法回答，请稍后再试。" });
  }
  loading.value = false;
  scrollToBottom();
};

const scrollToBottom = async () => {
  await nextTick();
  if (msgRef.value) msgRef.value.scrollTop = msgRef.value.scrollHeight;
};
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 52px - 60px);
  max-width: 480px;
  margin: 0 auto;
  background: #f8fafc;
}

/* 头部 */
.chat-header {
  background: #fff;
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.chat-header-left { display: flex; align-items: center; gap: 12px; }
.chat-ai-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-title { font-size: 16px; font-weight: 700; color: #111827; }
.chat-status { font-size: 11px; color: #059669; margin-top: 1px; }

/* 对话区 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  scroll-behavior: smooth;
}

/* 欢迎区 */
.welcome-area { text-align: center; padding: 32px 16px 16px; }
.welcome-icon { margin-bottom: 12px; }
.welcome-area h4 { font-size: 17px; color: #111827; font-weight: 600; }
.welcome-desc { font-size: 13px; color: #6b7280; margin: 6px 0 20px; }
.quick-questions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.q-chip {
  padding: 8px 16px;
  border-radius: 18px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid #dbeafe;
  transition: all 0.15s;
}
.q-chip:active { background: #dbeafe; transform: scale(0.96); }

/* 消息气泡 */
.msg-item {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease both;
}
.msg-item.user { flex-direction: row-reverse; }
.msg-avatar {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.msg-avatar.user-avatar {
  background: #f3f4f6;
  color: #374151;
  font-size: 14px;
  font-weight: 700;
}
.msg-bubble {
  max-width: 78%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}
.msg-item.ai .msg-bubble {
  background: #fff;
  color: #374151;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  border-bottom-left-radius: 4px;
}
.msg-item.user .msg-bubble {
  background: #2563eb;
  color: #fff;
  border-bottom-right-radius: 4px;
}

/* 打字动画 */
.typing { display: flex; gap: 4px; padding: 14px 20px !important; }
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #93c5fd;
  animation: pulse 1.4s infinite;
}
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes pulse { 0%,60%,100% { opacity: 0.3; } 30% { opacity: 1; } }

/* 输入区 */
.chat-input-bar {
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #f3f4f6;
  flex-shrink: 0;
}
.chat-input :deep(.el-input__wrapper) {
  border-radius: 24px !important;
  padding-left: 16px !important;
  background: #f9fafb;
}
.chat-input :deep(.el-input-group__append) {
  background: transparent;
  border: none;
  padding: 0;
}
.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50% !important;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
}
</style>
