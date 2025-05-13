<script setup lang="ts">
import { ref, onMounted } from "vue";

const emit = defineEmits(["accept"]);
const isChecked = ref(false);
const visible = ref(true);

function handleContinue() {
  if (isChecked.value) {
    localStorage.setItem("acceptedDisclaimer", "true");
    visible.value = false;
    emit("accept");
  }
}

onMounted(() => {
  if (localStorage.getItem("acceptedDisclaimer")) {
    visible.value = false;
    emit("accept");
  }
});
</script>

<template>
  <div v-if="visible" class="disclaimer-overlay">
    <div class="disclaimer-modal">
      <h2>Disclaimer</h2>
      <div class="tab-content">
        <p>
          This website is an entry assignment created solely for demonstration
          and evaluation purposes. No commercial transactions can or should be
          conducted through this website, and this site does not represent real
          commercial offerings, services, or entities.
        </p>
        <ul>
          <li>
            All logos, images, trademarks, company names, and other identifying
            information displayed are the property of their respective owners.
            Their use here is strictly for illustrative and demonstrative
            purposes only and does not imply any affiliation, endorsement, or
            sponsorship.
          </li>
          <li>Do not submit any personal information through this website.</li>
        </ul>
      </div>
      <p class="acknowledgment">
        <i>
          By proceeding, you acknowledge and accept all terms and conditions
          stated above.
        </i>
      </p>
      <div class="normalButton">
        <input
          type="checkbox"
          id="nb-check"
          v-model="isChecked"
          class="disclaimer-checkbox"
        />
        <label for="nb-check" class="normalButton__check">
          I accept and wish to continue.
        </label>
        <button
          class="normalButton__button"
          :disabled="!isChecked"
          @click="handleContinue"
        >
          {{ isChecked ? "Continue" : "Hold on a moment" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/variables.css";

.disclaimer-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100000;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #10101a;
}

.disclaimer-modal {
  width: 540px;
  max-width: 94vw;
  max-height: 92vh;
  overflow-y: auto;
  background: #181824;
  border-radius: var(--lang-modal-rounding, 40px);
  padding: 32px 30px 28px 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  border: 1.5px solid #23233a;
  color: #eff3ff;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.44);
}

h2 {
  margin: 5px 0 18px;
  color: #eff3ff;
  font-size: 1.5rem;
  font-weight: bold;
  align-self: center;
}

.tab-content p,
.tab-content ul {
  margin: 10px 0;
  line-height: 1.5;
}
.tab-content ul {
  padding-left: 22px;
}
.acknowledgment {
  margin: 20px 0 10px 0;
  font-size: 1.08em;
  color: #e0e5ff;
  text-shadow: 0 1px 0 #181824;
}
.acknowledgment i {
  font-style: italic;
  color: #bfc7e6;
}

#nb-check {
  display: none;
}

.normalButton {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 0;
  width: 100%;
  margin: 12px 0 0;
}
.normalButton__check {
  position: relative;
  z-index: 3;
  display: inline-block;
  font-size: 15px;
  padding: 14px 16px 14px 44px;
  margin-bottom: 7px;
  border-radius: 0.52em;
  cursor: pointer;
  color: #e0e5ff;
  background: #23233a;
  transition: all ease 0.3s;
}
.normalButton__check::before {
  content: "";
  position: absolute;
  top: 0;
  left: 10px;
  bottom: 0;
  margin: auto 0;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: #181824;
  border: 1.5px solid #2d76f9;
}
.normalButton__check::after {
  content: "";
  position: absolute;
  top: 23px;
  left: 12px;
  width: 0;
  height: 0;
  overflow: hidden;
  box-sizing: border-box;
  border-left: solid 4px #2d76f9;
  border-bottom: solid 4px #2d76f9;
  opacity: 0;
  transform-origin: top left;
  transform: rotate(-45deg);
}
#nb-check:checked + .normalButton__check::after {
  animation: check ease 0.3s;
  animation-fill-mode: forwards;
}
#nb-check:checked + .normalButton__check {
  color: #fff;
  background: #23233a;
}
@keyframes check {
  0% {
    width: 0;
    height: 0;
    opacity: 0;
  }
  30% {
    width: 0;
    height: 12px;
    opacity: 1;
  }
  100% {
    width: 18px;
    height: 12px;
    opacity: 1;
  }
}

/* Move only the checkbox 1px left, 3px up */
.disclaimer-checkbox {
  position: relative;
  left: -1px;
  top: -3px;
}

.normalButton__button {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 280px;
  min-height: 64px;
  font-size: 17px;
  border-radius: var(--chronicle-button-border-radius, 100px);
  font-weight: bold;
  background-color: var(--chronicle-button-default-background, #2d76f9);
  color: var(--chronicle-button-foreground, #eff3ff);
  border: none;
  text-decoration: none;
  box-sizing: border-box;
  padding: 8px 48px;
  transition: all ease 0.3s;
  overflow: hidden;
  cursor: pointer;
  margin-top: 4px;
}
.normalButton__button:disabled {
  background: #3a4064;
  color: #a8b1d1;
  cursor: not-allowed;
}
.normalButton__button:not(:disabled):hover {
  background: var(--chronicle-button-hover-background, #eff3ff);
  color: var(--chronicle-button-default-hover-color, #20212c);
  border: 2px solid var(--chronicle-button-default-background, #2d76f9);
}
</style>
