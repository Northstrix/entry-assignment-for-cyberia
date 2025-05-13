<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps<{
  modelValue: boolean;
  label: string;
  isRTL?: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);

const checked = ref(props.modelValue);
const isSvgHovered = ref(false);

// For SVG mask
const OUTLINE_SIZE = 25;
const OUTLINE_RADIUS = 4;
const NOTCH_WIDTH = 0;
const NOTCH_HEIGHT = 8;
const NOTCH_X = props.isRTL ? OUTLINE_SIZE - NOTCH_WIDTH - 3 : 3;
const NOTCH_Y = -2;

// Unique id for mask
const uid = Math.random().toString(36).substr(2, 9);

watch(
  () => props.modelValue,
  (val) => {
    checked.value = val;
  },
);
watch(checked, (val) => {
  emit("update:modelValue", val);
});
</script>

<template>
  <label class="svg-checkbox" :class="{ rtl: props.isRTL }">
    <input
      type="checkbox"
      v-model="checked"
      class="svg-checkbox__input"
      tabindex="0"
    />
    <span
      class="svg-checkbox__svgbox"
      @mouseenter="isSvgHovered = true"
      @mouseleave="isSvgHovered = false"
    >
      <svg
        :width="OUTLINE_SIZE"
        :height="OUTLINE_SIZE"
        :viewBox="`0 0 ${OUTLINE_SIZE} ${OUTLINE_SIZE}`"
      >
        <defs>
          <mask :id="`svg-checkbox-mask-${uid}`">
            <!-- Full box -->
            <rect
              x="0"
              y="0"
              :width="OUTLINE_SIZE"
              :height="OUTLINE_SIZE"
              :rx="OUTLINE_RADIUS"
              fill="white"
            />
            <!-- Notch (if you want a notch for the label) -->
            <rect
              :x="NOTCH_X"
              :y="NOTCH_Y"
              :width="NOTCH_WIDTH"
              :height="NOTCH_HEIGHT"
              fill="black"
              rx="2"
              ry="2"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          :width="OUTLINE_SIZE"
          :height="OUTLINE_SIZE"
          :rx="OUTLINE_RADIUS"
          fill="none"
          :stroke="isSvgHovered ? '#2d76f9' : '#eff3ff'"
          stroke-width="3"
          :mask="`url(#svg-checkbox-mask-${uid})`"
          class="svg-checkbox__rect"
        />
        <polyline
          v-if="checked"
          points="6,13 11,18 19,8"
          fill="none"
          :stroke="isSvgHovered ? '#2d76f9' : '#b5cfff'"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="svg-checkbox__check"
        />
      </svg>
    </span>
    <span class="svg-checkbox__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.svg-checkbox {
  display: flex;
  align-items: center;
  font-size: 16px;
  letter-spacing: 0.051em;
  cursor: pointer;
  user-select: none;
  position: relative;
}
.svg-checkbox.rtl {
  flex-direction: row-reverse;
}
.svg-checkbox__input {
  /* Hide native checkbox but keep accessible */
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.svg-checkbox__svgbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  min-width: 25px;
  min-height: 25px;
  position: relative;
}
.svg-checkbox__rect,
.svg-checkbox__check {
  transition: stroke 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}
.svg-checkbox__label {
  margin-left: 13px;
  margin-right: 13px;
  line-height: 1.2;
  color: #eff3ff;
  /* This ensures spacing on both sides for RTL/LTR */
}
/* For RTL, flip margins */
.svg-checkbox.rtl .svg-checkbox__label {
  margin-left: 13px;
  margin-right: 13px;
  text-align: right;
}
</style>
