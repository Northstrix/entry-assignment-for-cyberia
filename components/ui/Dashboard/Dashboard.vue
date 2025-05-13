<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onBeforeUnmount } from "vue";
import RectangleNotification from "~/components/ui/RectangleNotification/RectangleNotification.vue";
import ChronicleButton from "~/components/ui/ChronicleButton/ChronicleButton.vue";
import { fetchAndDecryptResponses } from "~/components/crypto/fetchAndDecryptResponses";
import type { DecryptedResponse } from "~/components/crypto/fetchAndDecryptResponses";

const props = defineProps<{ mlkemPrivateKey: Uint8Array }>();

const responses = ref<DecryptedResponse[]>([]);
const notificationType = ref<"processing" | "error" | null>(null);
const notificationMessage = ref("");
const notificationMessage1 = ref("");
const notificationVisible = ref(false);
const notificationInscription = ref<string | undefined>(undefined);

const OWNER_EMAIL = "server-owner@whatever.xyz";
const isMobile = ref(false);

function updateIsMobile() {
  isMobile.value = window.innerWidth <= 800;
}

function showNotification(
  type: "processing" | "error",
  message: string,
  message1 = "",
) {
  notificationType.value = type;
  notificationMessage.value = message;
  notificationMessage1.value = message1;
  notificationInscription.value = undefined;
  notificationVisible.value = true;
}

function hideNotification() {
  notificationVisible.value = false;
  notificationType.value = null;
}

async function loadResponses() {
  try {
    responses.value = [];
    showNotification(
      "processing",
      "Decrypting responses",
      "Please wait for a while",
    );
    const recs = await fetchAndDecryptResponses(
      props.mlkemPrivateKey,
      OWNER_EMAIL,
    );
    responses.value = recs;
    await nextTick();
    autoGrowAllTextareas();
  } catch (e) {
    showNotification("error", "Something went wrong", "Check the console");
    console.error("Dashboard fetch/decrypt error:", e);
  } finally {
    hideNotification();
  }
}

function handleRefresh() {
  responses.value = [];
  loadResponses();
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
    hour12: true,
  };
  let formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  formattedDate = formattedDate.replace(
    /^(\d{1}):(\d{2}):(\d{2})\s(AM|PM)/,
    " $1:$2:$3 $4",
  );
  return formattedDate;
}

// --- Auto-grow logic ---
function autoGrowTextarea(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

function autoGrowAllTextareas() {
  nextTick(() => {
    document
      .querySelectorAll<HTMLTextAreaElement>(".message-textarea")
      .forEach(autoGrowTextarea);
  });
}

// Watch responses for changes (like after refresh)
watch(responses, () => {
  autoGrowAllTextareas();
});

// --- Resize handler ---
function handleResize() {
  autoGrowAllTextareas();
}

onMounted(() => {
  updateIsMobile();
  window.addEventListener("resize", updateIsMobile);
  window.addEventListener("resize", handleResize);
  loadResponses();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateIsMobile);
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div class="dashboard-overlay" :class="{ mobile: isMobile }">
    <RectangleNotification
      v-if="notificationType"
      :type="notificationType"
      :message="notificationMessage"
      :message1="notificationMessage1"
      :isVisible="notificationVisible"
      :alertInscription="notificationInscription"
      @close="hideNotification"
    />
    <div class="dashboard-content">
      <h1>Owner Dashboard</h1>
      <div class="responses-cards-container">
        <div
          v-for="(resp, idx) in responses"
          :key="resp.id"
          class="response-card"
          :class="{ broken: resp.integrityFailed }"
        >
          <div class="response-id">ID: {{ resp.id }}</div>
          <div class="response-row">
            <span class="field-label">Name:</span>
            <span class="field-value">{{ resp.name }}</span>
          </div>
          <div class="response-row">
            <span class="field-label">Email:</span>
            <span class="field-value">{{ resp.email }}</span>
          </div>
          <div class="response-row">
            <span class="field-label">Phone:</span>
            <span class="field-value">{{ resp.phone }}</span>
          </div>
          <div class="response-row">
            <span class="field-label">Platform:</span>
            <span class="field-value">{{ resp.platform }}</span>
          </div>
          <div class="response-row">
            <span class="field-label">Submission Date:</span>
            <span class="field-value">
              <span v-if="resp.submittedAt">{{
                formatDate(resp.submittedAt)
              }}</span>
              <span v-else>-</span>
            </span>
          </div>
          <div class="response-row message-row">
            <span class="field-label">Message:</span>
            <textarea
              class="message-textarea"
              :value="resp.message"
              readonly
              rows="1"
              style="overflow: hidden; resize: none"
              @input="autoGrowTextarea($event.target)"
              @focus="autoGrowTextarea($event.target)"
              ref="autoGrowTextarea"
            ></textarea>
          </div>
        </div>
        <div v-if="responses.length === 0" class="no-responses-card">
          No responses found
        </div>
      </div>
      <div class="refresh-btn-row">
        <ChronicleButton
          text="Refresh"
          :onClick="handleRefresh"
          :isMobile="true"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: var(--navbar-bg-mobile, #23243b);
  color: var(--category-container-foreground, #fff);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: top 0.2s;
}
.dashboard-overlay.mobile {
  top: 68px;
  height: calc(100vh - 68px);
}
.dashboard-content {
  background: rgba(40, 44, 52, 0.95);
  border-radius: 6px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.22);
  min-width: 340px;
  max-width: 100%;
  width: 100vw;
  max-height: 100vh;
  height: 100vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.5rem;
  overflow: auto;
}
.dashboard-overlay.mobile .dashboard-content {
  height: calc(100vh - 68px);
  max-height: calc(100vh - 68px);
}
.responses-cards-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 22px;
  align-items: stretch;
}
.response-card {
  width: 100%;
  background: rgba(0, 0, 0, 0.07);
  border: 2px solid var(--category-container-active-bg, #4990fa);
  border-radius: 8px;
  padding: 18px 18px 12px 18px;
  box-sizing: border-box;
  color: var(--category-container-foreground, #fff);
  transition:
    border-color 0.15s,
    color 0.15s;
  text-align: left;
  word-break: break-word;
}
.response-card.broken {
  border-color: #f55;
  color: #f55 !important;
}
.response-id {
  font-size: 0.95rem;
  font-family: monospace;
  color: var(--category-container-active-bg, #4990fa);
  margin-bottom: 12px;
  word-break: break-all;
}
.response-card.broken .response-id {
  color: #f55 !important;
}
.response-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 9px;
  border-bottom: 1px solid var(--category-container-hover-bg, #3e4b6b);
  padding-bottom: 7px;
}
.response-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.field-label {
  font-weight: bold;
  min-width: 110px;
  color: var(--category-container-foreground, #fff);
}
.response-card.broken .field-label,
.response-card.broken .field-value {
  color: #f55 !important;
}
.field-value {
  flex: 1;
  word-break: break-word;
  white-space: pre-line;
}
.message-row {
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 0;
}
.message-textarea {
  width: 100%;
  min-height: 32px;
  background: transparent;
  color: inherit;
  border: 1px solid var(--category-container-hover-bg, #3e4b6b);
  border-radius: 4px;
  font-size: 1rem;
  padding: 6px;
  box-sizing: border-box;
  word-break: break-all;
  white-space: pre-line;
  overflow-wrap: break-word;
  margin-top: 4px;
  outline: none;
  transition: height 0.1s;
  /* No max-height, no scrollbars! */
}
.no-responses-card {
  width: 100%;
  text-align: center;
  padding: 32px 0;
  color: #aaa;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
}
.refresh-btn-row {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}
</style>
