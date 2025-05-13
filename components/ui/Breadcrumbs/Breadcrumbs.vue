<script setup lang="ts">
const props = defineProps<{
  items: Array<{ label: string; path: string }>;
  isRTL?: boolean;
}>();
</script>

<template>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol :class="{ rtl: isRTL }">
      <li v-for="(item, idx) in items" :key="item.path" class="breadcrumb-item">
        <template v-if="idx < items.length - 1">
          <NuxtLink :to="item.path" class="breadcrumb-link">
            {{ item.label }}
          </NuxtLink>
          <span class="breadcrumb-separator">{{ isRTL ? "\\" : "/" }}</span>
        </template>
        <template v-else>
          <span class="breadcrumb-current">{{ item.label }}</span>
        </template>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
@import "@/assets/css/variables.css";
.breadcrumbs {
  margin: 0;
}
.breadcrumbs ol {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  direction: ltr;
}
.breadcrumbs ol.rtl {
  direction: rtl;
}
.breadcrumb-item {
  display: flex;
  align-items: center;
  font-weight: var(--breadcrumbs-font-weight);
}
.breadcrumb-link {
  color: var(--breadcrumbs-color);
  font-size: var(--breadcrumbs-font-size-desktop);
  text-decoration: none;
  transition: color 0.2s;
}
.breadcrumb-link:hover,
.breadcrumb-link:focus {
  color: var(--breadcrumbs-active-color);
}
.breadcrumb-separator {
  margin: 0 5px;
  color: var(--breadcrumbs-color);
  font-size: var(--breadcrumbs-font-size-desktop);
}
.breadcrumb-current {
  color: var(--breadcrumbs-active-color);
  font-size: var(--breadcrumbs-font-size-desktop);
}
@media (max-width: 800px) {
  .breadcrumb-link,
  .breadcrumb-separator,
  .breadcrumb-current {
    font-size: var(--breadcrumbs-font-size-mobile);
  }
  .breadcrumb-separator {
    margin: 0 4px;
  }
}
</style>
