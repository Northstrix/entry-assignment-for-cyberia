<script setup lang="ts">
const props = defineProps<{
  navbarLabels: Record<string, string>;
  isRTL?: boolean;
}>();
const emit = defineEmits(["close"]);
const navItems = [
  { key: "agency", href: "/agency" },
  { key: "services", href: "/services" },
  { key: "cases", href: "/cases" },
  { key: "blog", href: "/blog" },
  { key: "contacts", href: "/contacts" },
];
</script>

<template>
  <div class="burger-menu-overlay" :class="{ rtl: isRTL }">
    <div class="burger-menu-content">
      <button
        class="burger-menu-close"
        @click="emit('close')"
        aria-label="Close menu"
      >
        ✕
      </button>
      <nav class="burger-menu-nav">
        <ul>
          <li v-for="item in navItems" :key="item.key">
            <NuxtLink :to="item.href" @click="emit('close')">
              {{ navbarLabels[item.key] || item.key }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.burger-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: var(--burger-overlay-bg);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.burger-menu-content {
  width: 100vw;
  padding: 32px var(--navbar-area-padding-x) 0 var(--navbar-area-padding-x);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.burger-menu-close {
  font-size: 2.5rem;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  align-self: flex-end;
}
.burger-menu-nav ul {
  list-style: none;
  padding: 0;
  margin: 48px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.burger-menu-nav a {
  color: #fff;
  font-size: 2rem;
  text-decoration: none;
  font-weight: 400;
  transition: color 0.2s;
}
.burger-menu-nav a:hover {
  color: var(--navbar-link-hover);
}
.burger-menu-overlay.rtl .burger-menu-content,
.burger-menu-overlay.rtl .burger-menu-nav ul {
  align-items: flex-start;
  text-align: right;
}
</style>
