<template>
  <NuxtLayout>
    <div class="bg-overlay" aria-hidden="true"></div>
    <div class="content-overlay">
      <NuxtPage />
    </div>
  </NuxtLayout>
  <Footer />
</template>

<script setup lang="ts">
// No logic needed here
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed:wght@400;700;100;300&display=swap");
@import "@/assets/css/variables.css";

/* Apply font globally to all elements */
html,
body,
#__nuxt,
#app,
* {
  font-family: "Fira Sans Condensed", Arial, sans-serif !important;
  font-weight: 400;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100vh;
  color: #fff;
  position: relative;
  background: #252631;
  z-index: 0;
}

/* --- BACKGROUND OVERLAY --- */
.bg-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  min-height: 100vh;
  z-index: 0;
  pointer-events: none;
  /* Only noise background here */
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.02'/></svg>")
    repeat;
  background-blend-mode: lighten;
  opacity: 0.96;
  transition:
    opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    background 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, background;
}

.bg-overlay::before {
  content: "";
  position: absolute;
  inset: 0;
  width: 100%;
  min-height: 100vh;
  pointer-events: none;
  z-index: 1;
  /* Linear gradient only, shifted up */
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 30%,
    rgba(52, 52, 69, 0.55) 38.88%,
    rgba(52, 52, 69, 0.59) 41.36%,
    rgba(52, 52, 69, 0.71) 45.44%,
    rgba(52, 52, 69, 0.72) 50%,
    rgba(52, 52, 69, 0.71) 54.48%,
    rgba(52, 52, 69, 0.59) 58.64%,
    rgba(52, 52, 69, 0.55) 61.12%,
    transparent 70%,
    transparent 100%
  );
  background-blend-mode: normal, overlay;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
  /* Shift the gradient up by 198px */
  transform: translateY(-298px);
}

/* Hide viewport scrollbars on mobile only */
@media (max-width: 800px) {
  html,
  body {
    overflow: hidden !important;
    height: 100%;
    width: 100%;
    overscroll-behavior: none;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  html::-webkit-scrollbar,
  body::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
  }
}

/* --- CONTENT OVERLAY --- */
.content-overlay {
  position: relative;
  z-index: 1;
  min-height: 100%;
}
</style>
