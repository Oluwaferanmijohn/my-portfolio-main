<script setup lang="ts">
import type { PortfolioProject } from "~/types/project";
import { fallbackProjects } from "~/data/fallback-projects";
const { data } = await useFetch<PortfolioProject[]>("/api/projects", { default: () => [] });
const projects = computed(() => data.value?.length ? data.value : fallbackProjects);
</script>
<template>
  <main class="page-wrap pt-36 pb-24 min-h-screen">
    <p class="eyebrow">A growing body of work</p><h1 class="font-serif text-6xl md:text-8xl mt-4">Selected <span class="italic text-gold-accent">projects.</span></h1>
    <p class="text-muted max-w-2xl leading-7 mt-7 mb-14">A collection of software products and digital experiences across commerce, education, health, entertainment, and business. Each project includes its concept, completion status, and the technologies recorded in the project portfolio.</p>
    <div v-if="projects.length" class="grid md:grid-cols-2 gap-x-7 gap-y-12">
      <article v-for="project in projects" :key="project.id" class="group border-t border-white/10 pt-5">
        <div class="aspect-[1.6] bg-off-black overflow-hidden border border-white/5"><img v-if="project.image_url" :src="project.image_url" :alt="`${project.title} project preview`" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.025] transition duration-700" /><div v-else class="h-full grid place-items-center font-serif text-7xl text-gold-accent/40">{{ project.title.slice(0,1) }}</div></div>
        <div class="flex justify-between items-start gap-4 mt-5"><div><p class="eyebrow">{{ project.category }} · {{ project.status }}</p><h2 class="font-serif text-3xl mt-2">{{ project.title }}</h2></div><a v-if="project.project_url" :href="project.project_url" target="_blank" rel="noreferrer" class="p-3 border border-white/15 hover:border-gold-accent" :aria-label="`Visit ${project.title}`">↗</a></div>
        <p class="text-muted leading-6 mt-3">{{ project.summary }}</p>
        <div class="mt-5 border-l border-gold-accent/50 pl-4"><p class="text-xs uppercase tracking-widest text-gold-accent">Concept</p><p class="text-sm text-muted mt-2 leading-6">{{ project.concept }}</p></div>
        <div v-if="project.ai_experience" class="mt-4 border-l border-white/15 pl-4"><p class="text-xs uppercase tracking-widest">AI in the workflow</p><p class="text-sm text-muted mt-2 leading-6">{{ project.ai_experience }}</p></div>
        <div class="flex flex-wrap gap-2 mt-5"><span v-for="tech in project.technologies" :key="tech" class="text-xs text-muted border border-white/10 px-2.5 py-1">{{ tech }}</span></div>
      </article>
    </div>
  </main>
</template>
