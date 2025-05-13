<script setup lang="ts">
defineProps<{ label: string; active: boolean; onClick: () => void }>();
</script>

<template>
  <button
    class="category-container"
    :class="{ active }"
    type="button"
    @click="onClick"
  >
    <span class="category-label">{{ label }}</span>
  </button>
</template>

<style scoped>
@import "@/assets/css/variables.css";

.category-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: var(--category-container-bg);
  border-radius: var(--category-container-radius);
  height: var(--category-container-height);
  padding: 0 var(--category-container-padding-x);
  font-size: var(--category-container-font-size);
  font-weight: var(--category-container-font-weight);
  color: var(--category-container-foreground); /* <-- Use the variable here! */
  box-shadow: var(--category-container-shadow);
  border: none;
  outline: none;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  width: auto;
  min-width: 0;
  transition:
    background 0.3s,
    box-shadow 0.15s;
}
.category-container.active {
  background: var(--category-container-active-bg);
}
.category-container:not(.active):hover {
  background: var(--category-container-hover-bg);
}
.category-label {
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
@media (max-width: 800px) {
  .category-container {
    height: var(--category-container-mobile-height);
    font-size: var(--category-container-mobile-font-size);
    padding: 0 var(--category-container-mobile-padding-x);
    width: var(--category-container-mobile-width);
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}
</style>
