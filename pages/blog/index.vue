<script setup lang="ts">
import type { PortfolioArticleSummary } from "~/types/article";
const route = useRoute();
const page = computed(() => {
  const number = Number(route.query.page ?? 1);
  return Number.isSafeInteger(number) && number > 0 ? number : 1;
});
const { data: listing, error, refresh } = await useFetch<{ articles: PortfolioArticleSummary[]; total: number; page: number; pageSize: number }>("/api/articles", { query: { page }, default: () => ({ articles: [], total: 0, page: 1, pageSize: 9 }) });
const articles = computed(() => listing.value?.articles || []);
const dateLabel = (value: string | null) => value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";
</script>

<template>
  <main class="page-wrap min-h-screen pt-36 pb-24">
    <p class="eyebrow">Notes, stories, and updates</p>
    <h1 class="font-serif text-6xl md:text-8xl mt-4">Thinking <span class="italic text-gold-accent">out loud.</span></h1>
    <p class="text-muted max-w-2xl leading-7 mt-7">Writing about building software, working across the product stack, learning in public, and using AI tools with care.</p>
    <div v-if="error" class="text-red-300 mt-14">Articles could not be loaded. <button class="underline" @click="() => refresh()">Retry</button></div>
    <div v-else-if="articles?.length" class="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-7">
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
          <span class="block mt-3 text-xs text-muted">{{ article.read_count || 0 }} reads</span>
        </NuxtLink>
      </article>
    </div>
    <p v-else class="text-muted mt-14">No articles have been published yet.</p>
    <nav v-if="!error && (listing?.total || 0) > (listing?.pageSize || 9)" aria-label="Blog pages" class="flex items-center justify-between gap-4 mt-12 text-sm"><NuxtLink v-if="page > 1" :to="`/blog?page=${page - 1}`" class="border border-white/20 px-4 py-3">← Previous</NuxtLink><span v-else></span><span class="text-muted">Page {{ page }} of {{ Math.ceil((listing?.total || 0) / (listing?.pageSize || 9)) }}</span><NuxtLink v-if="page < Math.ceil((listing?.total || 0) / (listing?.pageSize || 9))" :to="`/blog?page=${page + 1}`" class="border border-white/20 px-4 py-3">Next →</NuxtLink><span v-else></span></nav>
  </main>
</template>
