<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from "vue";

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

// --- NOTCH PADDING VARIABLES --- //
const NOTCH_PADDING_LTR_LEFT = 10;
const NOTCH_PADDING_LTR_RIGHT = 0;
const NOTCH_PADDING_RTL_LEFT = 0;
const NOTCH_PADDING_RTL_RIGHT = 10;

// Label direction
function detectLabelDir(text: string) {
  return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text) ? "rtl" : "ltr";
}
const labelDir = computed(() => detectLabelDir(props.label));

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

// --- Notch/outline measurements --- //
const LABEL_HEIGHT = 20;
const OUTLINE_HEIGHT = 139;
const groupRef = ref<HTMLElement | null>(null);
const labelRef = ref<HTMLElement | null>(null);

const outlineWidth = ref(0);
const notchWidth = ref(60);

function measure() {
  nextTick(() => {
    if (groupRef.value) outlineWidth.value = groupRef.value.offsetWidth;
    if (labelRef.value) {
      const baseWidth = labelRef.value.offsetWidth;
      const leftPad = isRTLInput.value
        ? NOTCH_PADDING_RTL_LEFT
        : NOTCH_PADDING_LTR_LEFT;
      const rightPad = isRTLInput.value
        ? NOTCH_PADDING_RTL_RIGHT
        : NOTCH_PADDING_LTR_RIGHT;
      notchWidth.value = Math.max(baseWidth + leftPad + rightPad, 60);
    }
  });
}
onMounted(measure);
watch([() => props.label, () => props.textarea, isRTLInput], measure);
watch(() => props.modelValue, measure);

// Unique mask id per instance
const uid = Math.random().toString(36).substr(2, 9);

// Notch X position (in px, relative to outlineWidth)
const notchX = computed(() => {
  const padding = 24;
  if (!outlineWidth.value) return 0;
  if (!isRTLInput.value) {
    return padding;
  } else {
    return outlineWidth.value - padding - notchWidth.value;
  }
});
</script>

<template>
  <div
    class="mobile-form-group"
    ref="groupRef"
    :class="{ rtl: isRTLInput, textarea: textarea }"
  >
    <svg
      v-if="outlineWidth"
      class="notched-outline"
      :width="outlineWidth"
      :height="OUTLINE_HEIGHT"
      :viewBox="`0 0 ${outlineWidth} ${OUTLINE_HEIGHT}`"
      aria-hidden="true"
      focusable="false"
      style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      "
    >
      <defs>
        <mask :id="`notch-mask-${uid}`">
          <rect
            x="0"
            y="0"
            :width="outlineWidth"
            :height="OUTLINE_HEIGHT"
            rx="8"
            fill="white"
          />
          <rect
            :x="notchX"
            y="-5"
            :width="notchWidth"
            :height="LABEL_HEIGHT"
            fill="black"
            rx="0"
            ry="0"
          />
        </mask>
      </defs>
      <rect
        x="0"
        y="0"
        :width="outlineWidth"
        :height="OUTLINE_HEIGHT"
        rx="8"
        fill="none"
        stroke="#eff3ff"
        stroke-width="3"
        :mask="`url(#notch-mask-${uid})`"
        class="notched-outline-rect"
      />
    </svg>
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
      style="background: transparent; position: relative; z-index: 3"
    />
    <label
      ref="labelRef"
      class="mobile-form-label"
      :class="{ 'label-textarea': textarea }"
      :dir="labelDir"
      :style="
        !isRTLInput
          ? {
              top: '0',
              left: '24px',
              right: 'auto',
              fontSize: '18px',
              background: 'transparent',
              paddingLeft: `${NOTCH_PADDING_LTR_LEFT}px`,
              paddingRight: `${NOTCH_PADDING_LTR_RIGHT}px`,
              zIndex: 2,
              height: `${LABEL_HEIGHT}px`,
              lineHeight: `${LABEL_HEIGHT}px`,
            }
          : {
              top: '0',
              right: '24px',
              left: 'auto',
              fontSize: '18px',
              background: 'transparent',
              paddingLeft: `${NOTCH_PADDING_RTL_LEFT}px`,
              paddingRight: `${NOTCH_PADDING_RTL_RIGHT}px`,
              zIndex: 2,
              height: `${LABEL_HEIGHT}px`,
              lineHeight: `${LABEL_HEIGHT}px`,
            }
      "
      >{{ label }}</label
    >
  </div>
</template>

<style scoped>
:root {
  --desktop-form-input-font-size: 13px;
  --desktop-form-input-font-weight: 400;
  --desktop-form-input-color: #eff3ff;
  --desktop-form-input-border: #d4d9e6;
  --desktop-form-input-border-active: #2d76f9;
  --desktop-form-label-color: #eff3ff;
  --desktop-form-label-active-color: #2d76f9;
  --desktop-form-input-bg: transparent;
  --desktop-form-input-radius: 8px;
  --desktop-form-input-padding: 13px;
  --desktop-form-multi-line-input-height: 61px;
  --desktop-form-input-gap: 22px;
  --desktop-form-textarea-lines: 7;
  --desktop-form-textarea-line-height: 1.4;
  --project-inquiry-mobile-bg: #23242d;
}
.mobile-form-group {
  position: relative;
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: var(--desktop-form-input-gap);
}
.mobile-form-group:last-child {
  margin-bottom: 0;
}
.mobile-form-group.textarea {
  min-height: calc(
    var(--desktop-form-multi-line-input-height) *
      var(--desktop-form-textarea-lines)
  );
}
.mobile-form-input {
  width: 100%;
  height: var(--desktop-form-multi-line-input-height);
  padding: var(--desktop-form-input-padding);
  font-size: var(--desktop-form-input-font-size);
  font-weight: var(--desktop-form-input-font-weight);
  color: var(--desktop-form-input-color);
  background: var(--desktop-form-input-bg);
  border: none;
  border-radius: var(--desktop-form-input-radius);
  outline: none;
  box-sizing: border-box;
  text-align: left;
  transition: border 0.2s;
  resize: none;
  line-height: var(--desktop-form-textarea-line-height);
  position: relative;
  z-index: 3;
}
.mobile-form-group.rtl .mobile-form-input {
  direction: rtl;
  text-align: right;
}
.mobile-form-group.textarea .mobile-form-input {
  height: calc(
    var(--desktop-form-multi-line-input-height) *
      var(--desktop-form-textarea-lines)
  );
  min-height: calc(
    var(--desktop-form-multi-line-input-height) *
      var(--desktop-form-textarea-lines)
  );
  max-height: calc(
    var(--desktop-form-multi-line-input-height) *
      var(--desktop-form-textarea-lines)
  );
  overflow-y: auto;
}
.mobile-form-label {
  position: absolute;
  left: var(--desktop-form-input-padding);
  top: 50%;
  transform: translateY(-50%);
  color: var(--desktop-form-label-color);
  font-size: 18px;
  font-weight: var(--desktop-form-input-font-weight);
  pointer-events: none;
  background: transparent;
  padding: 0 8px;
  transition:
    color 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    all 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  max-width: calc(100% - 26px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 20px;
  line-height: 20px;
}
.mobile-form-group.rtl .mobile-form-label {
  right: var(--desktop-form-input-padding);
  left: auto;
  text-align: right;
}
.notched-outline {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.notched-outline-rect {
  transition: stroke 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}
/* --- HOVER EFFECTS --- */
.mobile-form-group:hover .mobile-form-label {
  color: #4990fa;
  transition: color 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-form-group:hover .notched-outline-rect {
  stroke: #4990fa !important;
  transition: stroke 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
