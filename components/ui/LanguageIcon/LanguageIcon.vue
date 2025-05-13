<script setup lang="ts">
defineProps<{ width?: number }>();
</script>

<template>
  <div
    :style="{
      width: (width || 26) + 'px',
      height: (width || 26) + 'px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="'0 0 356 182'"
      style="
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "
    >
      <image
        href="/LanguageIcon.png"
        width="356"
        height="182"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  </div>
</template>
