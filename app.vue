<script setup lang="ts">
const route = useRoute();
const siteUrl = useRuntimeConfig().public.siteUrl;
const canonicalUrl = computed(() => new URL(route.path, siteUrl).href);
const pageSeo: Record<string, { title: string; description: string }> = {
  "/": { title: "Oluwafernmi | Software Engineer", description: "Full-stack software projects, AI experience, articles, and contact details for Oluwafernmi." },
  "/work": { title: "Projects | Oluwafernmi", description: "Explore software projects across business, commerce, education, health, and entertainment." },
  "/about": { title: "About | Oluwafernmi", description: "Learn about Oluwafernmi's full-stack engineering work and practical AI experience." },
  "/services": { title: "Services | Oluwafernmi", description: "Web applications, backend systems, AI-enabled product work, and thoughtful product refinement." },
  "/blog": { title: "Writing | Oluwafernmi", description: "Thoughts, updates, stories, and articles about building software and using AI with care." },
  "/contact": { title: "Contact | Oluwafernmi", description: "Send Oluwafernmi a message about software projects, collaborations, or opportunities." },
};
const currentSeo = computed(() => pageSeo[route.path] || pageSeo["/"]!);
useHead({ link: [{ rel: "canonical", href: canonicalUrl }], meta: [{ name: "robots", content: computed(() => route.path.startsWith("/dashboard") ? "noindex,nofollow" : "index,follow") }] });
useSeoMeta({
  title: () => currentSeo.value.title,
  description: () => currentSeo.value.description,
  ogTitle: () => currentSeo.value.title,
  ogDescription: () => currentSeo.value.description,
  ogUrl: () => canonicalUrl.value,
  ogImage: `${siteUrl}/images/og-cover.png`,
  ogType: "website",
  twitterCard: "summary_large_image",
});
const showChrome = computed(() => !route.path.startsWith("/dashboard"));
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
</script>
<template>
  <div class="min-h-screen bg-rich-black text-cream">
    <NavBar v-if="showChrome" />
    <NuxtPage />
    <SiteFooter v-if="showChrome" />
    <button v-if="showChrome" class="fixed bottom-5 right-5 z-40 rounded-full border border-white/15 bg-[#1c1c1c]/85 backdrop-blur p-3 hover:border-gold-accent transition" aria-label="Back to top" @click="scrollToTop">↑</button>
  </div>
</template>
