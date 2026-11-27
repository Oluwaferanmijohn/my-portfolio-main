<script setup lang="ts">
import type { PortfolioProject } from "~/types/project";
import type { PortfolioArticle } from "~/types/article";
import { extractArticleImageUrls, renderArticleMarkdown } from "~/utils/articleMarkdown";
definePageMeta({ middleware: "dashboard" });
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { data: projects, error: projectsError, refresh: refreshProjects } = await useFetch<PortfolioProject[]>("/api/dashboard/projects", { default: () => [] });
const { data: overview, error: overviewError, refresh: refreshOverview } = await useFetch<any>("/api/dashboard/overview", { default: () => ({ projectCount: 0, visits: 0, visitsToday: 0, cvClicks: 0, contacts: 0, unreadMessages: 0 }) });
const inboxPage = ref(1);
const retryingEmailId = ref<string | null>(null);
const { data: inbox, error: inboxError, refresh: refreshMessages } = await useFetch<{ messages: any[]; total: number; page: number; pageSize: number }>("/api/dashboard/messages", { query: { page: inboxPage }, default: () => ({ messages: [], total: 0, page: 1, pageSize: 20 }) });
const emailPage = ref(1);
const { data: inboundEmails, error: inboundError, refresh: refreshInboundEmails } = await useFetch<{ emails: any[]; total: number; page: number; pageSize: number }>("/api/dashboard/inbound-emails", { query: { page: emailPage }, default: () => ({ emails: [], total: 0, page: 1, pageSize: 20 }) });
const { data: cvSettings, error: cvError, refresh: refreshCv } = await useFetch<{ cvUrl: string }>("/api/settings/cv", { default: () => ({ cvUrl: "" }) });
const { data: articles, error: articlesError, refresh: refreshArticles } = await useFetch<PortfolioArticle[]>("/api/dashboard/articles", { default: () => [] });
function fetchErrorText(error: unknown, fallback: string) {
  const detail = error as { data?: { statusMessage?: string }; statusMessage?: string } | null;
  return detail?.data?.statusMessage || detail?.statusMessage || fallback;
}
const totalArticleReads = computed(() => articles.value?.reduce((total, article) => total + (article.read_count || 0), 0) || 0);
const dashboardMetrics = computed(() => [
  { label: "Projects", value: overview.value?.projectCount, unavailable: Boolean(overviewError.value) },
  { label: "Articles", value: articles.value?.length, unavailable: Boolean(articlesError.value) },
  { label: "Article reads", value: totalArticleReads.value, unavailable: Boolean(articlesError.value) },
  { label: "Visit sessions", value: overview.value?.visits, unavailable: Boolean(overviewError.value) },
  { label: "Sessions today", value: overview.value?.visitsToday, unavailable: Boolean(overviewError.value) },
  { label: "CV click sessions", value: overview.value?.cvClicks, unavailable: Boolean(overviewError.value) },
  { label: "Unread messages", value: overview.value?.unreadMessages, unavailable: Boolean(overviewError.value) },
]);
const selected = ref<PortfolioProject | null>(null);
const technologies = ref("");
const saving = ref(false);
const uploadingImage = ref(false);
const uploadingCv = ref(false);
const uploadingArticleImage = ref(false);
const uploadingArticleGallery = ref(false);
type CropTarget = "project" | "article-cover" | "article-gallery" | "article-inline";
const cropTarget = ref<CropTarget | null>(null);
const cropFiles = shallowRef<File[]>([]);
const cropIndex = ref(0);
const cropError = ref("");
const cropFile = computed(() => cropFiles.value[cropIndex.value] || null);
const cropAspectRatio = computed(() => cropTarget.value === "project" ? 1.6 : ["article-gallery", "article-inline"].includes(cropTarget.value || "") ? 1.35 : 1.5);
const cropTitle = computed(() => cropTarget.value === "project" ? "Crop project image" : cropTarget.value === "article-inline" ? "Crop inline article image" : cropTarget.value === "article-gallery" ? `Crop article image ${cropIndex.value + 1} of ${cropFiles.value.length}` : "Crop article cover");
const cropBusy = computed(() => uploadingImage.value || uploadingArticleImage.value || uploadingArticleGallery.value);
let projectEditorVersion = 0;
let articleEditorVersion = 0;
let cropEditorVersion = 0;
type UploadContext = "project" | "article" | "cv";
const pendingUploads = new Map<string, UploadContext>();
const pendingUploadsKey = "portfolio-pending-uploads";
function persistPendingUploads() {
  if (!import.meta.client) return;
  try { sessionStorage.setItem(pendingUploadsKey, JSON.stringify([...pendingUploads])); } catch { /* The current page can still clean up uploads. */ }
}
function trackPendingUpload(url: string, context: UploadContext) {
  pendingUploads.set(url, context);
  persistPendingUploads();
}
async function cleanupPendingUploads(urls: string[]) {
  for (const url of urls) {
    if (!pendingUploads.has(url)) continue;
    try {
      await $fetch("/api/dashboard/upload", { method: "DELETE", body: { url } });
      pendingUploads.delete(url);
      persistPendingUploads();
    } catch { /* Keep the URL for another cleanup attempt when the dashboard opens again. */ }
  }
}
async function settlePendingUploads(context: UploadContext, savedUrls: string[]) {
  const committed = new Set(savedUrls);
  const unused: string[] = [];
  for (const [url, owner] of pendingUploads) {
    if (owner !== context) continue;
    if (committed.has(url)) pendingUploads.delete(url);
    else unused.push(url);
  }
  persistPendingUploads();
  await cleanupPendingUploads(unused);
}
function discardPendingUploads(context: UploadContext) {
  void cleanupPendingUploads([...pendingUploads].filter(([, owner]) => owner === context).map(([url]) => url));
}
const notice = ref("");
const inboxNotice = ref("");
const articleNotice = ref("");
const blank = (): Partial<PortfolioProject> => ({ title: "", slug: "", category: "Software", summary: "", concept: "", ai_experience: "", status: "Complete", image_url: "", preview_is_concept: false, project_url: "", technologies: [], featured: false, sort_order: (projects.value?.length || 0) * 10 });
const form = reactive<Partial<PortfolioProject>>(blank());
const selectedArticle = ref<PortfolioArticle | null>(null);
const blankArticle = (): Partial<PortfolioArticle> => ({ title: "", slug: "", excerpt: "", content: "", category: "Notes", image_url: "", image_urls: [], status: "Draft" });
const articleForm = reactive<Partial<PortfolioArticle>>(blankArticle());
const articleTextarea = ref<HTMLTextAreaElement | null>(null);
let inlineInsertionAt = 0;
function insertArticleMarkdown(before: string, after = "", placeholder = "text") {
  const input = articleTextarea.value;
  const content = articleForm.content || "";
  const start = input?.selectionStart ?? content.length;
  const end = input?.selectionEnd ?? content.length;
  const selectedText = content.slice(start, end) || placeholder;
  articleForm.content = content.slice(0, start) + before + selectedText + after + content.slice(end);
  void nextTick(() => { input?.focus(); input?.setSelectionRange(start + before.length, start + before.length + selectedText.length); });
}
const push = usePortfolioPush();
const installAvailable = ref(false);
type InstallPromptEvent = Event & { prompt: () => Promise<void> };
let installPrompt: InstallPromptEvent | null = null;
function syncInstallPrompt() {
  installPrompt = (window as Window & { portfolioInstallPrompt?: InstallPromptEvent }).portfolioInstallPrompt || null;
  installAvailable.value = Boolean(installPrompt);
}
let inboxRefreshTimer: ReturnType<typeof setInterval> | undefined;
function edit(project?: PortfolioProject) {
  if (uploadingImage.value || cropTarget.value === "project") { notice.value = "Finish the image upload before switching projects."; return; }
  discardPendingUploads("project");
  projectEditorVersion++;
  selected.value = project || null; Object.assign(form, blank(), project || {}); technologies.value = project?.technologies.join(", ") || "";
}
function editArticle(article?: PortfolioArticle) {
  if (uploadingArticleImage.value || uploadingArticleGallery.value || cropTarget.value?.startsWith("article-")) { articleNotice.value = "Finish the image upload before switching articles."; return; }
  discardPendingUploads("article");
  articleEditorVersion++;
  selectedArticle.value = article || null;
  Object.assign(articleForm, blankArticle(), article || {}, { image_urls: [...(article?.image_urls || [])] });
}
function refreshInbox() { void Promise.all([refreshOverview(), refreshMessages()]); }
async function save() {
  if (cropTarget.value === "project" || uploadingImage.value) return;
  saving.value = true; notice.value = "";
  try {
    const path = selected.value ? `/api/dashboard/projects/${selected.value.id}` : "/api/dashboard/projects";
    const saved = await $fetch<PortfolioProject>(path, { method: selected.value ? "PUT" : "POST", body: { ...form, technologies: technologies.value.split(",").map((x) => x.trim()).filter(Boolean) } });
    await settlePendingUploads("project", [saved.image_url]);
    await refreshProjects(); edit(); notice.value = "Project saved.";
  } catch (error: any) { notice.value = error?.data?.statusMessage || "Could not save project."; }
  finally { saving.value = false; }
}
async function remove(project: PortfolioProject) {
  if (uploadingImage.value || cropTarget.value === "project") { notice.value = "Finish the image upload before deleting a project."; return; }
  if (!confirm(`Delete ${project.title}?`)) return;
  try {
    await $fetch(`/api/dashboard/projects/${project.id}`, { method: "DELETE" });
    if (selected.value?.id === project.id) edit();
    await refreshProjects(); await refreshOverview(); notice.value = "Project deleted.";
  }
  catch (error: any) { notice.value = error?.data?.statusMessage || "Could not delete project."; }
}
function openCrop(event: Event, target: CropTarget) {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  input.value = "";
  if (!files.length || cropTarget.value || cropBusy.value) return;
  const remaining = target === "article-gallery" ? 12 - (articleForm.image_urls?.length || 0) : 1;
  if (remaining <= 0) { articleNotice.value = "Remove an article image before adding another."; return; }
  if (target === "article-gallery" && files.length > remaining) articleNotice.value = `Only ${remaining} more article images can be added.`;
  cropFiles.value = files.slice(0, remaining);
  cropIndex.value = 0;
  cropTarget.value = target;
  cropEditorVersion = target === "project" ? projectEditorVersion : articleEditorVersion;
  cropError.value = "";
}
function closeCrop() {
  if (cropBusy.value) return;
  cropTarget.value = null;
  cropFiles.value = [];
  cropIndex.value = 0;
  cropError.value = "";
}
async function uploadCroppedImage(file: File) {
  const target = cropTarget.value;
  if (!target || cropBusy.value) return;
  const data = new FormData(); data.append("file", file);
  if (target === "project") uploadingImage.value = true;
  else if (target === "article-cover") uploadingArticleImage.value = true;
  else uploadingArticleGallery.value = true;
  cropError.value = "";
  try {
    const result = await $fetch<{ url: string }>("/api/dashboard/upload", { method: "POST", body: data });
    trackPendingUpload(result.url, target === "project" ? "project" : "article");
    if (target === "project" && cropEditorVersion === projectEditorVersion) {
      form.image_url = result.url;
      notice.value = "Image uploaded. Save the project to publish it.";
    } else if (target === "article-cover" && cropEditorVersion === articleEditorVersion) {
      articleForm.image_url = result.url;
      articleNotice.value = "Cover image uploaded. Save the article to keep it.";
    } else if (target === "article-gallery" && cropEditorVersion === articleEditorVersion) {
      articleForm.image_urls = [...(articleForm.image_urls || []), result.url];
      articleNotice.value = `${articleForm.image_urls.length} article images ready. Save the article to keep them.`;
    } else if (target === "article-inline" && cropEditorVersion === articleEditorVersion) {
      const content = articleForm.content || "";
      const position = Math.min(inlineInsertionAt, content.length);
      articleForm.content = `${content.slice(0, position)}\n\n![Article image](${result.url})\n\n${content.slice(position)}`;
      articleNotice.value = "Image inserted in the article. Save the article to keep it.";
    }
    if (cropEditorVersion !== (target === "project" ? projectEditorVersion : articleEditorVersion)) {
      void cleanupPendingUploads([result.url]);
    }
    if (cropIndex.value + 1 < cropFiles.value.length) cropIndex.value++;
    else closeCropAfterUpload();
  } catch (error: any) { cropError.value = error?.data?.statusMessage || "Image upload failed. Try again or cancel."; }
  finally {
    uploadingImage.value = false;
    uploadingArticleImage.value = false;
    uploadingArticleGallery.value = false;
  }
}
function closeCropAfterUpload() {
  cropTarget.value = null;
  cropFiles.value = [];
  cropIndex.value = 0;
  cropError.value = "";
}
function uploadImage(event: Event) { openCrop(event, "project"); }
function uploadArticleImage(event: Event) { openCrop(event, "article-cover"); }
function uploadArticleImages(event: Event) { openCrop(event, "article-gallery"); }
function uploadArticleInlineImage(event: Event) { inlineInsertionAt = articleTextarea.value?.selectionStart ?? (articleForm.content || "").length; openCrop(event, "article-inline"); }
function removeArticleGalleryImage(index: number) {
  const [url] = articleForm.image_urls?.splice(index, 1) || [];
  if (url) void cleanupPendingUploads([url]);
}
async function uploadCv(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0]; if (!file) return;
  const data = new FormData(); data.append("file", file); data.append("kind", "cv");
  uploadingCv.value = true;
  try {
    const result = await $fetch<{ url: string }>("/api/dashboard/upload", { method: "POST", body: data });
    trackPendingUpload(result.url, "cv");
    await $fetch("/api/dashboard/settings/cv", { method: "PUT", body: { cvUrl: result.url } });
    await settlePendingUploads("cv", [result.url]);
    await refreshCv(); notice.value = "CV uploaded and published.";
  } catch (error: any) { discardPendingUploads("cv"); notice.value = error?.data?.statusMessage || "CV upload failed."; }
  finally { uploadingCv.value = false; input.value = ""; }
}
async function saveArticle() {
  if (cropTarget.value?.startsWith("article-") || uploadingArticleImage.value || uploadingArticleGallery.value) return;
  saving.value = true; articleNotice.value = "";
  try {
    const path = selectedArticle.value ? `/api/dashboard/articles/${selectedArticle.value.id}` : "/api/dashboard/articles";
    const saved = await $fetch<PortfolioArticle>(path, { method: selectedArticle.value ? "PUT" : "POST", body: articleForm });
    await settlePendingUploads("article", [saved.image_url, ...saved.image_urls, ...extractArticleImageUrls(saved.content)]);
    await refreshArticles(); editArticle(); articleNotice.value = "Article saved.";
  } catch (error: any) { articleNotice.value = error?.data?.statusMessage || "Could not save article."; }
  finally { saving.value = false; }
}
async function removeArticle(article: PortfolioArticle) {
  if (uploadingArticleImage.value || uploadingArticleGallery.value || cropTarget.value?.startsWith("article-")) { articleNotice.value = "Finish the image upload before deleting an article."; return; }
  if (!confirm(`Delete “${article.title}”?`)) return;
  try {
    await $fetch(`/api/dashboard/articles/${article.id}`, { method: "DELETE" });
    if (selectedArticle.value?.id === article.id) editArticle();
    await refreshArticles(); articleNotice.value = "Article deleted.";
  }
  catch (error: any) { articleNotice.value = error?.data?.statusMessage || "Could not delete article."; }
}
async function setMessageRead(message: any, read: boolean) {
  try {
    const result = await $fetch<{ read_at: string | null }>(`/api/dashboard/messages/${message.id}`, { method: "PATCH", body: { read } });
    message.read_at = result.read_at; await Promise.all([refreshOverview(), refreshMessages()]);
  } catch (error: any) { inboxNotice.value = error?.data?.statusMessage || "Could not update message."; }
}
async function retryMessageEmail(message: any) {
  retryingEmailId.value = message.id;
  inboxNotice.value = "";
  try {
    await $fetch(`/api/dashboard/messages/${message.id}/retry-email`, { method: "POST" });
    inboxNotice.value = "Email notification sent.";
    await refreshMessages();
  } catch (error: any) {
    inboxNotice.value = error?.data?.statusMessage || "Email notification could not be sent.";
    await refreshMessages();
  } finally {
    retryingEmailId.value = null;
  }
}
async function setInboundRead(email: any, read: boolean) {
  try {
    await $fetch(`/api/dashboard/inbound-emails/${email.id}`, { method: "PATCH", body: { read } });
    await refreshInboundEmails();
  } catch (error: any) { inboxNotice.value = error?.data?.statusMessage || "Could not update email status."; }
}
async function togglePush() {
  inboxNotice.value = "";
  try { if (push.enabled.value) await push.disable(); else await push.enable(); }
  catch (error: any) { inboxNotice.value = error?.data?.statusMessage || error?.message || "Could not update notification settings."; }
}
async function testPush() {
  try { await $fetch("/api/push/test", { method: "POST" }); inboxNotice.value = "Test notification sent."; }
  catch (error: any) { inboxNotice.value = error?.data?.statusMessage || "Could not send a test notification."; }
}
async function installApp() {
  if (!installPrompt) return;
  await installPrompt.prompt();
  delete (window as Window & { portfolioInstallPrompt?: InstallPromptEvent }).portfolioInstallPrompt;
  installPrompt = null; installAvailable.value = false;
}
async function clearCv() {
  try { await $fetch("/api/dashboard/settings/cv", { method: "PUT", body: { cvUrl: "" } }); await refreshCv(); notice.value = "CV removed."; }
  catch (error: any) { notice.value = error?.data?.statusMessage || "Could not remove CV."; }
}
async function signOut() { await supabase.auth.signOut(); await navigateTo("/dashboard/login"); }
watch(user, async (value) => { if (!value) await navigateTo("/dashboard/login"); });
onMounted(() => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(pendingUploadsKey) || "[]") as [string, UploadContext][];
    for (const [url, context] of saved) if (["project", "article", "cv"].includes(context)) pendingUploads.set(url, context);
    void cleanupPendingUploads([...pendingUploads.keys()]);
  } catch { /* Storage may be disabled; uploads still work during this page visit. */ }
  void refreshOverview(); void refreshArticles(); void push.refresh().catch((error) => { inboxNotice.value = error?.data?.statusMessage || "Could not check notification devices."; });
  syncInstallPrompt();
  window.addEventListener("portfolio-install-available", syncInstallPrompt);
  window.addEventListener("portfolio-install-cleared", syncInstallPrompt);
  inboxRefreshTimer = setInterval(() => { void refreshOverview(); void refreshMessages(); void refreshInboundEmails(); }, 30_000);
});
onUnmounted(() => { if (inboxRefreshTimer) clearInterval(inboxRefreshTimer); window.removeEventListener("portfolio-install-available", syncInstallPrompt); window.removeEventListener("portfolio-install-cleared", syncInstallPrompt); void cleanupPendingUploads([...pendingUploads.keys()]); });
</script>
<template>
  <main class="min-h-screen bg-rich-black px-4 py-8 md:px-10">
    <header class="flex items-center justify-between max-w-7xl mx-auto mb-10">
      <div><NuxtLink to="/" class="eyebrow">Portfolio</NuxtLink><h1 class="font-serif text-4xl mt-2">Your dashboard</h1></div>
      <div class="flex flex-wrap items-center justify-end gap-2"><NuxtLink to="/blog" class="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest">View blog</NuxtLink><button v-if="installAvailable" class="bg-gold-accent text-rich-black px-4 py-2 text-xs uppercase tracking-widest" @click="installApp">Install app</button><button class="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest" @click="signOut">Sign out</button></div>
    </header>
    <div v-if="overviewError" class="max-w-7xl mx-auto border border-red-300/40 bg-red-950/20 text-red-200 p-4 mb-8 flex flex-wrap items-center justify-between gap-3"><p>{{ fetchErrorText(overviewError, 'Statistics and messages could not be loaded.') }}</p><button class="border border-red-300/40 px-3 py-2 text-xs uppercase tracking-widest" @click="() => refreshOverview()">Retry</button></div>
    <section class="max-w-7xl mx-auto bg-off-black border border-white/10 p-5 md:p-7 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <div><p class="eyebrow">Public CV</p><p v-if="cvError" class="text-sm text-red-300 mt-2">{{ fetchErrorText(cvError, 'CV settings could not be loaded.') }} <button class="underline" @click="() => refreshCv()">Retry</button></p><p v-else class="text-sm text-muted mt-2">{{ cvSettings?.cvUrl ? 'Your CV link is live on the portfolio.' : 'Upload a PDF to add a tracked CV link to the portfolio.' }}</p><a v-if="!cvError && cvSettings?.cvUrl" :href="cvSettings.cvUrl" target="_blank" rel="noreferrer" class="text-xs text-gold-accent break-all mt-2 inline-block">{{ cvSettings.cvUrl }}</a></div>
      <div class="flex items-center gap-3"><label class="border border-white/20 px-4 py-3 text-xs uppercase tracking-widest cursor-pointer hover:border-gold-accent" :class="uploadingCv ? 'opacity-50 pointer-events-none' : ''">{{ uploadingCv ? 'Uploading…' : 'Upload PDF' }}<input type="file" accept="application/pdf,.pdf" class="hidden" :disabled="uploadingCv" @change="uploadCv" /></label><button v-if="cvSettings?.cvUrl" class="text-xs text-red-300 px-3 py-2" @click="clearCv">Remove CV</button></div>
    </section>
    <section class="max-w-7xl mx-auto bg-off-black border border-white/10 p-5 md:p-7 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div><p class="eyebrow">Phone notifications</p><h2 class="font-serif text-2xl mt-2">Get a push alert for new messages</h2><p class="text-sm text-muted mt-2 max-w-2xl">Allow notifications on this device. When someone sends the contact form, their message is saved to your dashboard and an alert can be sent here.</p><p class="text-xs text-gold-accent mt-3">{{ push.deviceCount.value }} notification {{ push.deviceCount.value === 1 ? 'device' : 'devices' }} registered · {{ push.enabled.value ? 'this device is connected' : 'this device is not connected' }}</p><p v-if="inboxNotice" class="text-sm text-gold-accent mt-3">{{ inboxNotice }}</p><p class="text-xs text-muted mt-3">Install this site on your phone first, then enable notifications here. On iPhone, open it in Safari, tap Share, then Add to Home Screen.</p><p v-if="!push.supported.value" class="text-xs text-muted mt-2">This browser does not support web push. Install the PWA on a supported phone browser and try again.</p></div>
      <div class="flex flex-wrap gap-2 shrink-0"><button v-if="push.enabled.value" class="border border-white/20 px-4 py-3 text-xs uppercase tracking-widest" @click="testPush">Send test alert</button><button v-if="push.supported.value" class="px-5 py-3 text-xs uppercase tracking-widest" :class="push.enabled.value ? 'border border-gold-accent text-gold-accent' : 'bg-cream text-rich-black'" @click="togglePush">{{ push.enabled.value ? 'Disable notifications' : 'Enable notifications' }}</button></div>
    </section>
    <section class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 mb-10">
      <article v-for="metric in dashboardMetrics" :key="metric.label" class="bg-off-black border border-white/10 p-5"><p class="text-muted text-xs uppercase tracking-widest">{{ metric.label }}</p><p class="font-serif text-3xl mt-3">{{ metric.unavailable ? '—' : metric.value ?? 0 }}</p></article>
    </section>
    <div class="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
      <section class="bg-off-black border border-white/10 p-5 md:p-7">
        <div class="flex justify-between items-center mb-6"><h2 class="font-serif text-2xl">Projects</h2><button class="text-xs border border-white/20 px-3 py-2" @click="edit()">+ Add project</button></div>
        <p v-if="projectsError" class="text-red-300 text-sm">{{ fetchErrorText(projectsError, 'Projects could not be loaded.') }} <button class="underline" @click="() => refreshProjects()">Retry</button></p>
        <p v-else-if="!projects?.length" class="text-muted text-sm">No projects have been added yet.</p>
        <article v-for="project in projects" :key="project.id" class="flex items-center gap-4 py-4 border-t border-white/10">
          <img v-if="project.image_url" :src="project.image_url" class="w-14 h-14 object-cover bg-black" alt="" />
          <div class="flex-1 min-w-0"><p class="truncate">{{ project.title }}</p><p class="text-muted text-xs">{{ project.category }} · {{ project.status }}</p></div>
          <button class="text-xs text-gold-accent" @click="edit(project)">Edit</button><button class="text-xs text-red-300" @click="remove(project)">Delete</button>
        </article>
      </section>
      <form class="bg-off-black border border-white/10 p-5 md:p-7" @submit.prevent="save">
        <p class="eyebrow">Project editor</p><h2 class="font-serif text-3xl mt-2 mb-6">{{ selected ? 'Edit project' : 'Add a project' }}</h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <label class="text-xs text-muted">Title<input v-model="form.title" required class="field" /></label>
          <label class="text-xs text-muted">Slug<input v-model="form.slug" class="field" placeholder="auto from title" /></label>
          <label class="text-xs text-muted">Category<input v-model="form.category" class="field" /></label>
          <label class="text-xs text-muted">Status<select v-model="form.status" class="field"><option>Complete</option><option>In progress</option><option>Archived</option></select></label>
          <label class="text-xs text-muted sm:col-span-2">Short description<textarea v-model="form.summary" rows="2" class="field" /></label>
          <label class="text-xs text-muted sm:col-span-2">Project concept<textarea v-model="form.concept" rows="3" class="field" /></label>
          <label class="text-xs text-muted sm:col-span-2">How AI was used<textarea v-model="form.ai_experience" rows="2" class="field" /></label>
          <label class="text-xs text-muted sm:col-span-2">Technologies (comma separated)<input v-model="technologies" class="field" placeholder="Vue, Nuxt, PostgreSQL" /></label>
          <label class="text-xs text-muted sm:col-span-2">Project URL<input v-model="form.project_url" type="url" class="field" /></label>
          <label class="text-xs text-muted sm:col-span-2">Image URL<input v-model="form.image_url" class="field" /></label>
          <label class="text-xs text-muted sm:col-span-2">{{ uploadingImage ? 'Uploading image…' : 'Choose and crop project image' }}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="field" :disabled="uploadingImage" @change="uploadImage" /></label>
          <label class="text-xs text-muted flex items-center gap-3"><input v-model="form.featured" type="checkbox" />Feature on home page</label>
          <label class="text-xs text-muted flex items-center gap-3"><input v-model="form.preview_is_concept" type="checkbox" />Mark preview as concept artwork</label>
          <label class="text-xs text-muted">Order<input v-model.number="form.sort_order" type="number" class="field" /></label>
        </div>
        <p v-if="notice" class="text-sm text-gold-accent mt-4">{{ notice }}</p>
        <div class="flex gap-3 mt-6"><button class="bg-cream text-black px-5 py-3 text-xs uppercase tracking-widest disabled:opacity-50" :disabled="saving || uploadingImage || uploadingCv">{{ uploadingImage ? 'Wait for image…' : saving ? 'Saving…' : 'Save project' }}</button><button v-if="selected" type="button" class="border border-white/20 px-5 py-3 text-xs uppercase tracking-widest" @click="edit()">New project</button></div>
      </form>
    </div>
    <section id="inbox" class="max-w-7xl mx-auto bg-off-black border border-white/10 p-5 md:p-7 mt-8 scroll-mt-8">
      <div class="flex flex-wrap items-end justify-between gap-3 mb-5"><div><p class="eyebrow">Contact inbox</p><h2 class="font-serif text-3xl mt-2">Messages <span class="text-gold-accent">({{ overview?.unreadMessages || 0 }} unread)</span></h2><p class="text-sm text-muted mt-2">Every contact form submission is saved here; email is sent as an extra notification.</p></div><button class="border border-white/20 px-3 py-2 text-xs uppercase tracking-widest" @click="refreshInbox">Refresh inbox</button></div>
      <p v-if="inboxNotice" class="text-sm text-gold-accent mb-4">{{ inboxNotice }}</p>
      <p v-if="inboxError" class="text-red-300 text-sm border-t border-white/10 pt-5">{{ fetchErrorText(inboxError, 'Messages could not be loaded.') }}</p>
      <p v-else-if="!inbox?.messages?.length" class="text-muted text-sm border-t border-white/10 pt-5">{{ inboxPage > 1 ? 'No messages on this page.' : 'No messages yet. New contact form submissions will appear here.' }}</p>
      <article v-for="message in inboxError ? [] : inbox?.messages" :key="message.id" class="border-t border-white/10 py-5 grid md:grid-cols-[1fr_auto] gap-4">
        <div><div class="flex flex-wrap items-center gap-x-3 gap-y-1"><span class="text-xs uppercase tracking-widest" :class="message.read_at ? 'text-muted' : 'text-gold-accent'">{{ message.read_at ? 'Read' : 'New' }}</span><p class="font-medium">{{ message.name }} <span class="text-muted font-normal">· <a :href="`mailto:${message.email}`" class="hover:text-gold-accent">{{ message.email }}</a></span></p><time class="text-xs text-muted">{{ new Date(message.created_at).toLocaleString() }}</time></div><p class="text-sm text-gold-accent mt-3">{{ message.subject || 'Portfolio enquiry' }}</p><p class="text-sm text-muted mt-2 whitespace-pre-wrap leading-6">{{ message.message }}</p><p class="text-xs mt-3" :class="message.email_status === 'sent' ? 'text-gold-accent' : 'text-amber-300'">Email: {{ message.email_status || 'unknown' }}<span v-if="message.email_attempts"> · {{ message.email_attempts }} attempt{{ message.email_attempts === 1 ? '' : 's' }}</span></p><p v-if="message.email_error" class="text-xs text-amber-300 mt-1">{{ message.email_error }}</p></div>
        <div class="self-start flex md:flex-col gap-2"><button class="border border-white/20 px-3 py-2 text-xs uppercase tracking-widest hover:border-gold-accent" @click="setMessageRead(message, !message.read_at)">{{ message.read_at ? 'Mark unread' : 'Mark read' }}</button><button v-if="['failed', 'unconfigured', 'unknown'].includes(message.email_status) || (message.email_status === 'pending' && Date.now() - new Date(message.created_at).getTime() > 5 * 60_000)" class="border border-amber-300/40 px-3 py-2 text-xs uppercase tracking-widest text-amber-300 disabled:opacity-50" :disabled="retryingEmailId === message.id" @click="retryMessageEmail(message)">{{ retryingEmailId === message.id ? 'Sending…' : 'Retry email' }}</button></div>
      </article>
      <div v-if="!inboxError && (inbox?.total || 0) > (inbox?.pageSize || 20)" class="border-t border-white/10 pt-5 flex items-center justify-between gap-3 text-sm text-muted"><button class="border border-white/20 px-3 py-2 disabled:opacity-40" :disabled="inboxPage <= 1" @click="inboxPage--">Previous</button><span>Page {{ inboxPage }} of {{ Math.ceil((inbox?.total || 0) / (inbox?.pageSize || 20)) }}</span><button class="border border-white/20 px-3 py-2 disabled:opacity-40" :disabled="inboxPage >= Math.ceil((inbox?.total || 0) / (inbox?.pageSize || 20))" @click="inboxPage++">Next</button></div>
    </section>
    <section id="incoming-email" class="max-w-7xl mx-auto bg-off-black border border-white/10 p-5 md:p-7 mt-8 scroll-mt-8">
      <div class="flex flex-wrap items-end justify-between gap-3 mb-5"><div><p class="eyebrow">Direct email</p><h2 class="font-serif text-3xl mt-2">Incoming email</h2><p class="text-sm text-muted mt-2">Email received through your configured Resend address appears here.</p></div><button class="border border-white/20 px-3 py-2 text-xs uppercase tracking-widest" @click="() => refreshInboundEmails()">Refresh email</button></div>
      <p v-if="inboundError" class="text-red-300 text-sm">{{ fetchErrorText(inboundError, 'Incoming email could not be loaded.') }}</p>
      <p v-else-if="!inboundEmails?.emails.length" class="text-muted text-sm">No incoming email yet.</p>
      <article v-for="email in inboundError ? [] : inboundEmails?.emails" :key="email.id" class="border-t border-white/10 py-5 grid md:grid-cols-[1fr_auto] gap-4">
        <div><div class="flex flex-wrap items-center gap-3"><span class="text-xs uppercase tracking-widest" :class="email.read_at ? 'text-muted' : 'text-gold-accent'">{{ email.read_at ? 'Read' : 'New' }}</span><p class="font-medium">{{ email.sender }}</p><time class="text-xs text-muted">{{ new Date(email.received_at).toLocaleString() }}</time></div><p class="text-sm text-gold-accent mt-3">{{ email.subject || 'No subject' }}</p><p class="text-sm text-muted mt-2 whitespace-pre-wrap leading-6">{{ email.body }}</p><p v-if="email.attachment_count" class="text-xs text-muted mt-2">{{ email.attachment_count }} attachment{{ email.attachment_count === 1 ? '' : 's' }} · available in Resend</p><a :href="`mailto:${email.sender_email}`" class="inline-block text-xs text-gold-accent mt-3">Reply by email ↗</a></div>
        <button class="self-start border border-white/20 px-3 py-2 text-xs uppercase tracking-widest hover:border-gold-accent" @click="setInboundRead(email, !email.read_at)">{{ email.read_at ? 'Mark unread' : 'Mark read' }}</button>
      </article>
      <div v-if="!inboundError && (inboundEmails?.total || 0) > (inboundEmails?.pageSize || 20)" class="border-t border-white/10 pt-5 flex items-center justify-between gap-3 text-sm text-muted"><button class="border border-white/20 px-3 py-2 disabled:opacity-40" :disabled="emailPage <= 1" @click="emailPage--">Previous</button><span>Page {{ emailPage }} of {{ Math.ceil((inboundEmails?.total || 0) / (inboundEmails?.pageSize || 20)) }}</span><button class="border border-white/20 px-3 py-2 disabled:opacity-40" :disabled="emailPage >= Math.ceil((inboundEmails?.total || 0) / (inboundEmails?.pageSize || 20))" @click="emailPage++">Next</button></div>
    </section>
    <section id="articles" class="max-w-7xl mx-auto mt-8 grid lg:grid-cols-[.9fr_1.1fr] gap-8 items-start">
      <div class="bg-off-black border border-white/10 p-5 md:p-7">
        <div class="flex items-center justify-between gap-3 mb-5"><div><p class="eyebrow">Writing</p><h2 class="font-serif text-3xl mt-2">Blog articles</h2></div><button class="text-xs border border-white/20 px-3 py-2" @click="editArticle()">+ New article</button></div>
        <p v-if="articlesError" class="text-sm text-red-300">{{ fetchErrorText(articlesError, 'Articles could not be loaded.') }} <button class="underline" @click="() => refreshArticles()">Retry</button></p>
        <p v-else-if="!articles?.length" class="text-sm text-muted">No articles have been added yet.</p>
        <article v-for="article in articlesError ? [] : articles" :key="article.id" class="border-t border-white/10 py-4 flex items-start gap-3">
          <img v-if="article.image_url" :src="article.image_url" class="w-14 h-14 object-cover bg-black" alt="" />
          <div class="flex-1 min-w-0"><p class="font-serif text-xl">{{ article.title }}</p><p class="text-xs text-muted mt-1">{{ article.category }} · {{ article.status }} · {{ article.read_count || 0 }} reads</p><NuxtLink v-if="article.status === 'Published'" :to="`/blog/${article.slug}`" class="inline-block text-xs text-gold-accent mt-2">Read article ↗</NuxtLink></div>
          <button class="text-xs text-gold-accent" @click="editArticle(article)">Edit</button><button class="text-xs text-red-300" @click="removeArticle(article)">Delete</button>
        </article>
        <NuxtLink to="/blog" class="inline-block border-t border-white/10 pt-4 mt-2 text-xs uppercase tracking-widest text-gold-accent">Open public blog ↗</NuxtLink>
      </div>
      <form class="bg-off-black border border-white/10 p-5 md:p-7" @submit.prevent="saveArticle">
        <p class="eyebrow">Article editor</p><h3 class="font-serif text-3xl mt-2 mb-6">{{ selectedArticle ? 'Edit article' : 'Write an article' }}</h3>
        <div class="grid sm:grid-cols-2 gap-4">
          <label class="text-xs text-muted sm:col-span-2">Title<input v-model="articleForm.title" required maxlength="180" class="field" /></label>
          <label class="text-xs text-muted">URL slug<input v-model="articleForm.slug" class="field" placeholder="auto from title" /></label>
          <label class="text-xs text-muted">Category<input v-model="articleForm.category" class="field" placeholder="Notes, Story, Update" /></label>
          <label class="text-xs text-muted sm:col-span-2">Short intro<textarea v-model="articleForm.excerpt" rows="2" maxlength="500" class="field" placeholder="A short summary for the blog list" /></label>
          <div class="sm:col-span-2"><p class="text-xs text-muted">Article content · Markdown</p><div class="flex flex-wrap gap-2 mt-2"><button type="button" class="border border-white/20 px-3 py-2 text-xs" @click="insertArticleMarkdown('**', '**', 'bold text')">Bold</button><button type="button" class="border border-white/20 px-3 py-2 text-xs" @click="insertArticleMarkdown('*', '*', 'italic text')">Italic</button><button type="button" class="border border-white/20 px-3 py-2 text-xs" @click="insertArticleMarkdown('\n## ', '\n', 'Heading')">Heading</button><button type="button" class="border border-white/20 px-3 py-2 text-xs" @click="insertArticleMarkdown('\n- ', '\n', 'List item')">List</button><button type="button" class="border border-white/20 px-3 py-2 text-xs" @click="insertArticleMarkdown('[', '](https://example.com)', 'link text')">Link</button><label class="border border-gold-accent/50 text-gold-accent px-3 py-2 text-xs cursor-pointer">Insert image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="hidden" :disabled="uploadingArticleGallery" @change="uploadArticleInlineImage" /></label></div><textarea ref="articleTextarea" v-model="articleForm.content" required rows="14" class="field" placeholder="Write your story. Use the toolbar for headings, links, lists and images." /></div>
          <div v-if="articleForm.content" class="sm:col-span-2 border border-white/10 bg-rich-black p-5"><p class="eyebrow mb-4">Live preview</p><div class="article-prose text-sm leading-7" v-html="renderArticleMarkdown(articleForm.content)" /></div>
          <label class="text-xs text-muted">Visibility<select v-model="articleForm.status" class="field"><option>Draft</option><option>Published</option></select></label>
          <label class="text-xs text-muted">Cover image URL<input v-model="articleForm.image_url" type="text" class="field" placeholder="Optional https:// URL or /images/file.png" /></label>
          <label class="text-xs text-muted sm:col-span-2">{{ uploadingArticleImage ? 'Uploading cover…' : 'Choose and crop cover image' }}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="field" :disabled="uploadingArticleImage" @change="uploadArticleImage" /></label>
          <label class="text-xs text-muted sm:col-span-2">{{ uploadingArticleGallery ? 'Uploading images…' : 'Choose and crop article images (up to 12)' }}<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" class="field" :disabled="uploadingArticleGallery" @change="uploadArticleImages" /></label>
          <div v-if="articleForm.image_urls?.length" class="sm:col-span-2"><p class="text-xs text-muted mb-2">Article image gallery</p><div class="grid grid-cols-3 sm:grid-cols-4 gap-2"><div v-for="(image,index) in articleForm.image_urls" :key="image" class="relative aspect-square"><img :src="image" class="w-full h-full object-cover" alt="Article gallery image" /><button type="button" class="absolute top-1 right-1 bg-rich-black/90 text-red-200 px-2 py-1 text-xs" :aria-label="`Remove article image ${index + 1}`" @click="removeArticleGalleryImage(index)">×</button></div></div></div>
        </div>
        <p v-if="articleNotice" class="text-sm text-gold-accent mt-4">{{ articleNotice }}</p>
        <div class="flex gap-3 mt-6"><button class="bg-cream text-rich-black px-5 py-3 text-xs uppercase tracking-widest disabled:opacity-50" :disabled="saving || uploadingArticleImage || uploadingArticleGallery">{{ uploadingArticleImage || uploadingArticleGallery ? 'Wait for image upload…' : saving ? 'Saving…' : 'Save article' }}</button><button v-if="selectedArticle" type="button" class="border border-white/20 px-5 py-3 text-xs uppercase tracking-widest" @click="editArticle()">New article</button></div>
      </form>
    </section>
    <ImageCropper v-if="cropFile && cropTarget" :file="cropFile" :aspect-ratio="cropAspectRatio" :output-width="['article-gallery', 'article-inline'].includes(cropTarget) ? 1000 : 1200" :title="cropTitle" :busy="cropBusy" :external-error="cropError" @cancel="closeCrop" @cropped="uploadCroppedImage" />
  </main>
</template>
<style scoped>.field { display:block; width:100%; margin-top:.5rem; padding:.7rem .8rem; color:#f5f5f0; background:#141414; border:1px solid #ffffff24; font:inherit; font-size:.875rem; } option { background:#1c1c1c; }</style>
