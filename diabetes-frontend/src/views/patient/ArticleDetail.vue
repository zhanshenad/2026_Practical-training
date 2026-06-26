<template>
  <div class="article-detail">
    <div class="detail-header">
      <el-button text @click="$router.back()" class="back-btn">
        <el-icon><ArrowLeft /></el-icon> 返回
      </el-button>
    </div>

    <div v-if="article" class="detail-content anim-fade-up">
      <div class="detail-cover" :style="{ background: `linear-gradient(135deg, #2b6cb0, #1a365d)` }">
        <span class="detail-category-tag">{{ article.category }}</span>
      </div>
      <div class="detail-body-wrap">
        <h1 class="detail-title">{{ article.title }}</h1>
        <div class="detail-meta">
          <span class="meta-author">{{ article.author }}</span>
          <span class="meta-divider">·</span>
          <span>{{ formatTime(article.createdTime) }}</span>
          <span class="meta-divider">·</span>
          <span>{{ article.views }} 次阅读</span>
        </div>
        <div class="detail-body" v-html="article.content"></div>
      </div>
    </div>
    <div v-else class="loading-state">
      <div class="skeleton" style="height:200px;margin-bottom:16px"></div>
      <div class="skeleton" style="height:24px;width:70%;margin-bottom:12px"></div>
      <div class="skeleton" style="height:16px;margin-bottom:8px"></div>
      <div class="skeleton" style="height:16px;width:85%;margin-bottom:8px"></div>
      <div class="skeleton" style="height:16px;width:60%"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { articleApi } from "../../api/index.js";

const route = useRoute();
const article = ref(null);

const formatTime = (t) => t ? t.slice(0, 10) : "";

onMounted(async () => {
  const res = await articleApi.getById(route.params.id);
  if (res.code === 200) article.value = res.data;
});
</script>

<style scoped>
.article-detail { padding-bottom: 24px; max-width: 500px; margin: 0 auto; }
.detail-header {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
  padding: 8px 16px;
  border-bottom: 1px solid #edf2f7;
}
.back-btn { color: #4a5568; font-size: 14px; }
.detail-cover {
  height: 180px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 16px;
}
.detail-category-tag {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(4px);
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  color: #2b6cb0;
}
.detail-body-wrap { padding: 20px 16px; }
.detail-title { font-size: 22px; font-weight: 700; line-height: 1.35; margin-bottom: 12px; color: #1a202c; }
.detail-meta { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #a0aec0; margin-bottom: 20px; }
.meta-divider { color: #e2e8f0; }
.detail-body { font-size: 15px; line-height: 1.8; color: #2d3748; }
.detail-body img { max-width: 100%; border-radius: 10px; margin: 16px 0; }
.detail-body h3 { font-size: 18px; margin: 20px 0 10px; color: #1a202c; }
.detail-body p { margin-bottom: 12px; }
.loading-state { padding: 20px 16px; }
</style>
