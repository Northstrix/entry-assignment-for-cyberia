<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";

const props = defineProps<{
  modelValue: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  isRTL?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const inputValue = ref(props.modelValue || "");
const isFocused = ref(false);
const isRTLInput = ref(props.isRTL || false);

// Detect direction of label text
function detectLabelDir(text: string) {
  return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text) ? "rtl" : "ltr";
}
const labelDir = computed(() => detectLabelDir(props.label));

const isActive = computed(() => isFocused.value);
const hasValue = computed(() => inputValue.value.length > 0);

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
  emit("update:modelValue", value);
  inputValue.value = value;
  updateDir();
}

function onFocus() {
  isFocused.value = true;
  updateDir();
}
function onBlur() {
  isFocused.value = false;
  updateDir();
}

function updateDir() {
  if (!inputValue.value) {
    isRTLInput.value = props.isRTL || false;
    return;
  }
  isRTLInput.value = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(
    inputValue.value,
  );
}
watch(
  () => props.modelValue,
  (v) => {
    inputValue.value = v || "";
    updateDir();
  },
);
watch(() => props.label, updateDir);
watch(() => props.isRTL, updateDir);
onMounted(() => updateDir());
</script>

<template>
  <div
    class="mobile-form-group"
    :class="{
      rtl: isRTLInput,
      active: isActive,
      'has-value': hasValue,
      textarea: textarea,
    }"
  >
    <component
      :is="textarea ? 'textarea' : 'input'"
      class="mobile-form-input"
      :type="type || 'text'"
      :required="required"
      :value="modelValue"
      :dir="isRTLInput ? 'rtl' : 'ltr'"
      :rows="textarea ? 7 : undefined"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      autocomplete="off"
    />
    <label
      class="mobile-form-label"
      :class="{ 'label-textarea': textarea }"
      :dir="labelDir"
      >{{ label }}</label
    >
  </div>
</template>

<style scoped>
:root {
  --mobile-form-input-font-size: 13px;
  --mobile-form-input-font-weight: 400;
  --mobile-form-input-color: #eff3ff;
  --mobile-form-input-border: #d4d9e6;
  --mobile-form-input-border-active: #2d76f9;
  --mobile-form-label-color: #eff3ff;
  --mobile-form-label-active-color: #2d76f9;
  --mobile-form-input-bg: transparent;
  --mobile-form-input-radius: 8px;
  --mobile-form-input-padding: 13px;
  --mobile-form-input-height: 52px;
  --mobile-form-input-gap: 22px;
  --mobile-form-textarea-lines: 7;
  --mobile-form-textarea-line-height: 1.4;
  --project-inquiry-mobile-bg: #23242d;
}

.mobile-form-group {
  position: relative;
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: var(--mobile-form-input-gap);
}
.mobile-form-group:last-child {
  margin-bottom: 0;
}
.mobile-form-group.textarea {
  min-height: calc(
    var(--mobile-form-input-height) * var(--mobile-form-textarea-lines)
  );
}
.mobile-form-input {
  width: 100%;
  height: var(--mobile-form-input-height);
  padding: var(--mobile-form-input-padding);
  font-size: var(--mobile-form-input-font-size);
  font-weight: var(--mobile-form-input-font-weight);
  color: var(--mobile-form-input-color);
  background: var(--mobile-form-input-bg);
  border: 1px solid var(--mobile-form-input-border);
  border-radius: var(--mobile-form-input-radius);
  outline: none;
  box-sizing: border-box;
  text-align: left;
  transition: border 0.2s;
  resize: none;
  line-height: var(--mobile-form-textarea-line-height);
}
.mobile-form-group.rtl .mobile-form-input {
  direction: rtl;
  text-align: right;
}
.mobile-form-group.textarea .mobile-form-input {
  height: calc(
    var(--mobile-form-input-height) * var(--mobile-form-textarea-lines)
  );
  min-height: calc(
    var(--mobile-form-input-height) * var(--mobile-form-textarea-lines)
  );
  max-height: calc(
    var(--mobile-form-input-height) * var(--mobile-form-textarea-lines)
  );
  overflow-y: auto;
}
.mobile-form-label {
  position: absolute;
  left: var(--mobile-form-input-padding);
  top: 50%;
  transform: translateY(-50%);
  color: var(--mobile-form-label-color);
  font-size: var(--mobile-form-input-font-size);
  font-weight: var(--mobile-form-input-font-weight);
  pointer-events: none;
  background: var(--project-inquiry-mobile-bg, #23242d);
  padding: 0 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  max-width: calc(100% - 26px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mobile-form-group.rtl .mobile-form-label {
  right: var(--mobile-form-input-padding);
  left: auto;
  text-align: right;
}
.mobile-form-group:not(.active):not(.has-value) .mobile-form-label {
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--mobile-form-input-font-size);
  color: var(--mobile-form-label-color);
  background: transparent;
}
.mobile-form-group.active .mobile-form-label,
.mobile-form-group .mobile-form-input:focus + .mobile-form-label {
  top: 0;
  left: var(--mobile-form-input-padding);
  right: auto;
  font-size: 12px;
  color: var(--mobile-form-input-border-active); /* Match outline color */
  background: var(--project-inquiry-mobile-bg, #23242d);
  padding: 0 8px;
  z-index: 2;
}
.mobile-form-group.has-value:not(.active) .mobile-form-label {
  top: 0;
  left: var(--mobile-form-input-padding);
  right: auto;
  font-size: 12px;
  color: var(--mobile-form-input-border); /* Default outline color */
  background: var(--project-inquiry-mobile-bg, #23242d);
  padding: 0 8px;
  z-index: 2;
}
.mobile-form-group.rtl.active .mobile-form-label,
.mobile-form-group.rtl .mobile-form-input:focus + .mobile-form-label {
  right: var(--mobile-form-input-padding);
  left: auto;
}
.mobile-form-group.rtl.has-value:not(.active) .mobile-form-label {
  right: var(--mobile-form-input-padding);
  left: auto;
}
.mobile-form-input:focus {
  border: 1px solid var(--mobile-form-input-border-active);
}
.mobile-form-group.has-value:not(.active) .mobile-form-input {
  border: 1px solid var(--mobile-form-input-border);
}
.mobile-form-input:disabled {
  opacity: 0.5;
  pointer-events: none;
}
/* Multiline input: inactive label as text in first line */
.mobile-form-group.textarea:not(.active):not(.has-value) .mobile-form-label,
.mobile-form-group.textarea:not(.active):not(.has-value).rtl
  .mobile-form-label {
  top: 13px;
  left: var(--mobile-form-input-padding);
  right: auto;
  transform: none;
  font-size: var(--mobile-form-input-font-size);
  color: var(--mobile-form-label-color);
  background: transparent;
  padding: 0 8px;
  text-align: left;
}
.mobile-form-group.textarea:not(.active):not(.has-value).rtl
  .mobile-form-label {
  right: var(--mobile-form-input-padding);
  left: auto;
  text-align: right;
}
</style>
