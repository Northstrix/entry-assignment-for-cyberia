export default defineNuxtConfig({
  ssr: false, // Disable SSR, enable SPA mode
  modules: ["@pinia/nuxt"],
  runtimeConfig: {
    public: {
      apiLink: "https://api.test.cyberia.studio/api/v1",
    },
  },
});
