export default defineNuxtConfig({
  compatibilityDate: "2026-10-27",
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],
  css: ["~/assets/css/main.css"],
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    adminUserId: process.env.ADMIN_USER_ID || "",
    resendApiKey: process.env.RESEND_API_KEY || "",
    contactEmail: process.env.CONTACT_EMAIL || "oluwatoyinferanmijohn@gmail.com",
    fromEmail: process.env.FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "",
      cvUrl: process.env.NUXT_PUBLIC_CV_URL || "",
    },
  },
  icon: { serverBundle: { collections: ["simple-icons", "logos"] } },
  app: {
    head: {
      title: "Oluwafernmi | Software Engineer",
      meta: [
        { name: "description", content: "I design and build thoughtful digital products, from responsive interfaces to secure full-stack platforms." },
        { name: "theme-color", content: "#141414" },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" },
      ],
    },
  },
});
