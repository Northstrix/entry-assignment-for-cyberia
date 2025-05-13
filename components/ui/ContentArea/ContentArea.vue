<template>
  <div class="content-area">
    <slot />
  </div>
</template>

<style scoped>
.content-area {
  max-width: var(--content-area-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--content-area-padding-x);
  padding-right: var(--content-area-padding-x);
  width: 100%;
  box-sizing: border-box;
}
</style>
