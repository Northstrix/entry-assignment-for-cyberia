<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from "vue";

// Props
const props = defineProps<{
  isOpen: boolean;
  isRTL: boolean;
  navbarLabels: Record<string, string>;
  contactLabel: string;
  contacts: { phone: string; email: string; address: string };
  onClose: () => void;
}>();

function getMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

// Prevent scroll when open
watch(
  () => props.isOpen,
  (val) => {
    document.body.style.overflow = val ? "hidden" : "";
  },
);

onUnmounted(() => {
  document.body.style.overflow = "";
});

// Close on ESC
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === "Escape" && props.isOpen) props.onClose();
  };
  window.addEventListener("keydown", handler);
  onUnmounted(() => window.removeEventListener("keydown", handler));
});

// Navigation keys except contacts
const navKeys = computed(() =>
  Object.keys(props.navbarLabels).filter((k) => k !== "contacts"),
);
const contactsKey = "contacts";
</script>

<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="mobile-full-menu"
      :class="{ rtl: props.isRTL }"
      tabindex="-1"
      aria-modal="true"
      role="dialog"
    >
      <!-- Close Button -->
      <button
        class="close-btn"
        @click="props.onClose"
        aria-label="Close menu"
        :style="{
          top: '46px',
          [props.isRTL ? 'left' : 'right']: '37px',
          width: '24px',
          height: '24px',
        }"
      >
        <svg width="24" height="24" viewBox="0 0 20 20">
          <line
            x1="3"
            y1="3"
            x2="17"
            y2="17"
            stroke="#eff3ff"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="17"
            y1="3"
            x2="3"
            y2="17"
            stroke="#eff3ff"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <div class="menu-inner" :class="{ rtl: props.isRTL }">
        <!-- Spacer: 64px below padding -->
        <div style="height: 64px"></div>
        <!-- Navigation Links -->
        <nav class="menu-links" aria-label="Main menu">
          <ul>
            <li v-for="key in navKeys" :key="key" :class="{ rtl: props.isRTL }">
              <NuxtLink :to="'/' + key" @click="props.onClose">
                {{ props.navbarLabels[key] }}
              </NuxtLink>
            </li>
            <!-- Contacts as last nav item -->
            <li :class="{ rtl: props.isRTL }">
              <NuxtLink :to="'/contacts'" @click="props.onClose">
                {{ props.navbarLabels[contactsKey] }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <!-- Separator below links -->
        <div class="separator" />
        <!-- Contacts Section -->
        <div class="contacts-section" :class="{ rtl: props.isRTL }">
          <!-- Contacts label with ":" -->
          <div class="contacts-label" :class="{ rtl: props.isRTL }">
            <template v-if="!props.isRTL">
              <span>{{ props.navbarLabels[contactsKey] }}</span
              ><span class="colon">:</span>
            </template>
            <template v-else>
              <span class="colon">:</span
              ><span>{{ props.navbarLabels[contactsKey] }}</span>
            </template>
          </div>
          <!-- Spacer 35px below label -->
          <div style="height: 35px"></div>
          <!-- Contact info, 52px below label -->
          <div class="contacts-info">
            <div class="contact-line">
              <!-- Phone: always LTR, but align right in RTL -->
              <a
                :href="`tel:${props.contacts.phone}`"
                class="force-ltr"
                :class="{ rtl: props.isRTL }"
                >{{ props.contacts.phone }}</a
              >
            </div>
            <div class="contact-line">
              <a :href="`mailto:${props.contacts.email}`">{{
                props.contacts.email
              }}</a>
            </div>
            <div class="contact-line">
              <a
                :href="getMapsUrl(props.contacts.address)"
                target="_blank"
                rel="noopener noreferrer"
                >{{ props.contacts.address }}</a
              >
            </div>
          </div>
        </div>
        <!-- Separator below contacts -->
        <div class="separator" style="margin-top: 43px" />
        <!-- Spacer 181px below separator -->
        <div style="height: 181px"></div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Apply letter-spacing to all text inside the component */
.mobile-full-menu,
.mobile-full-menu * {
  letter-spacing: 0.04em;
}

/* Main container */
.mobile-full-menu {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #24252f;
  color: #eff3ff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  overflow-y: auto;
  animation: fadeIn 0.2s;
}

.mobile-full-menu.rtl {
  direction: rtl;
}

.menu-inner {
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.menu-inner.rtl {
  align-items: flex-end;
}

.close-btn {
  position: absolute;
  background: none;
  border: none;
  color: #eff3ff;
  cursor: pointer;
  padding: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-links {
  width: 100%;
}

.menu-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.menu-links li {
  margin-bottom: 33px;
  text-align: left;
}

.menu-links li:first-child {
  margin-top: -4px;
}

.menu-links li:last-child {
  margin-bottom: 48px;
}

.menu-links li.rtl {
  text-align: right;
}

.menu-links a {
  color: #eff3ff;
  font-size: 18px;
  font-weight: 400;
  text-decoration: none;
  transition: color 0.32s;
}

.menu-links a:hover {
  color: #4990fa;
}

/* Separator */
.separator {
  width: calc(100% - 24px);
  margin-left: 0;
  margin-right: 0;
  height: 2px;
  background: #343645;
  align-self: stretch;
  margin-bottom: 0;
}

.menu-inner.rtl .separator {
  margin-left: auto;
  margin-right: 0;
}

.menu-inner:not(.rtl) .separator {
  margin-right: auto;
  margin-left: 0;
}

/* Contacts Section */
.contacts-section {
  width: 100%;
  margin-top: 40px;
  text-align: left;
}

.contacts-section.rtl {
  text-align: right;
}

.contacts-label {
  color: #9aa8ba;
  font-size: 18px;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 0px;
  justify-content: flex-start;
}

.contacts-label.rtl {
  flex-direction: row-reverse;
  justify-content: flex-end;
}

.colon {
  margin-left: 0;
  margin-right: 0;
}

.contacts-label.rtl .colon {
  margin-right: 0;
  margin-left: 0;
}

.contacts-info {
  margin-top: 9px;
  display: flex;
  flex-direction: column;
  gap: 19px;
}

.contact-line {
  color: #9aa8ba;
  font-size: 18px;
  font-weight: 400;
  word-break: break-word;
  text-align: inherit;
}

.contact-line a {
  color: #9aa8ba;
  text-decoration: none;
  font-size: inherit;
  font-weight: inherit;
  transition: color 0.32s;
}

/* Force phone number to always render left-to-right, but align right in RTL */
.force-ltr {
  direction: ltr !important;
  unicode-bidi: embed !important;
  /* Inherit alignment from parent (rtl or ltr) */
  display: inline-block;
  width: 100%;
  text-align: inherit;
}

.contact-line a:hover {
  color: #4990fa;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
