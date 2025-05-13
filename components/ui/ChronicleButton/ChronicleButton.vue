<script setup lang="ts">
const props = defineProps<{
  text: string;
  onClick?: () => void;
  hoverColor?: string;
  width?: string;
  outlined?: boolean;
  outlinePaddingAdjustment?: string;
  borderRadius?: string;
  fontFamily?: string;
  outlinedButtonBackgroundOnHover?: string;
  customBackground?: string;
  customForeground?: string;
  isMobile?: boolean;
}>();
</script>

<template>
  <button
    class="chronicleButton"
    :class="{ outlined: props.outlined, mobile: props.isMobile }"
    :style="{
      '--hover-color':
        props.hoverColor || 'var(--chronicle-button-default-hover-color)',
      '--hover-bg': 'var(--chronicle-button-hover-background, #fff)',
      '--text-color': props.outlined
        ? 'var(--chronicle-button-background)'
        : 'var(--chronicle-button-foreground)',
      '--outline-padding-adjustment': props.outlinePaddingAdjustment || '2px',
      '--outlined-button-background-on-hover':
        props.outlinedButtonBackgroundOnHover ||
        'var(--chronicle-button-outlined-background-on-hover)',
      '--chronicle-button-background':
        props.customBackground || 'var(--chronicle-button-background)',
      '--chronicle-button-foreground':
        props.customForeground || 'var(--chronicle-button-foreground)',
      width: props.width || (props.isMobile ? '100%' : '260px'),
      borderRadius:
        props.borderRadius || 'var(--chronicle-button-border-radius)',
      fontFamily: props.fontFamily,
    }"
    @click="props.onClick"
  >
    <span
      ><em>{{ props.text }}</em></span
    >
    <span
      ><em>{{ props.text }}</em></span
    >
  </button>
</template>

<style scoped>
.chronicleButton {
  border-radius: var(--chronicle-button-border-radius, 100px);
  background: var(--chronicle-button-default-background, #2d76f9);
  color: var(--chronicle-button-foreground, #fff);
  font-weight: 700;
  font-family: inherit;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  line-height: 1;
  padding: 0;
  transition:
    background 0.3s linear 0s,
    color 0.3s linear 0s;
  will-change: background, color;
  width: 260px;
  height: 62px;
  font-size: 22px;
  position: relative;
}

.chronicleButton.mobile {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  height: 48px;
  font-size: 18px;
}

.chronicleButton:hover {
  background: var(
    --hover-bg,
    var(--chronicle-button-hover-background, #fff)
  ); /* <-- Hover background */
  color: var(
    --hover-color,
    var(--chronicle-button-default-hover-color, #20212c)
  );
}

.chronicleButton span {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  perspective: 108px;
}

.chronicleButton span:nth-of-type(2) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.chronicleButton em {
  font-style: normal;
  display: inline-block;
  width: 100%;
  text-align: center;
  color: var(--text-color, var(--chronicle-button-foreground, #fff));
  font-size: inherit;
  line-height: 1;
  will-change: transform, opacity, transition, color;
  transition:
    transform 0.55s cubic-bezier(0.645, 0.045, 0.355, 1),
    opacity 0.35s linear 0.2s,
    color 0.3s linear 0s;
}

.chronicleButton span:nth-of-type(1) em {
  transform-origin: top;
}

.chronicleButton span:nth-of-type(2) em {
  opacity: 0;
  transform: rotateX(-90deg) scaleX(0.9) translate3d(0, 10px, 0);
  transform-origin: bottom;
}

.chronicleButton:hover span:nth-of-type(1) em {
  opacity: 0;
  transform: rotateX(90deg) scaleX(0.9) translate3d(0, -10px, 0);
  color: var(
    --hover-color,
    var(--chronicle-button-default-hover-color, #20212c)
  );
}

.chronicleButton:hover span:nth-of-type(2) em {
  opacity: 1;
  transform: rotateX(0deg) scaleX(1) translateZ(0);
  color: var(
    --hover-color,
    var(--chronicle-button-default-hover-color, #20212c)
  );
  transition:
    transform 0.75s cubic-bezier(0.645, 0.045, 0.355, 1),
    opacity 0.35s linear 0.3s,
    color 0.3s linear 0s;
}

/* Outlined variant */
.chronicleButton.outlined {
  background: transparent;
  border: 2px solid var(--chronicle-button-background, #2d76f9);
  color: var(--chronicle-button-background, #2d76f9);
  padding: calc(1rem - var(--outline-padding-adjustment, 2px)) 0;
  transition:
    border 0.3s linear,
    color 0.3s linear 0s,
    background-color 0.3s linear 0s;
  will-change: border, color, background;
}

.chronicleButton.outlined em {
  color: var(--text-color, var(--chronicle-button-background, #2d76f9));
  transition: color 0.3s linear 0s;
}

.chronicleButton.outlined:hover {
  background: var(--hover-bg, var(--chronicle-button-hover-background, #fff));
  border-color: var(
    --hover-color,
    var(--chronicle-button-default-hover-color, #20212c)
  );
  color: var(
    --hover-color,
    var(--chronicle-button-default-hover-color, #20212c)
  );
}

.chronicleButton.outlined:hover em {
  color: var(
    --hover-color,
    var(--chronicle-button-default-hover-color, #20212c)
  );
  transition: color 0.3s linear 0s;
}
</style>
