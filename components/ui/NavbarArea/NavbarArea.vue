<template>
  <div class="navbar-area">
    <slot />
  </div>
</template>

<style scoped>
.navbar-area {
  width: 100vw;
  background: var(--navbar-bg-desktop);
}
@media (max-width: 800px) {
  .navbar-area {
    background: var(--navbar-bg-mobile);
  }
}
</style>
