<script setup lang="ts">
const config = useRuntimeConfig();
const { data: cvSettings } = await useFetch<{ cvUrl: string }>("/api/settings/cv", { default: () => ({ cvUrl: "" }) });
const cvUrl = computed(() => cvSettings.value?.cvUrl || config.public.cvUrl);
const { track } = usePortfolioAnalytics();
</script>
<template>
  <main class="page-wrap min-h-screen pt-36 pb-24">
    <p class="eyebrow">A little about me</p>
    <div class="grid lg:grid-cols-[1fr_.8fr] gap-12 lg:gap-24 mt-5 items-start">
      <div><h1 class="font-serif text-6xl md:text-8xl leading-[1.04]">I care about<br /><span class="italic text-gold-accent">how things work.</span></h1><p class="text-muted text-lg leading-8 mt-9 max-w-2xl">I’m Oluwafernmi, a software developer who enjoys turning complex ideas into clear, usable products. I work across frontend experiences, backend services, databases, and the details that make software feel considered.</p><p class="text-muted leading-7 mt-5 max-w-2xl">My projects span business platforms, commerce, education, health, and entertainment. I’ve worked with Vue and Nuxt, React, Laravel and PHP, SQL and PostgreSQL, Supabase, Firebase, and a growing set of backend and mobile tools.</p><a v-if="cvUrl" :href="cvUrl" target="_blank" rel="noreferrer" class="inline-flex mt-8 px-6 py-4 bg-cream text-rich-black text-xs uppercase tracking-widest" @click="track('cv_click')">View my CV ↗</a></div>
      <aside class="bg-off-black border border-white/10 p-7 md:p-9"><p class="eyebrow">How I like to work</p><div v-for="item in [{n:'01',title:'Start with the problem',text:'Understand the people and purpose before settling on a technical answer.'},{n:'02',title:'Build across the stack',text:'Connect thoughtful interfaces to clear APIs, reliable data, and maintainable systems.'},{n:'03',title:'Use AI with judgment',text:'Use AI to accelerate research, prototyping, and code iteration, then review the result and own the decisions.'} ]" :key="item.n" class="border-t border-white/10 mt-6 pt-6"><span class="eyebrow">{{ item.n }}</span><h2 class="font-serif text-2xl mt-2">{{ item.title }}</h2><p class="text-sm text-muted leading-6 mt-2">{{ item.text }}</p></div></aside>
    </div>
  </main>
</template>
