<script setup lang="ts">
import { ref } from "vue";
import MobileFloatingLabelInput from "../MobileFloatingLabelInput/MobileFloatingLabelInput.vue";
import ChronicleButton from "../ChronicleButton/ChronicleButton.vue";

const emit = defineEmits<{
  (
    e: "submit",
    payload: { email: string; password: string; mode: "signin" | "signup" },
  ): void;
}>();

const mode = ref<"signin" | "signup">("signin");
const email = ref("");
const password = ref("");

function handleSubmit() {
  emit("submit", {
    email: email.value,
    password: password.value,
    mode: mode.value,
  });
}
</script>

<template>
  <div class="login-modal">
    <h2>
      {{ mode === "signup" ? "Welcome!" : "Hello" }}
    </h2>
    <div class="modal-inscription">
      {{ mode === "signup" ? "Create an account" : "Sign in to your account" }}
    </div>
    <form @submit.prevent="handleSubmit" class="form">
      <MobileFloatingLabelInput
        v-model="email"
        label="Email"
        type="email"
        required
      />
      <MobileFloatingLabelInput
        v-model="password"
        label="Password"
        type="password"
        required
      />
      <ChronicleButton
        :text="mode === 'signup' ? 'Sign Up' : 'Sign In'"
        :onClick="handleSubmit"
        :isMobile="true"
      />
    </form>
    <div class="switch">
      <span v-if="mode === 'signup'">
        Already have an account?
        <a href="#" @click.prevent="mode = 'signin'">Sign In</a>
      </span>
      <span v-else>
        Don't have an account?
        <a href="#" @click.prevent="mode = 'signup'">Sign Up</a>
      </span>
    </div>
  </div>
</template>

<style scoped>
.login-modal {
  background: var(--project-inquiry-mobile-bg, #23243b);
  border-radius: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.22);
  padding: calc(2.5rem - 10px) 2rem 2rem 2rem; /* Reduce top padding by 28px */
  min-width: 320px;
  max-width: 356px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: 1px solid var(--project-inquiry-mobile-color, #4990fa);
}
h2 {
  color: var(--project-inquiry-mobile-color, #4990fa);
  font-size: 2rem;
  margin-bottom: 0.5rem; /* Reduced gap to subtext */
  font-weight: bold;
  margin-top: 0; /* Remove any default margin */
}
.modal-inscription {
  color: var(--project-inquiry-mobile-color, #4990fa);
  font-size: 1.08rem;
  margin-bottom: 1.6rem;
  text-align: center;
}
.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.switch {
  margin-top: 1.6rem;
  color: var(--project-inquiry-mobile-color, #4990fa);
  font-size: 1rem;
}
.switch a {
  color: var(--project-inquiry-mobile-color, #4990fa);
  cursor: pointer;
  text-decoration: underline;
  margin-left: 4px;
}
</style>
