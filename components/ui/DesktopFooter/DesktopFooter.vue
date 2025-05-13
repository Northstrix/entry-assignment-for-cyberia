<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, RouterLink } from "vue-router";

const props = defineProps<{
  text: { line1: string; line2: string; full: string };
  isRTL: boolean;
  table: string[][];
  phone: string;
  email: string;
  address: string;
  questions: string;
  lang: string;
}>();

const router = useRouter();
const containerRef = ref<HTMLElement | null>(null);

const navMap: Record<string, string> = {
  // English
  Agency: "/agency",
  Services: "/services",
  Cases: "/cases",
  Blog: "/blog",
  Contacts: "/contacts",
  Questions: "/questions",
  // Hebrew
  סוכנות: "/agency",
  שירותים: "/services",
  תיקים: "/cases",
  בלוג: "/blog",
  "צור קשר": "/contacts",
  שאלות: "/questions",
  // Russian
  Агентство: "/agency",
  Услуги: "/services",
  Кейсы: "/cases",
  Блог: "/blog",
  Контакты: "/contacts",
  Вопросы: "/questions",
};

function getMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

const isNarrow = ref(
  typeof window !== "undefined" ? window.innerWidth < 900 : false,
);

function handleResize() {
  isNarrow.value = window.innerWidth < 900;
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

// Computed values for sizes
const logoSize = computed(() => (isNarrow.value ? "172px" : "196px"));
const fontSize = computed(() => (isNarrow.value ? "16px" : "18px"));
</script>

<template>
  <footer
    class="desktop-footer"
    :class="{ rtl: props.isRTL }"
    :dir="props.isRTL ? 'rtl' : 'ltr'"
    :style="{ fontSize: fontSize }"
  >
    <div class="footer-container" ref="containerRef">
      <!-- Logo and Slogan block -->
      <div
        class="footer-logo-slogan"
        :class="{ 'footer-logo-slogan-rtl': props.isRTL }"
        :style="{
          flexBasis: logoSize,
          minWidth: logoSize,
          maxWidth: logoSize,
        }"
      >
        <div
          class="footer-logo-wrapper"
          :class="{ 'footer-logo-wrapper-rtl': props.isRTL }"
          :style="{ width: logoSize, minWidth: logoSize }"
        >
          <img
            src="/logo.svg"
            alt="Agency Logo"
            class="footer-logo"
            draggable="false"
            :style="{ width: logoSize }"
          />
        </div>
        <div
          class="footer-slogan"
          :class="{ 'footer-slogan-rtl': props.isRTL }"
          :dir="props.isRTL ? 'rtl' : 'ltr'"
        >
          <span class="line1">{{ props.text.line1 }}</span>
          <span class="line2">{{ props.text.line2 }}</span>
        </div>
      </div>
      <!-- Table block -->
      <div class="footer-table-outer">
        <div class="footer-table-wrapper">
          <table style="transform: translateY(-11px)" class="footer-table">
            <tbody>
              <tr v-for="(row, i) in props.table" :key="i">
                <td
                  v-for="(cell, j) in row"
                  :key="j"
                  class="footer-table-cell"
                  :class="{
                    'phone-ltr':
                      cell === 'Phone number' ||
                      cell === 'מספר טלפון' ||
                      cell === 'Телефон',
                    'footer-table-cell-rtl':
                      props.isRTL &&
                      !(
                        cell === 'Phone number' ||
                        cell === 'מספר טלפון' ||
                        cell === 'Телефон'
                      ),
                    'footer-table-link':
                      navMap[cell] ||
                      cell === 'Phone number' ||
                      cell === 'מספר טלפון' ||
                      cell === 'Телефон' ||
                      cell === 'email' ||
                      cell === 'אימייל' ||
                      cell === 'email' ||
                      cell === 'address' ||
                      cell === 'כתובת' ||
                      cell === 'адрес',
                  }"
                  :dir="
                    cell === 'Phone number' ||
                    cell === 'מספר טלפון' ||
                    cell === 'Телефон'
                      ? 'ltr'
                      : props.isRTL
                        ? 'rtl'
                        : 'ltr'
                  "
                  :style="{
                    textAlign:
                      cell === 'Phone number' ||
                      cell === 'מספר טלפון' ||
                      cell === 'Телефон'
                        ? 'left'
                        : props.isRTL
                          ? 'right'
                          : 'left',
                    fontSize: fontSize,
                  }"
                >
                  <!-- Phone -->
                  <a
                    v-if="
                      cell === 'Phone number' ||
                      cell === 'מספר טלפון' ||
                      cell === 'Телефон'
                    "
                    :href="`tel:${props.phone.replace(/[^+\d]/g, '')}`"
                    class="footer-table-action"
                    tabindex="0"
                  >
                    {{ props.phone }}
                  </a>
                  <!-- Email -->
                  <a
                    v-else-if="
                      cell === 'email' || cell === 'אימייל' || cell === 'email'
                    "
                    :href="`mailto:${props.email}`"
                    class="footer-table-action"
                    tabindex="0"
                  >
                    {{ props.email }}
                  </a>
                  <!-- Address -->
                  <a
                    v-else-if="
                      cell === 'address' || cell === 'כתובת' || cell === 'адрес'
                    "
                    :href="getMapsUrl(props.address)"
                    class="footer-table-action"
                    target="_blank"
                    rel="noopener noreferrer"
                    tabindex="0"
                  >
                    {{ props.address }}
                  </a>
                  <!-- Navigation links including Questions -->
                  <router-link
                    v-else-if="navMap[cell]"
                    :to="navMap[cell]"
                    class="footer-table-action"
                    tabindex="0"
                  >
                    {{ cell }}
                  </router-link>
                  <!-- Plain cell -->
                  <span v-else>{{ cell }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
@import "@/assets/css/variables.css";
.footer-table-link .footer-table-action {
  color: #eff3ff;
  background: none;
  border: none;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
  outline: none;
}
.footer-table-link .footer-table-action:hover {
  color: #4990fa;
  text-decoration: none;
  outline: none;
}
.desktop-footer {
  background: #313441;
  width: 100vw;
  min-width: 100vw;
  max-width: 100vw;
  height: 396px;
  color: #eff3ff;
  margin-top: 48px;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-weight: 400;
  /* font-size is controlled dynamically */
}
.footer-container {
  width: 100%;
  max-width: var(--content-area-max-width, 1288px);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--content-area-padding-x, 24px);
  padding-right: var(--content-area-padding-x, 24px);
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  position: relative;
}
/* Logo and slogan block: always at the edge */
.footer-logo-slogan {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 131px;
  flex: 0 0 196px;
  min-width: 196px;
  max-width: 196px;
  margin-left: 0;
  margin-right: auto;
}
.footer-logo-slogan-rtl {
  align-items: flex-end;
  margin-left: auto;
  margin-right: 0;
}
.footer-logo-wrapper {
  width: 196px;
  min-width: 196px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding-right: 0;
  padding-left: 0;
}
.footer-logo-wrapper-rtl {
  justify-content: flex-end;
  padding-right: 0 !important;
  padding-left: 0 !important;
  margin-right: 0 !important;
}
.footer-logo-slogan-rtl,
.footer-logo-wrapper-rtl {
  margin-right: 0 !important;
  padding-right: 0 !important;
}
.footer-logo {
  width: 196px;
  height: auto;
  display: block;
}
/* Slogan always 2 lines, 32px below logo */
.footer-slogan {
  margin-top: 32px;
  text-align: left;
  font-weight: 400;
  color: #eff3ff;
  line-height: 1.2;
  letter-spacing: 0.06em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}
.footer-slogan-rtl {
  text-align: right;
  align-items: flex-end;
  width: 100%;
  direction: rtl;
}
.footer-slogan .line1,
.footer-slogan .line2 {
  margin: 0;
  padding: 0;
  font-weight: 400;
  color: #eff3ff;
  transform: translateY(-3px);
  letter-spacing: 0.001em;
  width: 100%;
  box-sizing: border-box;
}
/* Table block: centered absolutely in the footer */
.footer-table-outer {
  position: absolute;
  left: 50%;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 0;
  transform: translateX(-50%);
  width: max-content;
}
.footer-table-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-width: 180px;
  pointer-events: auto;
}
.footer-table {
  border-collapse: separate;
  border-spacing: 0 23px;
  width: auto;
  margin: 0 auto;
  table-layout: auto;
}
.footer-table-cell {
  border: none;
  padding: 0 16px;
  color: #eff3ff;
  font-weight: 400;
  white-space: normal;
  vertical-align: middle;
  overflow: visible;
  text-overflow: initial;
  word-break: break-word;
  text-align: left;
}
.footer-table-cell-rtl {
  text-align: right;
}
.phone-ltr {
  direction: ltr !important;
  unicode-bidi: embed;
  text-align: left !important;
  display: inline-block;
}
@media (max-width: 800px) {
  .desktop-footer {
    height: auto;
    min-height: 320px;
    padding: 24px 0;
    font-size: 16px !important; /* fallback */
  }
  .footer-container {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 24px;
    height: auto;
    position: static;
  }
  .footer-logo-slogan,
  .footer-logo-slogan-rtl {
    align-items: center !important;
    margin-top: 0;
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100%;
    min-width: 0;
    max-width: none;
    position: static;
  }
  .footer-logo-wrapper,
  .footer-logo-wrapper-rtl {
    margin-bottom: 12px;
    height: auto;
    justify-content: center !important;
  }
  .footer-slogan,
  .footer-slogan-rtl {
    align-items: center !important;
    text-align: center !important;
  }
  .footer-table-outer {
    position: static;
    left: auto;
    top: auto;
    transform: none;
    width: 100%;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    height: auto;
  }
  .footer-table-wrapper {
    margin-top: 0;
    min-width: 0;
    width: 100%;
    justify-content: center;
  }
  .footer-table-cell {
    font-size: 16px;
    padding: 0 8px;
  }
}
</style>
