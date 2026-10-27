<script setup lang="ts">
const route = useRoute();
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
