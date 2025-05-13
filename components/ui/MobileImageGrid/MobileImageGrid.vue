<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";

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
  return imgs;
});

const columns = ref(1);
function updateColumns() {
  columns.value = window.innerWidth >= 644 ? 2 : 1;
}
onMounted(() => {
  updateColumns();
  window.addEventListener("resize", updateColumns);
});
onUnmounted(() => {
  window.removeEventListener("resize", updateColumns);
});
</script>

<template>
  <div
    class="mobile-image-grid"
    :class="['cols-' + columns, { rtl: isRTL }]"
    style="direction: ltr"
  >
    <div
      v-for="img in filteredImages"
      :key="img.id"
      class="mobile-image-card"
      :class="{ rtl: isRTL }"
    >
      <div class="mobile-image-card-img-wrap">
        <img :src="img.image" :alt="img.slug" class="mobile-image-img" />
        <div class="mobile-image-overlay">
          <div class="mobile-image-overlay-content" :class="{ rtl: isRTL }">
            <!-- Lines container: align right and mirror in RTL -->
            <div class="mobile-image-lines-container" :class="{ rtl: isRTL }">
              <svg
                class="mobile-image-lines"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0" y="0" width="3" height="17" fill="#fff" />
                <rect x="0" y="14" width="17" height="3" fill="#fff" />
                <rect x="8" y="0" width="3" height="9" fill="#fff" />
                <rect x="8" y="6" width="9" height="3" fill="#fff" />
              </svg>
            </div>
            <!-- Project name -->
            <div class="mobile-image-title" :class="{ rtl: isRTL }">
              {{ img.title }}
            </div>
            <!-- Description (single, wraps as needed) -->
            <div class="mobile-image-desc" :class="{ rtl: isRTL }">
              A short and concise description of the project is supposed to be
              placed in this section; however, at the moment, it is missing!
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/variables.css";

.mobile-image-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--image-grid-gap-mobile, 20px);
  width: 100%;
}
.mobile-image-grid.cols-2 {
  grid-template-columns: 1fr 1fr;
}
.mobile-image-grid.rtl {
  direction: rtl;
}
.mobile-image-card {
  width: 100%;
  border-radius: var(--image-card-radius-mobile, 8px);
  overflow: hidden;
  position: relative;
  aspect-ratio: calc(var(--image-card-aspect-mobile, 327/320));
  background: #18181c;
  display: flex;
  flex-direction: column;
}
.mobile-image-card.rtl {
  direction: rtl;
}
.mobile-image-card-img-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: inherit;
  overflow: hidden;
}
.mobile-image-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  display: block;
}
.mobile-image-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50%;
  min-height: 80px;
  background: linear-gradient(
    to top,
    rgba(25, 28, 35, 0.98) 0%,
    rgba(25, 28, 35, 0.85) 30%,
    rgba(25, 28, 35, 0.78) 53%,
    rgba(25, 28, 35, 0.44) 74%,
    rgba(25, 28, 35, 0) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 var(--mobile-overlay-padding-x, 30px);
  pointer-events: none;
}
.mobile-image-overlay-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--mobile-overlay-content-gap, 14px);
  margin-bottom: var(--mobile-desc-bottom, 22px);
}
.mobile-image-overlay-content.rtl {
  align-items: flex-end;
}

/* Lines container */
.mobile-image-lines-container {
  align-self: flex-start;
}
.mobile-image-lines-container.rtl {
  align-self: flex-start;
  /* Mirror horizontally */
  transform: scaleX(-1);
}

.mobile-image-lines {
  width: 17px;
  height: 17px;
  display: block;
  margin-bottom: 0;
}

.mobile-image-title {
  font-size: var(--mobile-image-title-size, 14px);
  font-weight: 400;
  color: #fff;
  line-height: 1.2;
  text-align: left;
  white-space: normal;
  word-break: break-word;
  width: 100%;
  pointer-events: none;
  letter-spacing: 0.06em;
  margin-top: 3px;
}
.mobile-image-title.rtl {
  text-align: right;
}
.mobile-image-desc {
  font-size: var(--mobile-image-desc-size, 10px);
  font-weight: 100;
  color: #fff;
  line-height: 1.5;
  text-align: left;
  white-space: normal;
  word-break: break-word;
  width: 100%;
  pointer-events: none;
  letter-spacing: 0.03em;
}
.mobile-image-desc.rtl {
  text-align: right;
}
</style>
