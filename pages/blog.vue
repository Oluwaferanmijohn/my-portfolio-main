<script setup lang="ts">
import type { PortfolioArticle } from "~/types/article";
const { data: articles, error } = await useFetch<PortfolioArticle[]>("/api/articles", { default: () => [] });
const dateLabel = (value: string | null) => value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";
</script>

<template>
  <main class="page-wrap min-h-screen pt-36 pb-24">
    <p class="eyebrow">Notes, stories, and updates</p>
    <h1 class="font-serif text-6xl md:text-8xl mt-4">Thinking <span class="italic text-gold-accent">out loud.</span></h1>
    <p class="text-muted max-w-2xl leading-7 mt-7">Writing about building software, working across the product stack, learning in public, and using AI tools with care.</p>
    <div v-if="articles?.length" class="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-7">
      <article v-for="article in articles" :key="article.id" class="group border-t border-white/10 pt-5">
        <NuxtLink :to="`/blog/${article.slug}`" class="block">
          <div class="aspect-[1.5] overflow-hidden bg-off-black border border-white/5 mb-5">
            <img v-if="article.image_url" :src="article.image_url" :alt="`${article.title} cover image`" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.025] transition duration-700" />
            <div v-else class="w-full h-full grid place-items-center font-serif text-6xl italic text-gold-accent/50">{{ article.title.slice(0, 1) }}</div>
          </div>
          <p class="eyebrow">{{ article.category }}<span v-if="article.published_at"> · {{ dateLabel(article.published_at) }}</span></p>
          <h2 class="font-serif text-3xl mt-3 group-hover:text-gold-accent transition-colors">{{ article.title }}</h2>
          <p class="text-sm text-muted leading-6 mt-3">{{ article.excerpt }}</p>
          <span class="inline-block mt-5 text-xs uppercase tracking-widest text-gold-accent">Read article ↗</span>
        </NuxtLink>
      </article>
    </div>
    <p v-else-if="error" class="text-muted mt-14">The blog is getting ready. Apply the articles migration to publish the sample articles and start writing.</p>
    <p v-else class="text-muted mt-14">No articles have been published yet.</p>
  </main>
</template>
