<script setup lang="ts">
import { ref, watch, computed } from "vue";

interface RectangleNotificationProps {
  type: "success" | "error" | "processing";
  isVisible: boolean;
  alertInscription?: string;
  message: string;
  message1?: string;
}

const props = defineProps<RectangleNotificationProps>();
const emit = defineEmits(["close"]);
const isFadingOut = ref(false);

const messageTranslate = computed(() =>
  props.type === "processing" ? "translateY(34px)" : "translateY(12px)",
);

watch(
  () => props.isVisible,
  (newVal) => {
    if (!newVal) {
      isFadingOut.value = true;
      setTimeout(() => {
        emit("close");
      }, 300);
    } else {
      isFadingOut.value = false;
    }
  },
);
</script>

<template>
  <div
    v-if="isVisible"
    class="sign-up-rectangle-notification-container"
    :class="{ 'fade-out': isFadingOut }"
  >
    <div
      class="sign-up-rectangle-notification-box"
      :class="{
        'sign-up-rectangle-notification-success-box':
          type === 'success' || type === 'processing',
        'sign-up-rectangle-notification-error-box': type === 'error',
        'processing-width': type === 'processing',
      }"
    >
      <div
        class="sign-up-rectangle-notification-face"
        :class="{ face2: type === 'error' }"
      >
        <div class="sign-up-rectangle-notification-eye"></div>
        <div class="sign-up-rectangle-notification-eye right"></div>
        <div
          class="sign-up-rectangle-notification-mouth"
          :class="{
            happy: type === 'success' || type === 'processing',
            sad: type === 'error',
          }"
        ></div>
      </div>
      <div
        class="sign-up-rectangle-notification-shadow"
        :class="{
          scale: type === 'success' || type === 'processing',
          move: type === 'error',
        }"
      ></div>
      <div
        class="sign-up-rectangle-notification-message"
        :style="{ transform: messageTranslate }"
      >
        <h1 class="alert-rect-top">
          {{ alertInscription || "" }}
        </h1>
        <p class="rectangle-notification-text">{{ message }}</p>
        <p v-if="message1" class="rectangle-notification-text1">
          {{ message1 }}
        </p>
      </div>
      <button
        v-if="type !== 'processing' && !isFadingOut"
        class="sign-up-rectangle-notification-button-box"
        @click="emit('close')"
      >
        OK
      </button>
    </div>
  </div>
</template>

<style scoped>
.sign-up-rectangle-notification-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(21, 20, 25, 0.7);
  backdrop-filter: blur(5px) saturate(91%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.sign-up-rectangle-notification-box {
  position: relative;
  width: 245px;
  height: 250px;
  border-radius: 25px;
  box-shadow: 5px 5px 20px rgba(203, 205, 211, 0.11);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  direction: ltr;
}
.sign-up-rectangle-notification-box.processing-width {
  width: 225px !important;
}
.sign-up-rectangle-notification-success-box {
  background: linear-gradient(
    to bottom right,
    rgba(0, 123, 255, 0.8) 40%,
    rgba(173, 216, 230, 0.8) 100%
  );
}
.sign-up-rectangle-notification-error-box {
  background: linear-gradient(
    to bottom left,
    rgba(255, 105, 180, 0.8) 40%,
    rgba(255, 182, 193, 0.8) 100%
  );
}
.sign-up-rectangle-notification-face {
  position: absolute;
  width: 22%;
  height: 22%;
  background: #fcfcfc;
  border-radius: 50%;
  border: 1px solid #777777;
  top: 11%;
  z-index: 2;
  animation: bounce 1s ease-in infinite;
}
.sign-up-rectangle-notification-face.face2 {
  position: absolute;
  width: 22%;
  height: 22%;
  border-radius: 50%;
  background: #fcfcfc;
  border-radius: 50%;
  border: 1px solid #777777;
  top: 11%;
  left: 37.5%;
  z-index: 2;
  animation: roll 3s ease-in-out infinite;
}
.sign-up-rectangle-notification-eye {
  position: absolute;
  width: 5px;
  height: 5px;
  background: #777777;
  border-radius: 50%;
  top: 30%;
  left: 20%;
}
.sign-up-rectangle-notification-eye.right {
  left: 68%;
}
.sign-up-rectangle-notification-mouth {
  position: absolute;
  top: 33%;
  left: 41%;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.sign-up-rectangle-notification-mouth.happy {
  border: 2px solid;
  border-color: transparent #777777 #777777 transparent;
  transform: rotate(45deg);
}
.sign-up-rectangle-notification-mouth.sad {
  top: 39%;
  border: 2px solid;
  border-color: #777777 transparent transparent #777777;
  transform: rotate(45deg);
}
.sign-up-rectangle-notification-shadow.scale {
  position: absolute;
  width: 21%;
  height: 3%;
  opacity: 0.5;
  background: #454545;
  left: 40%;
  top: 33%;
  border-radius: 50%;
  z-index: 1;
  animation: scale 1s ease-in infinite;
}
.sign-up-rectangle-notification-shadow.move {
  position: absolute;
  width: 21%;
  height: 3%;
  opacity: 0.5;
  background: #454545;
  left: 40%;
  top: 33%;
  border-radius: 50%;
  z-index: 1;
  transform: scale(1.14);
  animation: move 3s ease-in-out infinite;
}
.sign-up-rectangle-notification-message {
  position: absolute;
  width: 100%;
  text-align: center;
  top: 34%;
  /* transform is now dynamic via :style binding */
}
.alert-rect-top {
  font-size: 32px;
  font-weight: bold;
  font-weight: 700;
  color: #f5f5f5;
  margin: 0px 0px 0px 0px;
}
.rectangle-notification-text {
  color: #f5f5f5;
  margin: 2px 0 0px;
  font-size: 17px;
}
.rectangle-notification-text1 {
  color: #f5f5f5;
  margin: 0px 0 1px;
  font-size: 17px;
}
.sign-up-rectangle-notification-button-box {
  position: absolute;
  width: 50%;
  height: 15%;
  top: 196px;
  left: 25%;
  background-color: transparent;
  border: 2px solid #ffffff;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-radius: 20px;
  outline: 0;
  overflow: hidden;
  transition: all 0.5s ease;
  cursor: pointer;
}
.sign-up-rectangle-notification-button-box:hover {
  background: #ffffff;
  color: #242424;
  transform: scale(1.1);
  box-shadow:
    0 0 5px #ffffff,
    0 0 25px #ffffff,
    0 0 50px #ffffff,
    0 0 200px #ffffff;
  transition: all 0.5s ease;
}
@keyframes bounce {
  50% {
    transform: translateY(-10px);
  }
}
@keyframes roll {
  0% {
    transform: rotate(0deg);
    left: 25%;
  }
  50% {
    left: 60%;
    transform: rotate(168deg);
  }
  100% {
    transform: rotate(0deg);
    left: 25%;
  }
}
@keyframes move {
  0% {
    left: 25%;
  }
  50% {
    left: 60%;
  }
  100% {
    left: 25%;
  }
}
@keyframes scale {
  50% {
    transform: scale(0.9);
  }
}
.fade-out {
  opacity: 0;
  transition: opacity 0.3s ease;
}
</style>
