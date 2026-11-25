<script setup lang="ts">
import type { PortfolioArticle } from "~/types/article";
const route = useRoute();
const { data: article, error } = await useFetch<PortfolioArticle>(() => `/api/articles/${encodeURIComponent(String(route.params.slug))}`);
const readCount = ref(article.value?.read_count || 0);
const dateLabel = computed(() => article.value?.published_at ? new Date(article.value.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "");
if (article.value) useHead({ title: `${article.value.title} | Oluwafernmi`, meta: [{ name: "description", content: article.value.excerpt }] });
if (error.value) {
  const statusCode = error.value.statusCode || 503;
  throw createError({
    statusCode,
    statusMessage: statusCode === 404
      ? "Article not found"
      : "Articles are unavailable. Apply the articles and readership migrations, then try again.",
  });
}
watch(article, (value) => { if (value) readCount.value = value.read_count || 0; });
onMounted(async () => {
  const current = article.value;
  if (!current) return;
  const key = `portfolio-article-read:${current.slug}`;
  try { if (sessionStorage.getItem(key)) return; } catch { /* Counting can proceed when storage is unavailable. */ }
  try {
    const result = await $fetch<{ readCount: number }>(`/api/articles/${encodeURIComponent(current.slug)}/read`, { method: "POST" });
    readCount.value = result.readCount;
    try { sessionStorage.setItem(key, "1"); } catch { /* The aggregate count is already saved. */ }
  } catch { /* Reading remains available if read counting is temporarily unavailable. */ }
});
</script>

<template>
  <main v-if="article" class="page-wrap min-h-screen pt-36 pb-24 max-w-4xl">
    <NuxtLink to="/blog" class="eyebrow hover:text-gold-accent">← All writing</NuxtLink>
    <p class="eyebrow mt-10">{{ article.category }}<span v-if="dateLabel"> · {{ dateLabel }}</span></p>
    <h1 class="font-serif text-5xl md:text-7xl leading-tight mt-4">{{ article.title }}</h1>
    <p class="text-lg text-muted leading-8 mt-6 max-w-3xl">{{ article.excerpt }}</p>
    <p class="text-xs text-muted mt-4">{{ readCount }} {{ readCount === 1 ? 'read' : 'reads' }}</p>
    <div v-if="article.image_url" class="mt-10 aspect-[1.9] overflow-hidden bg-off-black border border-white/10"><img :src="article.image_url" :alt="`${article.title} cover image`" class="w-full h-full object-cover" /></div>
    <article class="mt-12 text-cream/85 text-base md:text-lg leading-8 whitespace-pre-wrap">{{ article.content }}</article>
    <div v-if="article.image_urls?.length" class="mt-12 grid sm:grid-cols-2 gap-4">
      <img v-for="(image,index) in article.image_urls" :key="image" :src="image" :alt="`${article.title} image ${index + 1}`" class="w-full aspect-[1.35] object-cover border border-white/10" />
    </div>
  </main>
</template>
