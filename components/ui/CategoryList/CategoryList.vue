<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import CategoryContainer from "../CategoryContainer/CategoryContainer.vue";

const props = defineProps<{
  categories: { id: number; name: string }[];
  activeId: number | null;
  onCategoryClick: (id: number) => void;
  isRTL?: boolean;
}>();

const orderedCategories = computed(() =>
  props.isRTL ? [...props.categories].reverse() : props.categories,
);

const isWide = ref(
  typeof window !== "undefined" ? window.innerWidth >= 1120 : false,
);

function handleResize() {
  isWide.value = window.innerWidth >= 1120;
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div
    class="category-list"
    :class="[{ rtl: isRTL, wide: isWide }]"
    role="list"
  >
    <CategoryContainer
      v-for="cat in orderedCategories"
      :key="cat.id"
      :label="cat.name"
      :active="activeId === cat.id"
      :onClick="() => onCategoryClick(cat.id)"
    />
  </div>
</template>

<style scoped>
@import "@/assets/css/variables.css";

/* Default: wrap with min 40px gap */
.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 40px 40px;
  margin-bottom: 24px;
  align-items: center;
  justify-content: flex-start;
}

.category-list.rtl {
  flex-direction: row-reverse;
}

/* Wide mode: single row, space-between, no gap (gap handled by space-between) */
.category-list.wide {
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 0;
}

/* Mobile styles */
@media (max-width: 800px) {
  .category-list,
  .category-list.wide {
    flex-wrap: wrap !important;
    justify-content: flex-start !important;
    gap: var(--category-container-mobile-gap-y)
      var(--category-container-mobile-gap-x) !important;
  }
}
</style>
