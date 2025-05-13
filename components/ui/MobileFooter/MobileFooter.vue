<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import TextHoverEffect from "../TextHoverEffect/TextHoverEffect.vue";
import { useRouter } from "vue-router";

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

const containerRef = ref<HTMLElement | null>(null);
const shouldBreak = ref(false);

function checkShouldBreak() {
  if (!containerRef.value) return;
  if (window.innerWidth < 600) {
    shouldBreak.value = true;
    return;
  }
  const testSpan = document.createElement("span");
  testSpan.style.visibility = "hidden";
  testSpan.style.position = "absolute";
  testSpan.style.whiteSpace = "nowrap";
  testSpan.style.fontSize = "13px";
  testSpan.style.fontWeight = "400";
  testSpan.textContent = props.text.full;
  document.body.appendChild(testSpan);
  const fits =
    testSpan.offsetWidth <= containerRef.value.offsetWidth - 76 - 30 - 32;
  shouldBreak.value = !fits;
  document.body.removeChild(testSpan);
}
onMounted(() => {
  checkShouldBreak();
  window.addEventListener("resize", checkShouldBreak);
});
watch(() => props.text.full, checkShouldBreak);

const line2NoColon = computed(() => props.text.line2.replace(/[:：]\s*$/, ""));

// Navigation map for footer cells, including Questions
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
// Helper for address Google Maps link
function getMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
</script>

<template>
  <footer
    class="mobile-footer"
    :class="{ rtl: props.isRTL }"
    :dir="props.isRTL ? 'rtl' : 'ltr'"
    ref="containerRef"
    :data-fulltext="props.text.full"
  >
    <!-- Logo -->
    <div class="footer-logo-wrapper">
      <img
        src="/logo.svg"
        alt="Agency Logo"
        class="footer-logo"
        draggable="false"
      />
    </div>
    <!-- Slogan -->
    <div class="footer-slogan" :class="{ 'with-break': shouldBreak }">
      <template v-if="shouldBreak">
        <span class="line1">{{ props.text.line1 }}</span>
        <span class="line2">{{ line2NoColon }}</span>
      </template>
      <template v-else>
        <span class="full">{{ props.text.full }}</span>
      </template>
    </div>
    <!-- Table -->
    <div class="footer-table-wrapper">
      <table class="footer-table">
        <tbody>
          <tr v-for="(row, i) in props.table" :key="i">
            <td
              v-for="(cell, j) in row"
              :key="j"
              :class="[
                props.isRTL ? 'align-right' : 'align-left',
                {
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
                },
              ]"
            >
              <!-- Phone -->
              <a
                v-if="
                  cell === 'Phone number' ||
                  cell === 'מספר טלפון' ||
                  cell === 'Телефон'
                "
                :href="`tel:${props.phone.replace(/[^+\d]/g, '')}`"
                class="footer-table-action phone-ltr"
                dir="ltr"
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
                :href="getMapsUrl('Barnaul, ул. Ярных, д.35, оф.10')"
                class="footer-table-action"
                target="_blank"
                rel="noopener noreferrer"
                tabindex="0"
              >
                {{ props.address }}
              </a>
              <!-- Navigation links including Questions -->
              <NuxtLink
                v-else-if="navMap[cell]"
                :to="navMap[cell]"
                class="footer-table-action"
                tabindex="0"
              >
                {{ cell }}
              </NuxtLink>
              <!-- Plain cell -->
              <span v-else>{{ cell }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </footer>
  <TextHoverEffect :lang="props.lang" />
</template>

<style scoped>
.mobile-footer {
  background: #2b2d3a;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
  color: #eff3ff;
  padding-bottom: 50px;
}
.mobile-footer.rtl {
  direction: rtl;
}
.footer-logo-wrapper {
  margin-top: 30px;
  width: 102px;
  display: flex;
  justify-content: center;
}
.footer-logo {
  width: 102px;
  height: auto;
  display: block;
}
.footer-slogan {
  margin-top: 14px;
  margin-bottom: -31px;
  text-align: center;
  font-size: 13px;
  font-weight: 400;
  color: #eff3ff;
  line-height: 1.2;
  letter-spacing: 0.06em;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.footer-slogan .line1 {
  margin-bottom: 2px;
}
.footer-slogan .line2 {
  margin-top: px;
}
.footer-slogan .full {
  margin: 0;
}
.footer-table-wrapper {
  margin-top: 43px;
  display: flex;
  justify-content: center;
}
.footer-table {
  border-collapse: separate;
  border-spacing: 0 27px;
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
  table-layout: auto;
}
.footer-table td {
  border: none;
  padding: 0;
  font-size: 13px;
  color: #eff3ff;
  font-weight: 400;
  white-space: normal;
  text-align: left;
  vertical-align: middle;
  overflow: visible;
  text-overflow: initial;
  word-break: break-word;
}
.footer-table td.align-right {
  text-align: right;
}
.footer-table td.align-left {
  text-align: left;
}
.phone-ltr {
  direction: ltr !important;
  unicode-bidi: embed;
  text-align: left !important;
  display: inline-block;
}

/* Only hover/focus color for links; otherwise, look like normal text */
.footer-table-link .footer-table-action,
.footer-table-link .footer-table-action:visited {
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
.footer-table-link .footer-table-action:hover,
.footer-table-link .footer-table-action:focus {
  color: #4990fa;
  text-decoration: none;
  outline: none;
}

@media (max-width: 800px) {
  .mobile-footer {
    font-size: 13px;
  }
  .footer-table-wrapper {
    width: calc(100% - 20px);
    margin-left: 10px;
    margin-right: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .footer-table td {
    font-size: 13px;
  }
}
</style>
