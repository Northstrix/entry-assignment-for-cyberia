<script setup lang="ts">
import { ref } from "vue";
import LoginForm from "~/components/ui/LoginForm/LoginForm.vue";
import RectangleNotification from "~/components/ui/RectangleNotification/RectangleNotification.vue";
import { handleSignUpContinue } from "~/components/crypto/useHandleSignUpContinue";
import { handleSignInContinue } from "~/components/crypto/useHandleSignInContinue";
import Dashboard from "~/components/ui/Dashboard/Dashboard.vue";

const notificationType = ref<"success" | "error" | "processing" | null>(null);
const notificationMessage = ref("");
const notificationMessage1 = ref("");
const notificationVisible = ref(false);
const notificationInscription = ref<string | undefined>(undefined);
const mlkemPrivateKey = ref<Uint8Array | null>(null);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isSignUpPending = ref(false);
const isSignInPending = ref(false);

async function handleLogin(payload: {
  email: string;
  password: string;
  mode: string;
}) {
  // Validate email
  if (!emailRegex.test(payload.email)) {
    notificationType.value = "error";
    notificationInscription.value = "Error!";
    notificationMessage.value = "Invalid email";
    notificationMessage1.value = "Please try again";
    notificationVisible.value = true;
    return;
  }
  // Validate password
  if (!payload.password) {
    notificationType.value = "error";
    notificationInscription.value = "Error!";
    notificationMessage.value = "Password is empty";
    notificationMessage1.value = "Please try again";
    notificationVisible.value = true;
    return;
  }

  if (payload.mode === "signup") {
    if (isSignUpPending.value) return;
    isSignUpPending.value = true;
    notificationType.value = "processing";
    notificationInscription.value = "Working...";
    notificationMessage.value = "Creating your account";
    notificationMessage1.value = "Please wait for a while";
    notificationVisible.value = true;
    await new Promise((resolve) => setTimeout(resolve, 200));
    try {
      const success = await handleSignUpContinue(
        payload.email,
        payload.password,
      );
      if (!success) throw new Error("Sign up failed");
      notificationType.value = "success";
      notificationInscription.value = "Success!";
      notificationMessage.value = "Account created successfully";
      notificationMessage1.value = "You can sign in now!";
      notificationVisible.value = true;
    } catch (error) {
      notificationType.value = "error";
      notificationInscription.value = "Error!";
      notificationMessage.value = "Something went wrong";
      notificationMessage1.value = "Check the console";
      notificationVisible.value = true;
      console.error(error);
    } finally {
      isSignUpPending.value = false;
    }
    return;
  }

  // Sign in (prevent parallel sign ins)
  if (isSignInPending.value) return;
  isSignInPending.value = true;
  notificationType.value = "processing";
  notificationInscription.value = "Working...";
  notificationMessage.value = "Signing in";
  notificationMessage1.value = "Please wait for a while";
  notificationVisible.value = true;
  await new Promise((resolve) => setTimeout(resolve, 200));
  try {
    const result = await handleSignInContinue(payload.email, payload.password);
    if (!result) throw new Error("Sign in failed");
    mlkemPrivateKey.value = result;
    notificationType.value = null;
    notificationVisible.value = false;
    console.log("Decrypted MLKEM private key:", result);
  } catch (error) {
    notificationType.value = "error";
    notificationInscription.value = "Error!";
    notificationMessage.value = "Sign in failed";
    notificationMessage1.value = "Check the console";
    notificationVisible.value = true;
    console.error(error);
  } finally {
    isSignInPending.value = false;
  }
}

function handleNotificationClose() {
  notificationVisible.value = false;
}
</script>

<template>
  <div class="owner-dashboard-root">
    <nav class="navbar">
      <div class="navbar-content"></div>
    </nav>
    <div class="dashboard-content">
      <div class="modal-center" v-if="!mlkemPrivateKey">
        <LoginForm @submit="handleLogin" />
      </div>
      <Dashboard v-else :mlkemPrivateKey="mlkemPrivateKey" />
    </div>
    <RectangleNotification
      v-if="notificationType"
      :type="notificationType"
      :message="notificationMessage"
      :message1="notificationMessage1"
      :isVisible="notificationVisible"
      :alertInscription="notificationInscription"
      @close="handleNotificationClose"
    />
  </div>
</template>

<style scoped>
.navbar {
  background: var(--navbar-bg-mobile, #20212c);
  padding: var(--navbar-mobile-padding-y, 26px) 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
@media (min-width: 768px) {
  .navbar {
    background: var(--navbar-bg-desktop, transparent);
    padding: var(--navbar-desktop-padding-y, 40px) 0;
  }
}
.navbar-content {
  max-width: var(--navbar-max-width, 1240px);
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
}
.dashboard-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-center {
  width: 100vw;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
