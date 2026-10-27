<script setup lang="ts">
const isOpen = ref(false);
const route = useRoute();
const config = useRuntimeConfig();
const { data: cvSettings } = await useFetch<{ cvUrl: string }>("/api/settings/cv", { default: () => ({ cvUrl: "" }) });
const cvUrl = computed(() => cvSettings.value?.cvUrl || config.public.cvUrl);
const { track } = usePortfolioAnalytics();
watch(() => route.fullPath, () => { isOpen.value = false; });
</script>
<template>
  <nav class="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
    <div class="px-4 md:px-6 py-3 rounded-full bg-[#1c1c1c]/85 backdrop-blur-xl border border-white/10 flex items-center justify-between gap-4 shadow-xl">
      <NuxtLink to="/" class="text-cream font-semibold tracking-[.14em] text-xs md:text-sm shrink-0">OLUWAFERNMI<span class="text-gold-accent">.</span></NuxtLink>
      <div class="hidden md:flex items-center gap-7 text-[11px] tracking-[.14em] text-muted"><NuxtLink to="/" class="hover:text-cream">HOME</NuxtLink><NuxtLink to="/work" class="hover:text-cream">WORK</NuxtLink><NuxtLink to="/about" class="hover:text-cream">ABOUT</NuxtLink><NuxtLink to="/services" class="hover:text-cream">SERVICES</NuxtLink><NuxtLink to="/contact" class="hover:text-cream">CONTACT</NuxtLink></div>
      <div class="flex items-center gap-2"><a v-if="cvUrl" :href="cvUrl" target="_blank" rel="noreferrer" class="hidden sm:inline text-[10px] uppercase tracking-widest px-3 py-2 text-muted hover:text-gold-accent" @click="track('cv_click')">CV ↗</a><NuxtLink to="/contact" class="bg-cream text-rich-black px-4 py-2 rounded-full text-[10px] font-semibold uppercase tracking-widest hover:bg-gold-accent transition">Let’s talk</NuxtLink><button class="md:hidden text-cream p-2 text-lg" :aria-expanded="isOpen" aria-label="Toggle navigation" @click="isOpen=!isOpen">{{ isOpen ? '×' : '☰' }}</button></div>
    </div>
    <div v-if="isOpen" class="md:hidden mt-2 bg-[#1c1c1c]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-4 text-xs tracking-widest"><NuxtLink to="/" class="text-muted">HOME</NuxtLink><NuxtLink to="/work" class="text-muted">WORK</NuxtLink><NuxtLink to="/about" class="text-muted">ABOUT</NuxtLink><NuxtLink to="/services" class="text-muted">SERVICES</NuxtLink><NuxtLink to="/contact" class="text-muted">CONTACT</NuxtLink><a v-if="cvUrl" :href="cvUrl" target="_blank" rel="noreferrer" class="text-muted" @click="track('cv_click')">DOWNLOAD CV ↗</a></div>
  </nav>
</template>
