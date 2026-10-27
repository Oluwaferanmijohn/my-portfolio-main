<script setup lang="ts">
const services = [
  { n: "01", title: "Websites and web apps", text: "Responsive, accessible interfaces for brands and products, built with a focus on clarity, speed, and real user needs.", tools: "Vue · Nuxt · React · Tailwind CSS" },
  { n: "02", title: "Backend and data systems", text: "APIs, authentication, databases, and server-side workflows designed to support reliable product experiences.", tools: "Node.js · NestJS · Fastify · Laravel · PostgreSQL · Supabase" },
  { n: "03", title: "AI-enabled product work", text: "Thoughtful AI integrations and AI-assisted development workflows, with careful review of generated output and user-facing behavior.", tools: "Gemini · API integrations · human-reviewed AI workflows" },
  { n: "04", title: "Product refinement", text: "Improve an existing product’s layout, responsiveness, interaction details, and content so the whole experience feels more complete.", tools: "Design systems · performance · responsive polish" },
];
</script>
<template>
  <main class="page-wrap min-h-screen pt-36 pb-24">
    <p class="eyebrow">Ways I can help</p><h1 class="font-serif text-6xl md:text-8xl mt-4">Thoughtful work,<br /><span class="italic text-gold-accent">from idea to launch.</span></h1>
    <p class="text-muted leading-7 max-w-2xl mt-7 mb-14">I work across the full product lifecycle, helping turn an early idea or existing system into software people can use with confidence.</p>
    <div class="border-t border-white/10">
      <article v-for="service in services" :key="service.n" class="grid md:grid-cols-[.2fr_.8fr_1fr] gap-5 md:gap-10 py-8 md:py-10 border-b border-white/10 group">
        <span class="eyebrow">{{ service.n }}</span><h2 class="font-serif text-3xl md:text-4xl group-hover:text-gold-accent transition-colors">{{ service.title }}</h2><div><p class="text-muted leading-7">{{ service.text }}</p><p class="text-xs text-gold-accent mt-4">{{ service.tools }}</p></div>
      </article>
    </div>
    <NuxtLink to="/contact" class="inline-flex mt-12 px-6 py-4 bg-cream text-rich-black text-xs uppercase tracking-widest hover:bg-gold-accent transition">Tell me what you need ↗</NuxtLink>
  </main>
</template>
