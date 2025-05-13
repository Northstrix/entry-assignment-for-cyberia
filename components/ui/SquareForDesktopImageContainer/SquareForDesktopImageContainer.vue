<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
const props = defineProps<{
  title: string;
  isRTL?: boolean;
  active: boolean;
  isActiveCard: boolean;
}>();
function getWords(title: string) {
  return title.split(" ").filter(Boolean);
}
const textFits = ref(false);
const measureSpan = ref<HTMLElement | null>(null);
function getSquareWidth(): number {
  const el = document.documentElement;
  const val = getComputedStyle(el).getPropertyValue("--image-card-square-size");
  return val ? parseFloat(val) : 122;
}
function checkFits() {
  nextTick(() => {
    if (!measureSpan.value) {
      textFits.value = false;
      return;
    }
    const squareWidth = getSquareWidth() - 2;
    textFits.value = measureSpan.value.offsetWidth <= squareWidth;
  });
}
onMounted(() => {
  checkFits();
});
watch(
  () => props.title,
  () => checkFits(),
);
</script>
<template>
  <div
    class="image-card-decor"
    :class="{
      'square-visible': active,
      'square-hidden': !active,
      active: isActiveCard,
    }"
  >
    <!-- Lines (always above square) -->
    <div class="image-card-lines" :class="{ rtl: isRTL, active: isActiveCard }">
      <div class="line line1"></div>
      <div class="line line2"></div>
      <div class="line line3"></div>
      <div class="line line4"></div>
    </div>
    <!-- Square -->
    <div
      class="image-card-square"
      :class="{ rtl: isRTL, active: isActiveCard }"
    >
      <div class="image-card-square-content">
        <div class="square-text-container" :class="{ rtl: isRTL }">
          <template v-if="textFits">
            <div
              class="square-line"
              :class="{ rtl: isRTL, active: isActiveCard }"
              :style="{ textAlign: isRTL ? 'right' : 'left' }"
            >
              {{ title.replace(/\s+/g, " ") }}
            </div>
          </template>
          <template v-else>
            <div
              v-for="(word, i) in getWords(title)"
              :key="i"
              class="square-line"
              :class="{ rtl: isRTL, active: isActiveCard }"
              :style="{ textAlign: isRTL ? 'right' : 'left' }"
            >
              {{ word }}
            </div>
          </template>
          <span
            ref="measureSpan"
            class="measure-span"
            :style="{
              visibility: 'hidden',
              position: 'absolute',
              whiteSpace: 'pre',
              fontSize: 'var(--image-card-square-text-size)',
              fontWeight: 700,
              fontFamily: 'inherit',
              padding: 0,
              margin: 0,
            }"
          >
            {{ title.replace(/\s+/g, " ") }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.image-card-decor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 3;
  opacity: 1;
  transition: opacity 0.32s;
}
.square-visible {
  opacity: 1;
  transition: opacity 0.32s;
}
.square-hidden {
  opacity: 0;
  transition: opacity 0.32s;
}
.image-card-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  pointer-events: none;
  transition: opacity 0.32s;
}
.image-card-lines .line {
  position: absolute;
  background: var(--image-card-line-color);
  border-radius: none;
  transition: background 0.32s;
}
.image-card-lines.active .line {
  background: var(--image-card-line-color-active);
  transition: background 0.32s;
}
.image-card-lines .line1 {
  width: 5px;
  height: var(--image-card-line1-length);
  top: var(--image-card-line1-top);
  right: var(--image-card-line1-right);
}
.image-card-lines .line2 {
  width: var(--image-card-line2-length);
  height: 5px;
  top: var(--image-card-line2-top);
  right: var(--image-card-line2-right);
}
.image-card-lines .line3 {
  width: var(--image-card-line3-length);
  height: 5px;
  top: var(--image-card-line3-top);
  right: var(--image-card-line3-right);
}
.image-card-lines .line4 {
  width: 5px;
  height: var(--image-card-line4-length);
  top: var(--image-card-line4-top);
  right: var(--image-card-line4-right);
}
.image-card-lines.rtl .line1,
.image-card-lines.rtl .line2,
.image-card-lines.rtl .line3,
.image-card-lines.rtl .line4 {
  right: auto;
}
.image-card-lines.rtl .line1 {
  left: var(--image-card-line1-right);
}
.image-card-lines.rtl .line2 {
  left: var(--image-card-line2-right);
}
.image-card-lines.rtl .line3 {
  left: var(--image-card-line3-right);
}
.image-card-lines.rtl .line4 {
  left: var(--image-card-line4-right);
}
.image-card-square {
  position: absolute;
  width: var(--image-card-square-size);
  height: var(--image-card-square-size);
  background: var(--image-card-square-bg);
  border-radius: var(--image-card-square-radius);
  top: var(--image-card-square-top);
  right: var(--image-card-square-right);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  opacity: 1;
  transition:
    opacity 0.32s,
    background 0.32s;
  pointer-events: none;
}
.image-card-square.active {
  background: var(--image-card-square-bg-active);
  transition: background 0.32s;
}
.image-card-square.rtl {
  right: auto;
  left: var(--image-card-square-right);
}
.image-card-square-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.square-text-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: var(--image-card-square-line-gap);
  position: relative;
}
.square-text-container.rtl {
  align-items: flex-end;
  text-align: right;
}
.square-line {
  font-family: inherit;
  font-size: var(--image-card-square-text-size);
  font-weight: 700;
  line-height: 1.2;
  color: var(--image-card-square-text-color);
  white-space: pre;
  transition: color 0.32s;
}
.square-line.active {
  color: var(--image-card-square-text-color-active);
  transition: color 0.32s;
}
.square-line.rtl {
  text-align: right;
}
.measure-span {
  pointer-events: none;
  user-select: none;
  height: 0;
  overflow: hidden;
}
</style>
