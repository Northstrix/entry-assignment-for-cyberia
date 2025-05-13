<script setup lang="ts">
import "./cases.css";
import { ref, onMounted, inject, computed, nextTick } from "vue";
import { useRuntimeConfig } from "#app";
import { useUiStore } from "~/stores/uiStore";
import { storeToRefs } from "pinia";
import CategoryList from "~/components/ui/CategoryList/CategoryList.vue";
import ImageGrid from "~/components/ui/ImageGrid/ImageGrid.vue";
import MobileImageGrid from "~/components/ui/MobileImageGrid/MobileImageGrid.vue";
import DesktopInquiryInput from "~/components/ui/DesktopInquiryInput/DesktopInquiryInput.vue";
import MultiLineDesktopInquiryInput from "~/components/ui/MultiLineDesktopInquiryInput/MultiLineDesktopInquiryInput.vue";
import ChronicleButton from "~/components/ui/ChronicleButton/ChronicleButton.vue";
import DesktopInquiryConsentCheckbox from "~/components/ui/DesktopInquiryConsentCheckbox/DesktopInquiryConsentCheckbox.vue";
import RectangleNotification from "~/components/ui/RectangleNotification/RectangleNotification.vue";
import { responseSender } from "~/components/crypto/responseSender";

const ui = useUiStore();
const { selectedCategory, isRTL } = storeToRefs(ui);
const categories = ref<{ id: number; name: string }[]>([]);
const images = ref<any[]>([]);
const apiBase = useRuntimeConfig().public.apiLink;

const notificationType = ref<"success" | "error" | "processing" | null>(null);
const notificationMessage = ref("");
const notificationMessage1 = ref("");
const notificationVisible = ref(false);
const notificationInscription = ref<string | undefined>(undefined);

const name = ref("");
const email = ref("");
const phone = ref("");
const message = ref("");
const consent = ref(false);

const showSender = ref(false);

async function handleSend() {
  // Validation
  if (!name.value || !email.value || !phone.value || !message.value) {
    notificationType.value = "error";
    notificationInscription.value = "Error!";
    notificationMessage.value = "Please fill all fields";
    notificationMessage1.value = "";
    notificationVisible.value = true;
    return;
  }
  if (!consent.value) {
    notificationType.value = "error";
    notificationInscription.value = "Error!";
    notificationMessage.value = "Can't send the data";
    notificationMessage1.value = "without your consent";
    notificationVisible.value = true;
    return;
  }

  notificationType.value = "processing";
  notificationInscription.value = "Working...";
  notificationMessage.value = "Sending your response";
  notificationMessage1.value = "Please wait for a while";
  notificationVisible.value = true;

  // Call the TS sender directly
  const success = await responseSender({
    name: name.value,
    email: email.value,
    phone: phone.value,
    message: message.value,
    platform: "desktop",
  });

  if (success) {
    notificationType.value = "success";
    notificationInscription.value = "Success!";
    notificationMessage.value = "The response has been sent";
    notificationMessage1.value = "This stuff works!";
    notificationVisible.value = true;
    // Optionally, clear the form:
    // name.value = email.value = phone.value = message.value = "";
    // consent.value = false;
  } else {
    notificationType.value = "error";
    notificationInscription.value = "Error!";
    notificationMessage.value = "Something went wrong";
    notificationMessage1.value = "Check the console";
    notificationVisible.value = true;
  }
}

function handleNotificationClose() {
  notificationVisible.value = false;
}

async function fetchCategories() {
  try {
    const res = await fetch(`${apiBase}/project-categories`);
    const data = await res.json();
    categories.value = Array.isArray(data.items) ? data.items : [];
  } catch (e) {
    categories.value = [];
  }
}

async function fetchImages() {
  try {
    const res = await fetch(`${apiBase}/projects`);
    const data = await res.json();
    images.value = Array.isArray(data.items) ? data.items : [];
  } catch (e) {
    images.value = [];
  }
}

onMounted(fetchCategories);
onMounted(fetchImages);

const isMobile = inject("isMobile", ref(false));
const projectInquiryTranslations = inject(
  "projectInquiryTranslations",
  computed(() => ({ line1: "", line2: "", full: "" })),
);
const formLabels = inject(
  "projectInquiryFormLabels",
  computed(() => ({ name: "", email: "", phone: "", message: "" })),
);
const checkboxText = inject(
  "checkboxText",
  computed(() => ""),
);
const discussProjectButtonText = inject(
  "discussProjectButtonText",
  computed(() => "Discuss Project"),
);
const language = inject("language", ref("en"));

function handleCategoryClick(id: number) {
  if (selectedCategory.value === id) {
    ui.setSelectedCategory(null);
  } else {
    ui.setSelectedCategory(id);
  }
}

// --- Rerender bento grid on window resize ---
const bentoGridKey = ref(0);
function rerenderBentoGrid() {
  bentoGridKey.value++;
}
onMounted(() => {
  window.addEventListener("resize", rerenderBentoGrid);
});
onMounted(() => {
  // Clean up on unmount
  window.addEventListener("beforeunload", () => {
    window.removeEventListener("resize", rerenderBentoGrid);
  });
});
</script>

<template>
  <div>
    <client-only>
      <RectangleNotification
        v-if="notificationType"
        :type="notificationType"
        :message="notificationMessage"
        :message1="notificationMessage1"
        :isVisible="notificationVisible"
        :alertInscription="notificationInscription"
        @close="handleNotificationClose"
      />
      <div class="category-list-wrapper" :class="{ mobile: isMobile }">
        <CategoryList
          :categories="categories"
          :activeId="selectedCategory"
          :onCategoryClick="handleCategoryClick"
          :isRTL="isRTL"
        />
      </div>
      <MobileImageGrid
        v-if="isMobile"
        :images="images"
        :activeCategoryId="selectedCategory"
        :isRTL="isRTL"
      />
      <template v-else>
        <ImageGrid
          :images="images"
          :activeCategoryId="selectedCategory"
          :isRTL="isRTL"
        />
        <!-- Desktop Project Inquiry block: always below image grid -->
        <div
          class="project-inquiry-desktop"
          :class="{ rtl: isRTL }"
          :dir="isRTL ? 'rtl' : 'ltr'"
        >
          <span class="line1">{{ projectInquiryTranslations.line1 }}</span>
          <span class="line2">{{ projectInquiryTranslations.line2 }}</span>
          <!-- BentoGrid for inputs, rerendered on resize -->
          <form class="bento-inquiry-form" @submit.prevent="handleSend">
            <div class="bento-grid" :key="bentoGridKey">
              <!-- Top row: 3 inputs -->
              <div class="bento-item">
                <DesktopInquiryInput
                  v-model="name"
                  :label="formLabels.name"
                  :isRTL="isRTL"
                  required
                />
              </div>
              <div class="bento-item">
                <DesktopInquiryInput
                  v-model="email"
                  :label="formLabels.email"
                  :isRTL="isRTL"
                  required
                  type="email"
                />
              </div>
              <div class="bento-item">
                <DesktopInquiryInput
                  v-model="phone"
                  :label="formLabels.phone"
                  :isRTL="isRTL"
                  required
                  type="tel"
                />
              </div>
              <!-- Bottom row: message, spans all columns -->
              <div class="bento-item bento-message">
                <MultiLineDesktopInquiryInput
                  v-model="message"
                  :label="formLabels.message"
                  textarea
                  :isRTL="isRTL"
                  required
                />
              </div>
            </div>
            <!-- Actions below the grid -->
            <div class="inquiry-actions">
              <div class="inquiry-checkbox">
                <DesktopInquiryConsentCheckbox
                  v-model="consent"
                  :label="checkboxText"
                />
              </div>
              <div class="inquiry-chronicle-btn">
                <ChronicleButton :text="discussProjectButtonText" />
              </div>
            </div>
          </form>
        </div>
      </template>
      <div class="image-grid-spacer"></div>
    </client-only>
  </div>
</template>
