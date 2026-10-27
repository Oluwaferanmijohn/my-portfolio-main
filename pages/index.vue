<script setup lang="ts">
import type { PortfolioProject } from "~/types/project";
import { fallbackProjects } from "~/data/fallback-projects";
const { data } = await useFetch<PortfolioProject[]>("/api/projects", { default: () => [] });
const projects = computed(() => data.value?.length ? data.value : fallbackProjects);
const skills = ["HTML", "CSS", "Vue.js", "React", "Nuxt 4", "Laravel", "PHP", "TypeScript", "JavaScript", "Tailwind CSS", "PostCSS", "Autoprefixer", "PostgreSQL", "MySQL", "SQL", "Supabase", "Firebase", "Node.js", "NestJS", "Express", "Fastify", "Prisma", "Redis", "AWS SDK", "Amazon S3", "Capacitor", "Android", "iOS", "Pinia", "WebSockets", "PWA", "Zod", "REST APIs", "JWT", "Rate limiting", "Multipart uploads", "Google Gemini", "WhatsApp integrations", "Baileys", "QR codes", "Cron jobs", "Git", "GitHub", "npm", "Vercel", "Netlify", "Vitest", "Playwright", "Jest", "Supertest", "Sentry", "Pino", "RxJS", "ESLint", "AI-assisted development"];
</script>
<template>
  <main class="bg-rich-black text-cream overflow-hidden">
    <section class="page-wrap min-h-[82vh] flex flex-col justify-center pt-28 pb-20 relative">
      <div class="absolute right-0 top-1/3 w-64 h-64 md:w-96 md:h-96 rounded-full bg-amber-200/5 blur-3xl pointer-events-none"></div>
      <p class="eyebrow reveal">Software engineer · Product builder · AI practitioner</p>
      <h1 class="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[.98] mt-7 reveal">I build <span class="italic text-gold-accent">useful</span><br />digital things.</h1>
      <div class="mt-9 flex flex-col sm:flex-row gap-7 sm:items-end justify-between max-w-5xl reveal">
        <p class="text-muted leading-7 max-w-xl">I’m Oluwafernmi, a full-stack software developer creating thoughtful digital products, from polished interfaces to the systems that power them. I use AI as a practical part of how I research, prototype, and ship software.</p>
        <a href="#projects" class="inline-flex items-center gap-3 uppercase tracking-[.18em] text-xs border-b border-gold-accent pb-3 hover:text-gold-accent transition-colors">Explore selected work ↓</a>
      </div>
      <div class="mt-16 pt-6 border-t border-white/10 flex flex-wrap gap-x-8 gap-y-3 text-[11px] uppercase tracking-[.18em] text-muted"><span>Full-stack development</span><span>AI-enabled workflows</span><span>Based in Nigeria</span></div>
    </section>

    <section class="py-24 md:py-32 bg-off-black/60">
      <div class="page-wrap grid md:grid-cols-[.8fr_1.2fr] gap-10 md:gap-20 items-start">
        <div><p class="eyebrow">What I bring</p><h2 class="font-serif text-4xl md:text-5xl mt-5">From a clear idea<br />to a real product.</h2></div>
        <div><p class="text-muted leading-8">I work across the product stack: understanding the problem, shaping the experience, building the frontend and backend, and connecting reliable data services. My experience spans portfolio and business websites, commerce, education, health, and interactive products.</p><p class="text-muted leading-8 mt-5">I use AI tools to speed up research, explore implementation options, generate and refine code, and improve documentation. I review the output, validate decisions, and stay responsible for the final product.</p><div class="grid sm:grid-cols-2 gap-4 mt-10"><div class="border-t border-white/15 pt-4"><span class="eyebrow">01</span><h3 class="mt-3">Product-minded engineering</h3><p class="text-sm text-muted mt-2">Interfaces and systems designed around the people using them.</p></div><div class="border-t border-white/15 pt-4"><span class="eyebrow">02</span><h3 class="mt-3">AI in the workflow</h3><p class="text-sm text-muted mt-2">AI-assisted development with human review and practical judgment.</p></div></div></div>
      </div>
    </section>

    <section id="projects" class="page-wrap py-24 md:py-32 scroll-mt-24">
      <div class="flex flex-wrap justify-between items-end gap-5 mb-12"><div><p class="eyebrow">Selected work</p><h2 class="font-serif text-5xl md:text-6xl mt-4">Projects <span class="italic text-gold-accent">with purpose.</span></h2></div><NuxtLink to="/work" class="text-xs uppercase tracking-widest border border-white/20 rounded-full px-5 py-3 hover:border-gold-accent transition">All projects ↗</NuxtLink></div>
      <div v-if="projects.length" class="grid md:grid-cols-2 gap-6">
        <article v-for="(project,index) in projects.filter(p => p.featured).slice(0,6)" :key="project.id" class="group" :class="index===0 ? 'md:col-span-2' : ''">
          <a :href="project.project_url || '/work'" :target="project.project_url ? '_blank' : undefined" rel="noreferrer" class="block">
            <div class="aspect-[1.65] overflow-hidden bg-off-black border border-white/5 relative"><img v-if="project.image_url" :src="project.image_url" :alt="`${project.title} project preview`" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.025] transition duration-700" /><div v-else class="w-full h-full grid place-items-center text-gold-accent/50 font-serif text-6xl">{{ project.title.slice(0,1) }}</div><span class="absolute top-4 left-4 bg-rich-black/80 px-3 py-2 eyebrow">{{ project.category }}</span><span class="absolute right-4 top-4 bg-rich-black/80 px-3 py-2 text-[10px] uppercase tracking-widest">{{ project.status }}</span></div>
            <div class="flex justify-between gap-4 items-start py-5 border-b border-white/10"><div><h3 class="font-serif text-2xl md:text-3xl group-hover:text-gold-accent transition">{{ project.title }}</h3><p class="text-sm text-muted mt-2 max-w-xl">{{ project.summary }}</p></div><span class="mt-1 text-gold-accent shrink-0">↗</span></div>
          </a>
        </article>
      </div>
    </section>

    <section class="bg-off-black/60 py-24 md:py-28"><div class="page-wrap grid md:grid-cols-[.7fr_1.3fr] gap-10 md:gap-16"><div><p class="eyebrow">Tools I work with</p><h2 class="font-serif text-4xl md:text-5xl mt-4">A toolkit that<br />keeps growing.</h2></div><div><p class="text-muted leading-7 mb-7">Languages, frameworks, databases, and services I’ve worked with across my software projects.</p><div class="flex flex-wrap gap-2"> <span v-for="skill in skills" :key="skill" class="px-4 py-2 border border-white/10 text-sm text-cream/80 hover:border-gold-accent/60 transition">{{ skill }}</span></div></div></div></section>

    <section class="page-wrap py-24 md:py-32 grid md:grid-cols-[1fr_1fr] gap-12 items-center"><div><p class="eyebrow">Let’s make something meaningful</p><h2 class="font-serif text-5xl md:text-7xl mt-5">Have a good<br /><span class="italic text-gold-accent">problem to solve?</span></h2></div><div class="md:justify-self-end"><p class="text-muted leading-7 max-w-md">Tell me what you’re working on. I’m open to thoughtful collaborations and software roles where I can build, learn, and make a difference.</p><div class="flex flex-wrap gap-3 mt-7"><NuxtLink to="/contact" class="bg-cream text-rich-black px-6 py-4 text-xs uppercase tracking-widest hover:bg-gold-accent transition">Start a conversation</NuxtLink><a href="mailto:oluwatoyinferanmijohn@gmail.com" class="border border-white/20 px-6 py-4 text-xs uppercase tracking-widest hover:border-gold-accent transition">Email directly</a></div></div></section>
  </main>
</template>
