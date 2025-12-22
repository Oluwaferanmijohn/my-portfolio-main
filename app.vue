<template>
  <div
    class="bg-rich-black min-h-screen text-cream selection:bg-cream selection:text-rich-black font-sans"
  >
    <NavBar />
    <NuxtPage />
    <SiteFooter />
 <button
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 animate-bounce p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30 transition-colors"
      aria-label="Back to Top"
    >
      <Icon
        class="text-white"
        name="lucide:arrow-up"
        size="25"
      />
    </button>  
 </div>
</template>
<script setup>
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>
