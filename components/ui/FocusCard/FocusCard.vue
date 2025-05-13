<script setup lang="ts">
import { computed } from "vue";
import SquareForDesktopImageContainer from "@/components/ui/SquareForDesktopImageContainer/SquareForDesktopImageContainer.vue";

const props = defineProps<{
  img: {
    id: number;
    image: string;
    title: string;
    slug: string;
    categories: { id: number }[];
  };
  isRTL?: boolean;
  index: number;
  hoveredIdx: number | null;
}>();

const isFocused = computed(
  () => props.hoveredIdx === null || props.hoveredIdx === props.index,
);
const isHovered = computed(() => props.hoveredIdx === props.index);
</script>

<template>
  <div
    class="image-card"
    :class="[
      index === 0 ? 'first' : index === 1 ? 'second' : 'rest',
      hoveredIdx !== null && hoveredIdx !== index ? 'blurred' : '',
      isHovered ? 'active' : '',
    ]"
    @mouseenter="$emit('mouseenter', index)"
    @mouseleave="$emit('mouseleave')"
  >
    <div class="image-card-inner">
      <img :src="img.image" :alt="img.slug" />
      <SquareForDesktopImageContainer
        :title="img.title"
        :isRTL="isRTL"
        :active="isFocused"
        :isActiveCard="isHovered"
      />
      <transition name="overlay-fade">
        <div v-if="isHovered" class="image-card-overlay" key="overlay">
          <div class="image-card-overlay-text">
            A brief project description should be here, but it's not.
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/variables.css";
.image-card {
  background: #222;
  overflow: hidden;
  border-radius: var(--image-card-radius-desktop);
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  position: relative;
  aspect-ratio: calc(var(--image-card-aspect-desktop));
  min-width: var(--image-card-min-width);
  max-height: var(--image-card-max-height);
  width: 100%;
  transition:
    filter 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}
.image-card.active {
  background: var(--image-card-square-bg-active);
  transition: background 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}
.image-card-inner {
  width: 100%;
  height: 100%;
  aspect-ratio: calc(var(--image-card-aspect-desktop));
  overflow: hidden;
  border-radius: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}
.image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  display: block;
  position: relative;
  z-index: 1;
}
.image-card.first {
  flex: 1 1 0%;
  min-width: var(--image-card-min-width);
  max-width: calc(100% - 387px - var(--image-grid-gap-desktop));
}
.image-card.second {
  flex: 0 0 387px;
  width: 387px;
  min-width: 387px;
  max-width: 387px;
}
.image-card.rest {
  flex: 1 1 var(--image-card-min-width);
  min-width: var(--image-card-min-width);
  max-width: 1fr;
  max-height: var(--image-card-max-height);
}
.image-card.blurred {
  filter: blur(3px) brightness(0.92);
  transform: scale(0.98);
  z-index: 0;
  transition:
    filter 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}
.image-card:not(.blurred) {
  z-index: 1;
}
/* Overlay for hovered card */
.image-card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.56);
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 0;
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}
.image-card-overlay-text {
  width: 100%;
  padding: 0 24px 30px 24px;
  font-size: var(--image-card-overlay-text-size, 1.32rem);
  color: #fff;
  font-weight: 500;
  line-height: 1.3;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  user-select: none;
  pointer-events: none;
}
.image-card-decor,
.image-card-square,
.image-card-lines {
  z-index: 3 !important;
}
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
.overlay-fade-enter-to,
.overlay-fade-leave-from {
  opacity: 1;
}
</style>
