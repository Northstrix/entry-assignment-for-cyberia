import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUiStore = defineStore("ui", () => {
  // Language (string)
  const language = ref<string>("en");

  // Selected category (number or null)
  const selectedCategory = ref<number | null>(null);

  // RTL computed from language
  const isRTL = computed(() => language.value === "he");

  // Setters
  function setLanguage(lang: string) {
    language.value = lang;
    localStorage.setItem("lang", lang);
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  }

  function setSelectedCategory(id: number | null) {
    selectedCategory.value = id;
  }

  return {
    language,
    isRTL,
    selectedCategory,
    setLanguage,
    setSelectedCategory,
  };
});
