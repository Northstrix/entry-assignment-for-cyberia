<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import ChronicleButton from "../ChronicleButton/ChronicleButton.vue";
const props = defineProps<{
  isOpen: boolean;
  currentLang: string;
  languages: Array<{ code: string; name: string; flag: string }>;
}>();
const emit = defineEmits(["select", "close"]);
const componentWidth = ref("402px");
const isMobile = ref(false);
const handleResize = () => {
  isMobile.value = window.innerWidth < 442;
  componentWidth.value = isMobile.value ? "calc(100vw - 48px)" : "402px";
};
onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
function handleLanguageSelect(code: string) {
  emit("select", code);
}
function handleClose() {
  emit("close");
}
</script>
<template>
  <Teleport to="body">
    <div v-if="isOpen" class="lang-modal-backdrop">
      <div class="lang-modal-outer">
        <div
          class="lang-modal-inner"
          :class="{ mobile: isMobile }"
          :style="{ width: componentWidth }"
          dir="ltr"
        >
          <h2 class="lang-modal-title">Language</h2>
          <div class="lang-list">
            <div
              v-for="lang in languages"
              :key="lang.code"
              class="lang-list-item"
              :class="{
                active: currentLang === lang.code,
                hebrew: lang.code === 'he',
              }"
              @click="handleLanguageSelect(lang.code)"
            >
              <template v-if="lang.code === 'he'">
                <img
                  :src="lang.flag"
                  :alt="lang.name"
                  class="lang-flag"
                  width="123"
                  height="auto"
                />
                <span class="lang-name lang-hebrew">{{ lang.name }}</span>
              </template>
              <template v-else>
                <img
                  :src="lang.flag"
                  :alt="lang.name"
                  class="lang-flag"
                  width="123"
                  height="auto"
                />
                <span class="lang-name">{{ lang.name }}</span>
              </template>
            </div>
          </div>
          <div class="lang-modal-btn">
            <div v-if="isMobile" class="btn-mobile-wrap">
              <ChronicleButton
                text="OK"
                :isMobile="true"
                @click="handleClose"
              />
            </div>
            <ChronicleButton
              v-else
              text="OK"
              :isMobile="false"
              @click="handleClose"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
.lang-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--lang-modal-overlay);
  backdrop-filter: blur(3px) saturate(90%);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.lang-modal-outer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
.lang-modal-inner {
  background: var(--lang-modal-bg);
  color: var(--lang-modal-foreground);
  padding: 20px 20px 37px 20px;
  border-radius: var(--lang-modal-rounding);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  min-width: 240px;
  box-shadow: 0 8px 32px rgba(30, 40, 90, 0.16);
  margin: 0 8px;
  align-items: center;
  overflow-x: hidden;
  font-size: 22px;
  pointer-events: all;
  direction: ltr;
}
.lang-modal-inner.mobile {
  width: calc(100vw - 48px) !important;
  min-width: 0;
  max-width: 100vw;
  border-radius: var(--lang-modal-rounding);
  padding: 10px 10px 37px 10px;
  margin: 24px 0 0 0;
  font-size: 18px;
}
.lang-modal-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 1.45em;
  font-weight: bold;
  color: var(--lang-modal-foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
.lang-list {
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 1;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 0 6px;
  box-sizing: border-box;
}
.lang-list-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: var(--lang-list-item-rounding, 10px);
  cursor: pointer;
  background: var(--lang-list-item-bg);
  padding: 16px 24px;
  transition: background 0.15s;
  width: 100%;
  min-width: 0;
  overflow-x: hidden;
  box-sizing: border-box;
  gap: 8px;
  direction: ltr;
}
.lang-list-item.hebrew {
  direction: rtl;
  justify-content: flex-end;
}
.lang-list-item:hover {
  background: var(--lang-list-item-hover-bg);
}
.lang-list-item.active {
  background: var(--lang-list-item-active-bg);
}
.lang-flag {
  width: 123px;
  height: auto;
  object-fit: contain;
  border-radius: var(--flag-rounding);
  background: transparent; /* <-- FIXED */
  flex-shrink: 0;
}
.lang-name {
  word-break: keep-all;
  white-space: normal;
  font-size: inherit;
  line-height: 1.2;
  color: var(--lang-modal-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 12px;
}
.lang-list-item.hebrew .lang-name.lang-hebrew {
  margin-left: 0;
  margin-right: 12px;
  text-align: right;
  width: 100%;
  flex: 1 1 auto;
}
.lang-modal-btn {
  display: flex;
  margin-top: 16px;
  justify-content: center;
  width: 100%;
}
.btn-mobile-wrap {
  width: 160px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
</style>
