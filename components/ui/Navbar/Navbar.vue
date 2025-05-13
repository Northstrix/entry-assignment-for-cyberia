<script setup lang="ts">
import LanguageIcon from "~/components/ui/LanguageIcon/LanguageIcon.vue";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

const props = defineProps<{
  navbarLabels: Record<string, string>;
  isRTL?: boolean;
}>();
const emit = defineEmits(["openLanguageSelector", "openBurgerMenu"]);

const navItems = [
  { key: "agency", href: "/agency" },
  { key: "services", href: "/services" },
  { key: "cases", href: "/cases" },
  { key: "blog", href: "/blog" },
  { key: "contacts", href: "/contacts" },
];

const isMobile = ref(false);
function checkMobile() {
  isMobile.value = window.innerWidth <= 800;
}
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
});

// Compute the style for the lang button
const langBtnStyle = computed(() => {
  if (isMobile.value) return {}; // On mobile, margin is handled by CSS
  return props.isRTL
    ? { marginRight: "32px", marginLeft: "0" }
    : { marginLeft: "32px", marginRight: "0" };
});
</script>

<template>
  <nav
    class="navbar"
    :class="{ rtl: props.isRTL }"
    aria-label="Main navigation"
  >
    <div class="navbar__container">
      <NuxtLink to="/" class="navbar__logo" aria-label="Home">
        <img
          src="/logo.svg"
          alt="Logo"
          :class="['navbar__logo-img', { mobile: isMobile }]"
        />
      </NuxtLink>
      <ul v-if="!isMobile" class="navbar__menu">
        <li v-for="item in navItems" :key="item.key" class="navbar__menu-item">
          <NuxtLink :to="item.href" class="navbar__menu-link">
            {{ props.navbarLabels[item.key] || item.key }}
          </NuxtLink>
        </li>
      </ul>
      <!-- Desktop: Language button only -->
      <button
        v-if="!isMobile"
        class="navbar__lang-btn"
        :style="langBtnStyle"
        aria-label="Select language"
        @click="emit('openLanguageSelector')"
      >
        <LanguageIcon :width="32" />
      </button>
      <!-- Mobile: Order depends on RTL/LTR -->
      <div
        v-if="isMobile"
        class="navbar__mobile-icons"
        :class="{ rtl: props.isRTL }"
      >
        <template v-if="!props.isRTL">
          <button
            class="navbar__lang-btn"
            aria-label="Select language"
            @click="emit('openLanguageSelector')"
          >
            <LanguageIcon :width="32" />
          </button>
          <button
            class="navbar__burger"
            aria-label="Open menu"
            @click="emit('openBurgerMenu')"
          >
            <span class="navbar__burger-stripe" />
            <span class="navbar__burger-stripe" />
            <span class="navbar__burger-stripe" />
          </button>
        </template>
        <template v-else>
          <button
            class="navbar__burger"
            aria-label="Open menu"
            @click="emit('openBurgerMenu')"
          >
            <span class="navbar__burger-stripe" />
            <span class="navbar__burger-stripe" />
            <span class="navbar__burger-stripe" />
          </button>
          <button
            class="navbar__lang-btn"
            aria-label="Select language"
            @click="emit('openLanguageSelector')"
          >
            <LanguageIcon :width="32" />
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@import "@/assets/css/variables.css";
.navbar {
  width: 100%;
  box-sizing: border-box;
  padding-top: var(--navbar-desktop-padding-y);
  padding-bottom: var(--navbar-desktop-padding-y);
  background: transparent;
}
.navbar.rtl {
  direction: rtl;
}
.navbar__container {
  max-width: var(--navbar-area-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--navbar-area-padding-x);
  padding-right: var(--navbar-area-padding-x);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}
.navbar__logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}
.navbar__logo-img {
  height: 28px;
  width: auto;
  display: block;
  transition: height 0.2s;
}
.navbar__logo-img.mobile {
  height: 20px;
}
.navbar__menu {
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  gap: 40px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.navbar__menu-link {
  color: var(--navbar-link-color);
  font-size: var(--navbar-link-font-size-desktop);
  font-weight: var(--navbar-link-font-weight);
  text-decoration: none;
  transition: color 0.2s;
}
.navbar__menu-link:hover {
  color: var(--navbar-link-hover);
}

.navbar__lang-btn {
  background: none;
  border: none;
  padding: 0;
  /* margin-left or margin-right is handled dynamically */
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: filter 0.2s;
}
.navbar__lang-btn:hover :deep(img) {
  filter: drop-shadow(0 0 0 #4990fa);
}
/* Burger icon desktop */
.navbar__burger {
  background: none;
  border: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  align-items: flex-end;
  justify-content: center;
}
.navbar__burger-stripe {
  width: 100%;
  height: 4px;
  background: #fff;
  border-radius: 2px;
  display: block;
  transition: background 0.2s;
}
.navbar__burger:hover .navbar__burger-stripe {
  background: var(--navbar-link-hover);
}
/* MOBILE */
@media (max-width: 800px) {
  .navbar {
    padding-top: calc(var(--navbar-mobile-padding-y) - 8px) !important;
    padding-bottom: calc(var(--navbar-mobile-padding-y) - 8px) !important;
    background: var(--navbar-bg-mobile);
    width: 100vw;
  }
  .navbar__container {
    padding-left: var(--navbar-area-padding-x);
    padding-right: var(--navbar-area-padding-x);
  }
  .navbar__menu-link {
    font-size: var(--navbar-link-font-size-mobile);
  }
  .navbar__menu {
    display: none;
  }
  .navbar__logo-img {
    height: 20px;
  }
  .navbar__mobile-icons {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-left: auto;
  }
  .navbar__mobile-icons.rtl {
    flex-direction: row-reverse;
    margin-left: 0;
    margin-right: auto;
  }
  .navbar__lang-btn {
    margin-left: 0;
    margin-right: 0;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .navbar__burger {
    width: 26px;
    height: 16px;
    gap: 4px;
    align-items: flex-end;
    justify-content: center;
  }
  .navbar__burger-stripe {
    height: 4px;
  }
}
</style>
