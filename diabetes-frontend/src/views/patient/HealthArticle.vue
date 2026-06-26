<template>
  <div class="health-article">
    <div class="page-header anim-fade-up">
      <h3>健康资讯</h3>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs anim-fade-up" style="animation-delay:0.1s">
      <div
        v-for="cat in categories"
        :key="cat.key"
        class="cat-tag"
        :class="{ active: activeCategory === cat.key }"
        @click="activeCategory = cat.key"
      >
        <span class="cat-icon">{{ cat.icon }}</span>
        <span>{{ cat.label }}</span>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="article-list anim-stagger">
      <div v-for="item in filteredList" :key="item.id" class="article-card" @click="goDetail(item.id)">
        <div class="article-cover" :style="{ backgroundImage: `linear-gradient(135deg, ${getGradient(item.category)})` }">
          <span class="cover-category">{{ item.category }}</span>
        </div>
        <div class="article-body">
          <div class="article-title">{{ item.title }}</div>
          <div class="article-summary">{{ item.summary || '暂无摘要' }}</div>
          <div class="article-footer">
            <span class="article-author">{{ item.author }}</span>
            <span class="article-views">
              <el-icon :size="12"><View /></el-icon>
              {{ item.views || 0 }}
            </span>
          </div>
        </div>
      </div>
      <div v-if="filteredList.length === 0" class="empty-state">
        <el-icon :size="40" color="#cbd5e0"><Reading /></el-icon>
        <p>暂无资讯</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { View } from "@element-plus/icons-vue";
import { articleApi } from "../../api/index.js";

const router = useRouter();
const articles = ref([]);
const activeCategory = ref("all");

const categories = [
  { key: "all", label: "全部", icon: "📋" },
  { key: "饮食", label: "饮食", icon: "🍎" },
  { key: "运动", label: "运动", icon: "🏃" },
  { key: "用药", label: "用药", icon: "💊" },
  { key: "科普", label: "科普", icon: "📖" },
  { key: "并发症", label: "并发症", icon: "⚠️" },
];

const filteredList = computed(() => {
  if (activeCategory.value === "all") return articles.value;
  return articles.value.filter(a => a.category === activeCategory.value);
});

const getGradient = (cat) => {
  const map = { "饮食": "#48bb78,#38a169", "运动": "#4299e1,#2b6cb0", "用药": "#ed8936,#dd6b20", "科普": "#667eea,#764ba2", "并发症": "#fc8181,#e53e3e" };
  return map[cat] || "#a0aec0,#718096";
};

const goDetail = (id) => router.push(`/patient/article/detail/${id}`);

onMounted(async () => {
  const res = await articleApi.listPublished();
  if (res.code === 200) articles.value = res.data || [];
});
</script>

<style scoped>
.health-article { padding: 0 16px 20px; max-width: 500px; margin: 0 auto; }
.page-header { padding: 16px 0 12px; }
.page-header h3 { font-size: 20px; font-weight: 700; color: #1a202c; }

/* 分类标签 */
.category-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.category-tabs::-webkit-scrollbar { display: none; }
.cat-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 20px;
  background: #fff;
  color: #4a5568;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: all 0.2s;
  border: 1.5px solid transparent;
}
.cat-tag.active {
  background: #ebf4ff;
  color: #2b6cb0;
  border-color: #2b6cb0;
  font-weight: 600;
}
.cat-icon { font-size: 15px; }

/* 文章卡片 - 增高版 */
.article-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s;
}
.article-card:active { transform: scale(0.98); }
.article-cover {
  height: 120px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 12px;
  background-size: cover;
}
.cover-category {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(4px);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #2d3748;
}
.article-body { padding: 14px 16px 16px; }
.article-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.article-summary {
  font-size: 13px;
  color: #718096;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #a0aec0;
}
.article-views { display: flex; align-items: center; gap: 3px; }
.empty-state {
  text-align: center;
  padding: 48px 0;
  color: #a0aec0;
}
.empty-state p { margin-top: 12px; font-size: 14px; }
</style>
