<script setup lang="ts">
import type { PortfolioArticle } from "~/types/article";
import { renderArticleMarkdown } from "~/utils/articleMarkdown";
const route = useRoute();
const { data: article, error } = await useFetch<PortfolioArticle>(() => `/api/articles/${encodeURIComponent(String(route.params.slug))}`);
const readCount = ref(article.value?.read_count || 0);
const articleBody = ref<HTMLElement | null>(null);
const dateLabel = computed(() => article.value?.published_at ? new Date(article.value.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "");
useSeoMeta({
  title: () => article.value ? `${article.value.title} | Oluwafernmi` : "Article | Oluwafernmi",
  description: () => article.value?.excerpt || "Read an article by Oluwafernmi.",
  ogTitle: () => article.value?.title || "Article | Oluwafernmi",
  ogDescription: () => article.value?.excerpt || "Read an article by Oluwafernmi.",
  ogImage: () => article.value?.image_url || "https://oluwaferanmijohn.name.ng/images/og-cover.png",
  ogType: "article",
});
if (error.value) {
  const statusCode = error.value.statusCode || 503;
  throw createError({
    statusCode,
    statusMessage: statusCode === 404
      ? "Article not found"
      : "This article is temporarily unavailable. Please try again later.",
  });
}
watch(article, (value) => { if (value) readCount.value = value.read_count || 0; });
let readerTimer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  let activeSlug = "";
  let secondsVisible = 0;
  let attempted = false;
  readerTimer = setInterval(async () => {
    const current = article.value;
    const body = articleBody.value;
    if (!current || !body) return;
    if (activeSlug !== current.slug) { activeSlug = current.slug; secondsVisible = 0; attempted = false; }
    if (attempted || document.visibilityState !== "visible") return;
    const key = `portfolio-article-read:${current.slug}`;
    try { if (sessionStorage.getItem(key)) return; } catch { /* Server still deduplicates reads. */ }
    secondsVisible += 1;
    const reachedContent = window.scrollY + window.innerHeight >= body.offsetTop + body.offsetHeight * 0.6;
    if (secondsVisible < 20 || !reachedContent) return;
    attempted = true;
    try {
      const result = await $fetch<{ readCount: number }>(`/api/articles/${encodeURIComponent(current.slug)}/read`, { method: "POST" });
      readCount.value = result.readCount;
      try { sessionStorage.setItem(key, "1"); } catch { /* Server still deduplicates reads. */ }
    } catch { /* Reading remains available if the counter is unavailable. */ }
  }, 1000);
});
onUnmounted(() => { if (readerTimer) clearInterval(readerTimer); });
</script>

<template>
  <main v-if="article" class="page-wrap min-h-screen pt-36 pb-24 max-w-4xl">
    <NuxtLink to="/blog" class="eyebrow hover:text-gold-accent">← All writing</NuxtLink>
    <p class="eyebrow mt-10">{{ article.category }}<span v-if="dateLabel"> · {{ dateLabel }}</span></p>
    <h1 class="font-serif text-5xl md:text-7xl leading-tight mt-4">{{ article.title }}</h1>
    <p class="text-lg text-muted leading-8 mt-6 max-w-3xl">{{ article.excerpt }}</p>
    <p class="text-xs text-muted mt-4">{{ readCount }} {{ readCount === 1 ? 'read' : 'reads' }}</p>
    <div v-if="article.image_url" class="mt-10 aspect-[1.5] overflow-hidden bg-off-black border border-white/10"><img :src="article.image_url" :alt="`${article.title} cover image`" class="w-full h-full object-cover" /></div>
    <article ref="articleBody" class="article-prose mt-12 text-cream/85 text-base md:text-lg leading-8" v-html="renderArticleMarkdown(article.content)" />
    <div v-if="article.image_urls?.length" class="mt-12 grid sm:grid-cols-2 gap-4">
      <img v-for="(image,index) in article.image_urls" :key="image" :src="image" :alt="`${article.title} image ${index + 1}`" class="w-full aspect-[1.35] object-cover border border-white/10" />
    </div>
  </main>
</template>
