<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import MobileFloatingLabelInput from "../MobileFloatingLabelInput/MobileFloatingLabelInput.vue";
import ChronicleButton from "../ChronicleButton/ChronicleButton.vue";
import "./ProjectInquiryMobile.css";

const props = defineProps<{
  text: { line1: string; line2: string; full: string };
  isRTL: boolean;
  labels: { name: string; email: string; phone: string; message: string };
  sendText: string;
  consentLines: string[];
}>();

const containerRef = ref<HTMLElement | null>(null);
const shouldBreak = ref(false);

const emit = defineEmits<{
  (
    e: "submit",
    formData: { name: string; email: string; phone: string; message: string },
  ): void;
}>();

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
  testSpan.style.fontSize = "var(--project-inquiry-mobile-font-size)";
  testSpan.style.fontWeight = "var(--project-inquiry-mobile-font-weight)";
  testSpan.textContent = containerRef.value.dataset.fulltext || "";
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
watch(() => props.labels, checkShouldBreak, { deep: true });

const line2NoColon = computed(() => {
  return props.text.line2.replace(/[:：]\s*$/, "");
});

const name = ref("");
const email = ref("");
const phone = ref("");
const message = ref("");

function handleSend() {
  const formData = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    message: message.value,
  };
  emit("submit", formData);
}
</script>

<template>
  <div
    class="project-inquiry-mobile"
    :class="{ rtl: props.isRTL }"
    :dir="props.isRTL ? 'rtl' : 'ltr'"
    ref="containerRef"
    :data-fulltext="props.text.full"
  >
    <template v-if="props.isRTL">
      <div class="mobile-inquiry-text" :class="{ 'with-break': shouldBreak }">
        <template v-if="shouldBreak">
          <span class="line1">{{ props.text.line1 }}</span>
          <span class="line2">{{ line2NoColon }}</span>
        </template>
        <template v-else>
          <span class="full">{{ props.text.full }}</span>
        </template>
      </div>
      <img
        src="/mailbox.svg"
        alt="Mailbox"
        class="mailbox-icon mirrored"
        draggable="false"
      />
    </template>
    <template v-else>
      <img
        src="/mailbox.svg"
        alt="Mailbox"
        class="mailbox-icon"
        draggable="false"
      />
      <div class="mobile-inquiry-text" :class="{ 'with-break': shouldBreak }">
        <template v-if="shouldBreak">
          <span class="line1">{{ props.text.line1 }}</span>
          <span class="line2">{{ line2NoColon }}</span>
        </template>
        <template v-else>
          <span class="full">{{ props.text.full }}</span>
        </template>
      </div>
    </template>
    <!-- Inputs below the top row, full width -->
    <div class="mobile-inquiry-form">
      <MobileFloatingLabelInput
        v-model="name"
        :label="props.labels.name"
        :isRTL="props.isRTL"
        required
      />
      <MobileFloatingLabelInput
        v-model="email"
        :label="props.labels.email"
        type="email"
        :isRTL="props.isRTL"
        required
      />
      <MobileFloatingLabelInput
        v-model="phone"
        :label="props.labels.phone"
        type="tel"
        :isRTL="props.isRTL"
      />
      <MobileFloatingLabelInput
        v-model="message"
        :label="props.labels.message"
        textarea
        :isRTL="props.isRTL"
        required
      />
      <div style="height: 9px"></div>
      <ChronicleButton
        :text="props.sendText"
        :isMobile="true"
        :onClick="handleSend"
      />
      <div class="mobile-inquiry-consent">
        <template v-for="(line, i) in props.consentLines" :key="i">
          <div>{{ line }}</div>
        </template>
      </div>
    </div>
  </div>
</template>
