<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{ lang: string }>();

const inscription = computed(() => {
  if (props.lang === "he") return "קיבריה";
  if (props.lang === "ru") return "КИБЕРИЯ";
  return "CYBERIA";
});

// Font size settings per language
const fontSettings = computed(() => {
  if (props.lang === "he") return { min: 40, max: 90, minW: 375, maxW: 800 };
  if (props.lang === "ru") return { min: 40, max: 90, minW: 375, maxW: 800 };
  return { min: 40, max: 90, minW: 375, maxW: 800 };
});
const fontSize = ref(fontSettings.value.min);

function updateFontSize() {
  const { min, max, minW, maxW } = fontSettings.value;
  const w = window.innerWidth;
  if (w <= minW) fontSize.value = min;
  else if (w >= maxW) fontSize.value = max;
  else fontSize.value = min + ((w - minW) * (max - min)) / (maxW - minW);
}
onMounted(() => {
  updateFontSize();
  window.addEventListener("resize", updateFontSize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateFontSize);
});

// Hover/mask logic
const svgRef = ref<SVGSVGElement | null>(null);
const hovered = ref(false);
const maskPosition = ref({ cx: "50%", cy: "50%" });

function onMouseMove(e: MouseEvent) {
  if (!svgRef.value) return;
  const rect = svgRef.value.getBoundingClientRect();
  const cx = ((e.clientX - rect.left) / rect.width) * 100;
  const cy = ((e.clientY - rect.top) / rect.height) * 100;
  maskPosition.value = { cx: `${cx}%`, cy: `${cy}%` };
}
</script>

<template>
  <div class="plain-hover-root">
    <svg
      ref="svgRef"
      width="100%"
      height="100"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      @mousemove="onMouseMove"
      class="plain-hover-svg"
      :style="{ minHeight: '100px' }"
    >
      <defs>
        <radialGradient
          id="outlineMask"
          gradientUnits="userSpaceOnUse"
          :cx="maskPosition.cx"
          :cy="maskPosition.cy"
          r="24%"
        >
          <stop offset="0%" stop-color="#4990fa" />
          <stop offset="82%" stop-color="#4990fa" />
          <stop offset="100%" stop-color="#b5b5b5a4" />
        </radialGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="middle"
        :style="{
          fontSize: fontSize + 'px',
          fontWeight: 'bold',
          fill: 'transparent',
          stroke: hovered ? 'url(#outlineMask)' : '#b5b5b5a4',
          strokeWidth: 0.8,
          transition: 'stroke 0.2s',
        }"
      >
        {{ inscription }}
      </text>
    </svg>
  </div>
</template>

<style scoped>
.plain-hover-root {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #2b2d3a;
  min-height: 100px;
}
.plain-hover-svg {
  width: 100%;
  height: 176px;
  margin-bottom: 72px;
  display: block;
  user-select: none;
  background: #2b2d3a;
}
</style>
