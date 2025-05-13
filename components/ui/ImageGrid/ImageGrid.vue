<script setup lang="ts">
import { computed, ref } from "vue";
import FocusCard from "../FocusCard/FocusCard.vue";

const props = defineProps<{
  images: {
    id: number;
    image: string;
    title: string;
    slug: string;
    categories: { id: number }[];
  }[];
  activeCategoryId: number | null;
  isRTL?: boolean;
}>();

const excludedIds = [7];

const filteredImages = computed(() => {
  let imgs = props.images.filter((img) => !excludedIds.includes(img.id));
  if (props.activeCategoryId) {
    imgs = imgs.filter((img) =>
      img.categories.some((cat) => cat.id === props.activeCategoryId),
    );
  }
  return imgs.slice(0, 5);
});

const row1 = computed(() => filteredImages.value.slice(0, 2));
const rowRest = computed(() => filteredImages.value.slice(2));

// Hover logic for focus effect
const hoveredIdx = ref<number | null>(null);

function handleMouseEnter(idx: number) {
  hoveredIdx.value = idx;
}
function handleMouseLeave() {
  hoveredIdx.value = null;
}
</script>

<template>
  <div class="image-grid" :class="{ rtl: isRTL }" style="direction: ltr">
    <!-- DESKTOP -->
    <div class="image-grid-row image-grid-row1" v-if="row1.length">
      <FocusCard
        v-for="(img, idx) in row1"
        :key="img.id"
        :img="img"
        :isRTL="isRTL"
        :index="idx"
        :hoveredIdx="hoveredIdx"
        @mouseenter="handleMouseEnter(idx)"
        @mouseleave="handleMouseLeave"
      />
    </div>
    <div class="image-grid-row image-grid-row-rest" v-if="rowRest.length">
      <FocusCard
        v-for="(img, idx) in rowRest"
        :key="img.id"
        :img="img"
        :isRTL="isRTL"
        :index="idx + 2"
        :hoveredIdx="hoveredIdx"
        @mouseenter="handleMouseEnter(idx + 2)"
        @mouseleave="handleMouseLeave"
      />
    </div>
    <!-- MOBILE -->
    <div class="image-grid-mobile">
      <div
        v-for="img in filteredImages"
        :key="img.id"
        class="image-card mobile"
      >
        <div class="image-card-inner">
          <img :src="img.image" :alt="img.slug" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/variables.css";
.image-grid {
  width: 100%;
  box-sizing: border-box;
}
.image-grid.rtl {
}
.image-grid-row {
  display: flex;
  gap: var(--image-grid-gap-desktop);
  margin-bottom: var(--image-grid-gap-desktop);
  width: 100%;
}
.image-grid-row1 {
  flex-wrap: nowrap;
}
.image-grid-row-rest {
  flex-wrap: wrap;
  gap: var(--image-grid-gap-desktop);
  margin-bottom: 0;
}
.image-grid.rtl .image-grid-row,
.image-grid.rtl .image-grid-row-rest {
  flex-direction: row-reverse;
}
/* MOBILE */
.image-grid-mobile {
  display: none;
}
@media (max-width: 800px) {
  .image-grid-row,
  .image-grid-row-rest {
    display: none !important;
  }
  .image-grid-mobile {
    display: flex;
    flex-direction: column;
    gap: var(--image-grid-gap-mobile);
    width: 100%;
  }
  .image-card.mobile {
    border-radius: var(--image-card-radius-mobile);
    aspect-ratio: calc(var(--image-card-aspect-mobile));
    min-width: 0;
    max-width: 100%;
    width: 100%;
    max-height: none;
  }
  .image-card-inner {
    aspect-ratio: calc(var(--image-card-aspect-mobile));
    border-radius: inherit;
  }
  .image-card-decor {
    display: none !important;
  }
}
</style>
