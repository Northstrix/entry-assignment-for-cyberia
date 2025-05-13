<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  watch,
  onUnmounted,
  provide,
  nextTick,
} from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useUiStore } from "~/stores/uiStore";
import "@/assets/css/layout.css";
import translations from "./translations";
import Navbar from "~/components/ui/Navbar/Navbar.vue";
import Breadcrumbs from "~/components/ui/Breadcrumbs/Breadcrumbs.vue";
import LanguageSelector from "~/components/ui/LanguageSelector/LanguageSelector.vue";
import ProjectInquiryMobile from "../components/ui/ProjectInquiryMobile/ProjectInquiryMobile.vue";
import MobileFooter from "../components/ui/MobileFooter/MobileFooter.vue";
import DesktopFooter from "~/components/ui/DesktopFooter/DesktopFooter.vue";
import MobileFullViewportMenu from "~/components/ui/MobileFullViewportMenu/MobileFullViewportMenu.vue";
import RectangleNotification from "~/components/ui/RectangleNotification/RectangleNotification.vue";
import { responseSender } from "~/components/crypto/responseSender";
import Disclaimer from "~/components/ui/Disclaimer/Disclaimer.vue";

const showDisclaimer = ref(!localStorage.getItem("acceptedDisclaimer"));
function handleDisclaimerAccept() {
  showDisclaimer.value = false;
}

const ui = useUiStore();
const { language, isRTL } = storeToRefs(ui);
const route = useRoute();
const languages = [
  { code: "en", name: "English", flag: "/Flag_of_the_United_States.svg" },
  { code: "he", name: "עברית", flag: "/Flag_of_Israel.svg" },
  { code: "ru", name: "Русский", flag: "/Flag_of_Russia.svg" },
];
const showMobileMenu = ref(false);
function openBurgerMenu() {
  showMobileMenu.value = true;
}
function closeMobileMenu() {
  showMobileMenu.value = false;
}
// Responsive check
const isMobile = ref(false);
function checkMobile() {
  isMobile.value = window.innerWidth <= 800;
}
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});
onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
// Language handling
onMounted(() => {
  const saved = localStorage.getItem("lang");
  if (saved && languages.some((l) => l.code === saved)) {
    ui.setLanguage(saved);
  } else {
    ui.setLanguage("en");
  }
  document.documentElement.dir = isRTL.value ? "rtl" : "ltr";
});
watch(language, (val) => {
  localStorage.setItem("lang", val);
  document.documentElement.dir = isRTL.value ? "rtl" : "ltr";
});
// Provide for child components/pages
provide(
  "projectInquiryTranslations",
  computed(
    () => translations[language.value as "en" | "he" | "ru"].projectInquiry,
  ),
);
provide(
  "projectInquiryFormLabels",
  computed(
    () =>
      translations[language.value as "en" | "he" | "ru"]
        .projectInquiryFormLabels,
  ),
);
provide(
  "checkboxText",
  computed(
    () => translations[language.value as "en" | "he" | "ru"].checkboxText,
  ),
);
provide(
  "discussProjectButtonText",
  computed(
    () =>
      translations[language.value as "en" | "he" | "ru"]
        .discussProjectButtonText,
  ),
);
provide("isRTL", isRTL);
provide("isMobile", isMobile);
provide("language", language);
// Breadcrumbs
type BreadcrumbLabel = { en: string; he: string; ru: string };
type BreadcrumbItem = { label: BreadcrumbLabel; path: string };
const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
  "/": [{ label: { en: "Home", he: "בית", ru: "Главная" }, path: "/" }],
  "/agency": [
    { label: { en: "Home", he: "בית", ru: "Главная" }, path: "/" },
    { label: { en: "Agency", he: "סוכנות", ru: "Агентство" }, path: "/agency" },
  ],
  "/services": [
    { label: { en: "Home", he: "בית", ru: "Главная" }, path: "/" },
    {
      label: { en: "Services", he: "שירותים", ru: "Услуги" },
      path: "/services",
    },
  ],
  "/cases": [
    { label: { en: "Home", he: "בית", ru: "Главная" }, path: "/" },
    { label: { en: "Cases", he: "תיקים", ru: "Кейсы" }, path: "/cases" },
  ],
  "/blog": [
    { label: { en: "Home", he: "בית", ru: "Главная" }, path: "/" },
    { label: { en: "Blog", he: "בלוג", ru: "Блог" }, path: "/blog" },
  ],
  "/contacts": [
    { label: { en: "Home", he: "בית", ru: "Главная" }, path: "/" },
    {
      label: { en: "Contacts", he: "צור קשר", ru: "Контакты" },
      path: "/contacts",
    },
  ],
  "/owner-dashboard": [
    { label: { en: "Home", he: "בית", ru: "Главная" }, path: "/" },
    {
      label: {
        en: "Owner Dashboard",
        he: "איזור בעלים",
        ru: "Панель владельца",
      },
      path: "/owner-dashboard",
    },
  ],
};
const breadcrumbs = computed(() => {
  return (breadcrumbMap[route.path] || breadcrumbMap["/"]).map((bc) => ({
    label: bc.label[language.value as "en" | "he" | "ru"],
    path: bc.path,
  }));
});
const pageNameMap: Record<string, keyof (typeof translations)["en"]["navbar"]> =
  {
    "/agency": "agency",
    "/services": "services",
    "/cases": "cases",
    "/blog": "blog",
    "/contacts": "contacts",
  };
const pageNameKey = computed(() => pageNameMap[route.path] || "");
const pageName = computed(
  () =>
    translations[language.value as "en" | "he" | "ru"]?.navbar[
      pageNameKey.value
    ] || "",
);
// Local handlers for language selector
const showLanguageSelector = ref(false);
function openLanguageSelector() {
  showLanguageSelector.value = true;
}
function closeLanguageSelector() {
  showLanguageSelector.value = false;
}
function selectLanguage(code: string) {
  ui.setLanguage(code);
}

// --- ProjectInquiryMobile submission and notification logic ---
const formData = ref({ name: "", email: "", phone: "", message: "" });
const consent = ref(true); // always true for mobile
const notificationType = ref<"success" | "error" | "processing" | null>(null);
const notificationMessage = ref("");
const notificationMessage1 = ref("");
const notificationVisible = ref(false);
const notificationInscription = ref<string | undefined>(undefined);

async function handleProjectInquirySubmit(formDataInput: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  formData.value = { ...formDataInput };
  // Validation
  if (
    !formData.value.name ||
    !formData.value.email ||
    !formData.value.phone ||
    !formData.value.message
  ) {
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
    name: formData.value.name,
    email: formData.value.email,
    phone: formData.value.phone,
    message: formData.value.message,
    platform: "mobile",
  });
  if (success) {
    notificationType.value = "success";
    notificationInscription.value = "Success!";
    notificationMessage.value = "The response has been sent";
    notificationMessage1.value = "This stuff works!";
    notificationVisible.value = true;
    // Optionally, clear the form:
    // formData.value = { name: "", email: "", phone: "", message: "" };
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
</script>

<template>
  <Disclaimer v-if="showDisclaimer" @accept="handleDisclaimerAccept" />
  <div class="layout-root">
    <RectangleNotification
      v-if="notificationType"
      :type="notificationType"
      :message="notificationMessage"
      :message1="notificationMessage1"
      :isVisible="notificationVisible"
      :alertInscription="notificationInscription"
      @close="handleNotificationClose"
    />
    <MobileFullViewportMenu
      :isOpen="showMobileMenu"
      :isRTL="isRTL"
      :navbarLabels="translations[language]?.navbar || {}"
      :contactLabel="
        translations[language]?.mobileFooter?.questions || 'Contacts'
      "
      :contacts="{
        phone: translations[language]?.mobileFooter?.phone,
        email: translations[language]?.mobileFooter?.email,
        address: translations[language]?.mobileFooter?.address,
      }"
      :onClose="closeMobileMenu"
    />
    <!-- Mobile fixed navbar and spacer -->
    <Navbar
      v-if="isMobile"
      :navbarLabels="translations[language]?.navbar || {}"
      :isRTL="isRTL"
      @openLanguageSelector="openLanguageSelector"
      @openBurgerMenu="openBurgerMenu"
      class="navbar--mobile-fixed"
    />
    <div v-if="isMobile" class="mobile-navbar-spacer"></div>
    <div class="content-overlay">
      <div :class="['layout-bg', { rtl: isRTL }]">
        <!-- Desktop navbar (not fixed, not affected) -->
        <div v-if="!isMobile" class="navbar-area">
          <Navbar
            :navbarLabels="translations[language]?.navbar || {}"
            :isRTL="isRTL"
            @openLanguageSelector="openLanguageSelector"
          />
        </div>
        <div
          class="content-area"
          :class="{ 'custom-scroll': isMobile, rtl: isRTL, ltr: !isRTL }"
        >
          <div class="breadcrumbs-wrapper">
            <Breadcrumbs :items="breadcrumbs" :isRTL="isRTL" />
            <template v-if="pageName">
              <div class="page-name">{{ pageName }}</div>
            </template>
          </div>
          <div class="page-content">
            <slot :language="language" />
          </div>
          <!-- Mobile: ProjectInquiryMobile and MobileFooter (inside content area) -->
          <div v-if="isMobile" class="mobile-inquiry-fullwidth">
            <ProjectInquiryMobile
              v-if="isMobile && route.path === '/cases'"
              :text="translations[language]?.projectInquiry"
              :isRTL="isRTL"
              :labels="translations[language]?.projectInquiryFormLabels"
              :send-text="translations[language]?.projectInquirySendButton"
              :consent-lines="translations[language]?.projectInquiryConsent"
              @submit="handleProjectInquirySubmit"
            />
            <MobileFooter
              v-if="route.path !== '/owner-dashboard'"
              :text="translations[language]?.mobileFooter"
              :isRTL="isRTL"
              :table="translations[language]?.mobileFooter.table"
              :phone="translations[language]?.mobileFooter.phone"
              :email="translations[language]?.mobileFooter.email"
              :address="translations[language]?.mobileFooter.address"
              :questions="translations[language]?.mobileFooter.questions"
              :lang="language"
            />
          </div>
        </div>
        <!-- Desktop: DesktopFooter (outside content-area, full width) -->
        <DesktopFooter
          v-if="!isMobile"
          :text="translations[language]?.mobileFooter"
          :isRTL="isRTL"
          :table="translations[language]?.mobileFooter.table"
          :phone="translations[language]?.mobileFooter.phone"
          :email="translations[language]?.mobileFooter.email"
          :address="translations[language]?.mobileFooter.address"
          :questions="translations[language]?.mobileFooter.questions"
          :lang="language"
        />
        <LanguageSelector
          :isOpen="showLanguageSelector"
          :currentLang="language"
          :languages="languages"
          @select="selectLanguage"
          @close="closeLanguageSelector"
        />
      </div>
    </div>
  </div>
</template>
